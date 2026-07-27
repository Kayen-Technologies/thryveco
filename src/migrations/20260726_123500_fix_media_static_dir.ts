import fs from "node:fs";
import path from "node:path";

import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import {
  HOMEPAGE_MEDIA_SEED,
  seedAllHomepageMedia,
  linkHomepageMedia,
} from "./lib/seedHomepageMedia";

const PUBLIC_MEDIA_DIR = path.resolve(process.cwd(), "public/media");
const LEGACY_MEDIA_DIR = path.resolve(process.cwd(), "media");

function ensurePublicMediaDir(): void {
  fs.mkdirSync(PUBLIC_MEDIA_DIR, { recursive: true });
}

function copyFileIfMissing(filename: string, sourceDir: string): void {
  const source = path.join(sourceDir, filename);
  const target = path.join(PUBLIC_MEDIA_DIR, filename);

  if (!fs.existsSync(source) || fs.existsSync(target)) return;

  fs.copyFileSync(source, target);
}

function syncMediaFilesToPublicDir(): void {
  ensurePublicMediaDir();

  for (const seed of HOMEPAGE_MEDIA_SEED) {
    copyFileIfMissing(seed.filename, LEGACY_MEDIA_DIR);
    copyFileIfMissing(
      seed.filename,
      path.resolve(process.cwd(), "public/assets/home"),
    );
  }
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  syncMediaFilesToPublicDir();

  const mediaByFilename = await seedAllHomepageMedia({ payload, req });
  await linkHomepageMedia({ payload, req, mediaByFilename });
}

export async function down(): Promise<void> {
  // File placement is corrected in place; no rollback required.
}
