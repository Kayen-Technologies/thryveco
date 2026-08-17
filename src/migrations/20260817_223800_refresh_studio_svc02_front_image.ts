import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * Content Creation front image (Service 02) was updated in Figma.
 *
 * Assets live as studio-svc02-stack-01.jpg, but the linked media row was
 * uploaded as studio-svc02-stack-2.jpg (Payload renamed on seed). Refresh must
 * target the media filename, not the asset filename, or the studio-page global
 * keeps pointing at the stale blob.
 */
const REFRESH = {
  assetFilename: "studio-svc02-stack-01.jpg",
  mediaFilename: "studio-svc02-stack-2.jpg",
  alt: "Red compact camera, iced coffee, and sunglasses arranged on dark stone",
  caption: "Figma Content Creation stack front",
} as const;

function assetPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "studio", filename);
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const source = assetPath(REFRESH.assetFilename);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing studio asset: ${source}`);
  }

  // Upload under the existing media filename so the blob key and media.url stay
  // stable; only the bytes (and alt) change.
  const uploadPath = path.join(os.tmpdir(), REFRESH.mediaFilename);
  fs.copyFileSync(source, uploadPath);

  try {
    await upsertSeedMedia({
      payload,
      req,
      filePath: uploadPath,
      filename: REFRESH.mediaFilename,
      alt: REFRESH.alt,
      caption: REFRESH.caption,
    });
  } finally {
    fs.rmSync(uploadPath, { force: true });
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: keep refreshed media in place.
}
