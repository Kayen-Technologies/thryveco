/**
 * Compares the production database against local, table by table, and confirms
 * every media row has a matching object in Vercel Blob.
 *
 *   npm run prod:verify
 */

import process from "node:process";

import { list } from "@vercel/blob";
import type { Client } from "pg";

import { connect, dbUrlFrom, LOCAL_ENV, parseEnvFile, PROD_ENV } from "./lib/env.ts";

async function tableCounts(client: Client): Promise<Map<string, number>> {
  const { rows: tables } = await client.query<{ table_name: string }>(
    `select table_name
       from information_schema.tables
      where table_schema = 'public' and table_type = 'BASE TABLE'
      order by table_name`,
  );

  const counts = new Map<string, number>();
  for (const { table_name } of tables) {
    const { rows } = await client.query<{ count: string }>(
      `select count(*)::text as count from "${table_name}"`,
    );
    counts.set(table_name, Number(rows[0].count));
  }
  return counts;
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

function describeTableDrift(
  localCounts: Map<string, number>,
  prodCounts: Map<string, number>,
): string[] {
  const allTables = [
    ...new Set([...localCounts.keys(), ...prodCounts.keys()]),
  ].sort((a, b) => a.localeCompare(b));

  const drift: string[] = [];

  for (const table of allTables) {
    const local = localCounts.get(table);
    const prod = prodCounts.get(table);

    if (local === undefined) {
      drift.push(`  ${table}: missing locally (prod has ${prod})`);
    } else if (prod === undefined) {
      drift.push(`  ${table}: missing in prod (local has ${local})`);
    } else if (local !== prod) {
      drift.push(`  ${table}: local ${local} vs prod ${prod}`);
    }
  }

  console.log("Table row counts (local vs prod):");
  console.log(
    `  ${allTables.length} tables checked, ${allTables.length - drift.length} identical`,
  );
  if (drift.length > 0) {
    console.log("  drift:");
    for (const line of drift) console.log(line);
  }

  return drift;
}

async function checkBlobCoverage(prod: Client, token: string): Promise<number> {
  const { rows } = await prod.query<{ filename: string; filesize: string | null }>(
    `select filename, filesize
       from media
      where filename is not null
      order by id`,
  );

  if (!token) {
    console.log(`Media: ${rows.length} rows in prod — skipping Blob check (no token).`);
    return 0;
  }

  const keys = await blobKeys(token);
  const absent: string[] = [];
  const mismatched: string[] = [];

  for (const row of rows) {
    const size = keys.get(row.filename);
    if (size === undefined) {
      absent.push(row.filename);
    } else if (row.filesize !== null && Number(row.filesize) !== size) {
      mismatched.push(`${row.filename}: db ${row.filesize} vs blob ${size}`);
    }
  }

  console.log(
    `Media: ${rows.length} rows, ${keys.size} objects in Blob, ${absent.length} absent, ${mismatched.length} size mismatch`,
  );

  if (absent.length > 0) {
    console.log("  absent from Blob (these will 404):");
    for (const filename of absent) console.log(`    ${filename}`);
  }
  if (mismatched.length > 0) {
    console.log("  size mismatches:");
    for (const line of mismatched) console.log(`    ${line}`);
  }

  return absent.length + mismatched.length;
}

async function main(): Promise<void> {
  const prodEnv = parseEnvFile(PROD_ENV);

  const localUrl = dbUrlFrom(parseEnvFile(LOCAL_ENV));
  const prodUrl = dbUrlFrom(prodEnv);
  const token = prodEnv.BLOB_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN ?? "";

  if (!localUrl || !prodUrl) {
    console.error("Need DATABASE_URL in both .env.local and .env.production.local");
    process.exit(1);
  }

  const local = await connect(localUrl);
  const prod = await connect(prodUrl);

  let failures = 0;

  try {
    const drift = describeTableDrift(
      await tableCounts(local),
      await tableCounts(prod),
    );
    failures += drift.length;

    console.log();
    failures += await checkBlobCoverage(prod, token);

    const { rows } = await prod.query<{ count: string }>(
      `select count(*)::text as count from payload_migrations`,
    );
    console.log();
    console.log(`Migrations recorded in prod: ${rows[0].count}`);
  } finally {
    await local.end();
    await prod.end();
  }

  console.log();
  if (failures > 0) {
    console.log(`FAIL — ${failures} discrepancy/discrepancies above.`);
    process.exit(1);
  }
  console.log("PASS — production matches local.");
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
