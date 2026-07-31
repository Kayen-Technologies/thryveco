/**
 * Uploads every file referenced by the production `media` table into Vercel Blob.
 *
 *   npm run media:upload -- --dry-run
 *   npm run media:upload
 *
 * Blob keys must equal the `filename` column exactly: the storage adapter runs
 * with addRandomSuffix disabled and no prefix, so it looks files up by filename.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { head, put } from "@vercel/blob";
import type { Client } from "pg";

import {
  connect,
  dbUrlFrom,
  isLocalUrl,
  parseEnvFile,
  PROD_ENV,
  REPO_ROOT,
} from "./lib/env.ts";

const MEDIA_DIR = path.join(REPO_ROOT, "public", "media");
const CACHE_MAX_AGE = 60 * 60 * 24 * 365;
const CONCURRENCY = 4;

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");

type MediaRow = {
  id: number;
  filename: string;
  filesize: number | null;
  mimeType: string | null;
};

type Outcome = "uploaded" | "skipped" | "missing" | "failed";

const MARKERS: Record<Outcome, string> = {
  uploaded: "+",
  skipped: "=",
  missing: "!",
  failed: "!",
};

type Result = {
  filename: string;
  outcome: Outcome;
  detail?: string;
};

function resolveConfig() {
  const env = parseEnvFile(PROD_ENV);
  const databaseUrl = dbUrlFrom(env);
  const token = env.BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN ?? "";

  const problems: string[] = [];
  if (!databaseUrl) {
    problems.push("no DATABASE_URL / POSTGRES_URL / DATABASE_URI");
  }
  if (!token) {
    problems.push("no BLOB_READ_WRITE_TOKEN");
  }
  if (databaseUrl && isLocalUrl(databaseUrl)) {
    problems.push("DATABASE_URL points at localhost — expected production");
  }
  if (problems.length > 0) {
    console.error(`Missing configuration in ${path.relative(REPO_ROOT, PROD_ENV)}:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  return { databaseUrl, token };
}

async function fetchMediaRows(databaseUrl: string): Promise<MediaRow[]> {
  const client: Client = await connect(databaseUrl);
  try {
    const { rows } = await client.query<{
      id: number;
      filename: string | null;
      filesize: string | null;
      mime_type: string | null;
    }>(
      `select id, filename, filesize, mime_type
         from media
        where filename is not null
        order by id`,
    );

    return rows.map((row) => ({
      id: row.id,
      filename: row.filename as string,
      filesize: row.filesize === null ? null : Number(row.filesize),
      mimeType: row.mime_type,
    }));
  } finally {
    await client.end();
  }
}

async function existingBlobSize(
  filename: string,
  token: string,
): Promise<number | null> {
  try {
    const meta = await head(filename, { token });
    return meta.size;
  } catch {
    // head() throws BlobNotFoundError when the key is absent.
    return null;
  }
}

async function uploadOne(row: MediaRow, token: string): Promise<Result> {
  const filePath = path.join(MEDIA_DIR, row.filename);

  if (!fs.existsSync(filePath)) {
    return { filename: row.filename, outcome: "missing", detail: "no local file" };
  }

  const localSize = fs.statSync(filePath).size;

  if (!force) {
    const remoteSize = await existingBlobSize(row.filename, token);
    if (remoteSize === localSize) {
      return { filename: row.filename, outcome: "skipped", detail: "already in Blob" };
    }
    if (remoteSize !== null) {
      console.log(
        `  ~ ${row.filename}: size differs (blob ${remoteSize} vs local ${localSize}), re-uploading`,
      );
    }
  }

  if (dryRun) {
    return {
      filename: row.filename,
      outcome: "uploaded",
      detail: `would upload ${formatBytes(localSize)}`,
    };
  }

  try {
    const body = fs.readFileSync(filePath);
    const result = await put(row.filename, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: CACHE_MAX_AGE,
      token,
      ...(row.mimeType ? { contentType: row.mimeType } : {}),
    });

    const verified = await existingBlobSize(row.filename, token);
    if (verified !== localSize) {
      return {
        filename: row.filename,
        outcome: "failed",
        detail: `size mismatch after upload (blob ${verified}, local ${localSize})`,
      };
    }

    return {
      filename: row.filename,
      outcome: "uploaded",
      detail: `${formatBytes(localSize)} → ${new URL(result.url).pathname}`,
    };
  } catch (error) {
    return {
      filename: row.filename,
      outcome: "failed",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Duplicate filenames would race on the same Blob key. */
function assertUniqueFilenames(rows: MediaRow[]): void {
  const seen = new Map<string, number[]>();
  for (const row of rows) {
    seen.set(row.filename, [...(seen.get(row.filename) ?? []), row.id]);
  }

  const dupes = [...seen.entries()].filter(([, ids]) => ids.length > 1);
  if (dupes.length > 0) {
    console.error("Duplicate filenames in the media table:");
    for (const [filename, ids] of dupes) {
      console.error(`  ${filename} → media ids ${ids.join(", ")}`);
    }
    process.exit(1);
  }
}

async function runPool(rows: MediaRow[], token: string): Promise<Result[]> {
  const results: Result[] = [];
  let cursor = 0;
  let done = 0;

  const worker = async () => {
    while (cursor < rows.length) {
      const row = rows[cursor++];
      const result = await uploadOne(row, token);
      results.push(result);
      done += 1;

      const marker = MARKERS[result.outcome];
      console.log(
        `  [${String(done).padStart(String(rows.length).length)}/${rows.length}] ${marker} ${result.filename}` +
          (result.detail ? ` (${result.detail})` : ""),
      );
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, rows.length) }, worker),
  );

  return results;
}

async function main(): Promise<void> {
  const { databaseUrl, token } = resolveConfig();

  const storeId = /^vercel_blob_rw_([a-z\d]+)_/i.exec(token)?.[1];
  if (!storeId) {
    console.error("BLOB_READ_WRITE_TOKEN is malformed (expected vercel_blob_rw_<store>_<secret>).");
    process.exit(1);
  }

  console.log(
    `${dryRun ? "[dry run] " : ""}Uploading media to Blob store ${storeId.toLowerCase()}`,
  );
  console.log(`Source files: ${path.relative(REPO_ROOT, MEDIA_DIR)}`);
  console.log();

  const rows = await fetchMediaRows(databaseUrl);
  if (rows.length === 0) {
    console.error("No media rows found. Run the database clone first.");
    process.exit(1);
  }

  assertUniqueFilenames(rows);
  console.log(`${rows.length} media rows to reconcile:`);

  const results = await runPool(rows, token);

  const tally = (outcome: Outcome) => results.filter((r) => r.outcome === outcome);
  const uploaded = tally("uploaded");
  const skipped = tally("skipped");
  const missing = tally("missing");
  const failed = tally("failed");

  console.log();
  console.log(
    `uploaded ${uploaded.length}  skipped ${skipped.length}  missing ${missing.length}  failed ${failed.length}`,
  );

  if (missing.length > 0) {
    console.log();
    console.log("Missing local files (media rows will 404):");
    for (const r of missing) console.log(`  ${r.filename}`);
  }

  if (failed.length > 0) {
    console.log();
    console.log("Failures:");
    for (const r of failed) console.log(`  ${r.filename}: ${r.detail}`);
  }

  if (failed.length > 0 || missing.length > 0) {
    process.exit(1);
  }

  console.log();
  console.log(dryRun ? "Dry run complete." : "All media present in Blob.");
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
