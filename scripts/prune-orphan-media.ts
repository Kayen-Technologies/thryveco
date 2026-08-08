/**
 * Removes Blob objects and local public/media files that no `media` row points at.
 *
 * Orphans accumulate when Payload dedupes an upload filename (foo.jpg → foo-1.jpg)
 * and the row is later renamed or replaced, leaving the original object stranded.
 *
 *   npm run media:prune              # dry run
 *   npm run media:prune -- --commit  # actually delete
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { del, list } from "@vercel/blob";
import type { Client } from "pg";

import {
  connect,
  dbUrlFrom,
  isLocalUrl,
  LOCAL_ENV,
  parseEnvFile,
  PROD_ENV,
  REPO_ROOT,
} from "./lib/env.ts";

const MEDIA_DIR = path.join(REPO_ROOT, "public", "media");
const KEEP_LOCAL = new Set([".gitkeep", ".DS_Store"]);

const commit = process.argv.includes("--commit");

function resolveConfig() {
  const prodEnv = parseEnvFile(PROD_ENV);
  const prodUrl = dbUrlFrom(prodEnv);
  const localUrl = dbUrlFrom(parseEnvFile(LOCAL_ENV));
  const token = prodEnv.BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN ?? "";

  const problems: string[] = [];
  if (!prodUrl) problems.push("no production DATABASE_URL");
  if (!localUrl) problems.push("no local DATABASE_URL");
  if (!token) problems.push("no BLOB_READ_WRITE_TOKEN");
  if (prodUrl && isLocalUrl(prodUrl)) {
    problems.push("production DATABASE_URL points at localhost");
  }

  if (problems.length > 0) {
    console.error("Missing configuration:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  return { prodUrl, localUrl, token };
}

async function filenamesIn(url: string): Promise<Set<string>> {
  const client: Client = await connect(url);
  try {
    const { rows } = await client.query<{ filename: string }>(
      `select filename from media where filename is not null`,
    );
    return new Set(rows.map((row) => row.filename));
  } finally {
    await client.end();
  }
}

async function blobKeys(token: string): Promise<Map<string, number>> {
  const keys = new Map<string, number>();
  let cursor: string | undefined;

  do {
    const page = await list({ token, cursor, limit: 1000 });
    for (const blob of page.blobs) keys.set(blob.pathname, blob.size);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return keys;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

async function pruneBlob(token: string, referenced: Set<string>): Promise<number> {
  const keys = await blobKeys(token);
  const orphans = [...keys.keys()]
    .filter((key) => !referenced.has(key))
    .sort((a, b) => a.localeCompare(b));

  console.log(`Blob: ${keys.size} objects, ${referenced.size} referenced, ${orphans.length} orphaned`);

  if (orphans.length === 0) return 0;

  for (const key of orphans) {
    console.log(`  ${commit ? "-" : "would delete"} ${key} (${formatBytes(keys.get(key) ?? 0)})`);
  }

  if (commit) {
    await del(orphans, { token });
    console.log(`  deleted ${orphans.length} Blob objects`);
  }

  return orphans.length;
}

function pruneLocal(referenced: Set<string>): number {
  if (!fs.existsSync(MEDIA_DIR)) {
    console.log("Local: no public/media directory");
    return 0;
  }

  const entries = fs
    .readdirSync(MEDIA_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !KEEP_LOCAL.has(entry.name));

  const orphans = entries
    .map((entry) => entry.name)
    .filter((name) => !referenced.has(name))
    .sort((a, b) => a.localeCompare(b));

  console.log(
    `Local: ${entries.length} files, ${referenced.size} referenced, ${orphans.length} orphaned`,
  );

  for (const name of orphans) {
    const size = fs.statSync(path.join(MEDIA_DIR, name)).size;
    console.log(`  ${commit ? "-" : "would delete"} ${name} (${formatBytes(size)})`);
    if (commit) fs.unlinkSync(path.join(MEDIA_DIR, name));
  }

  if (commit && orphans.length > 0) {
    console.log(`  deleted ${orphans.length} local files`);
  }

  return orphans.length;
}

async function main(): Promise<void> {
  const { prodUrl, localUrl, token } = resolveConfig();

  console.log(commit ? "Pruning orphaned media" : "[dry run] Pruning orphaned media");
  console.log();

  const prodFilenames = await filenamesIn(prodUrl);
  const localFilenames = await filenamesIn(localUrl);

  const blobOrphans = await pruneBlob(token, prodFilenames);
  console.log();

  // A local file is only disposable when neither database points at it —
  // production still needs its sources available for `media:upload`.
  const localOrphans = pruneLocal(new Set([...localFilenames, ...prodFilenames]));

  console.log();
  if (blobOrphans + localOrphans === 0) {
    console.log("Nothing to prune.");
    return;
  }

  console.log(
    commit
      ? `Pruned ${blobOrphans} Blob objects and ${localOrphans} local files.`
      : `Dry run: ${blobOrphans} Blob objects and ${localOrphans} local files would be deleted. Re-run with --commit.`,
  );
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
