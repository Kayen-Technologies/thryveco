import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * The Purple Square gallery clips were seeded from web encodes that had their
 * audio stream stripped, so the gallery sound toggle had nothing to unmute.
 * Both files have been remuxed from the originals: the H.264 video track is
 * byte-identical to what shipped, with the source AAC track grafted on.
 *
 * Asset and media filenames match here (Payload did not rename these on seed),
 * so the blob key and media.url stay stable and only the bytes change.
 */
const REFRESH = [
  {
    filename: "psi-gallery-02.mp4",
    alt: "Empty renovated room before furniture installation",
    caption: "Figma 463:1748 PSI gallery 2 video",
  },
  {
    filename: "psi-gallery-03.mp4",
    alt: "Founder reviewing materials in a furniture showroom",
    caption: "Figma 463:1748 PSI gallery 3 video",
  },
] as const;

function assetPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "works", "case-study", filename);
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const entry of REFRESH) {
    const source = assetPath(entry.filename);
    if (!fs.existsSync(source)) {
      throw new Error(`Missing case study asset: ${source}`);
    }

    await upsertSeedMedia({
      payload,
      req,
      filePath: source,
      filename: entry.filename,
      alt: entry.alt,
      caption: entry.caption,
    });

    console.log(`[Migration] Refreshed ${entry.filename} with its audio track`);
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: keep the refreshed media in place.
}
