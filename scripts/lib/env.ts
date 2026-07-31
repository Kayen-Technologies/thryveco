/** Shared env/database helpers for the production sync scripts. */

import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

export const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..");
export const LOCAL_ENV = path.join(REPO_ROOT, ".env.local");
export const PROD_ENV = path.join(REPO_ROOT, ".env.production.local");

/**
 * Minimal .env reader. Avoids shell sourcing, which chokes on unquoted values
 * such as `Thryve Co. <onboarding@resend.dev>`.
 */
export function parseEnvFile(file: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!fs.existsSync(file)) return out;

  for (const raw of fs.readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

function stripTrailingDots(value: string): string {
  let end = value.length;
  while (end > 0 && value[end - 1] === ".") end -= 1;
  return value.slice(0, end);
}

export function isLocalUrl(url: string): boolean {
  return url.includes("localhost") || url.includes("127.0.0.1");
}

/** Mirrors the fallback order in `getDatabasePoolConfig` in payload.config.ts. */
export function dbUrlFrom(env: Record<string, string>): string {
  const raw = env.DATABASE_URL || env.POSTGRES_URL || env.DATABASE_URI || "";
  return stripTrailingDots(raw.trim());
}

export async function connect(url: string): Promise<Client> {
  const client = new Client({
    connectionString: url,
    ...(isLocalUrl(url) ? {} : { ssl: { rejectUnauthorized: false } }),
  });
  await client.connect();
  // Neon pooler can leave search_path empty after DROP SCHEMA / recreate.
  await client.query("SET search_path TO public");
  return client;
}
