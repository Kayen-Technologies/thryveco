import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * Same treatment as the Purple Square audio refresh: the Naya Moments and Mya
 * Art Workshop gallery clips were seeded from web encodes that had their audio
 * stream stripped. Remuxed from the originals — H.264 video track byte-identical
 * to what shipped, source AAC grafted on.
 *
 * Asset and media filenames match here (Payload did not rename these on seed),
 * so the blob key and media.url stay stable and only the bytes change. Payload
 * may still rename on update; gallery rows reference media by ID so that is fine.
 */
const REFRESH = [
  {
    filename: "naya-gallery-02.mp4",
    alt: "Essakobea event entrance with charcoal plinths, white florals and a champagne tower",
    caption: "Figma 463:1648 Naya gallery 2 video",
  },
  {
    filename: "naya-gallery-03.mp4",
    alt: "Candlelit walkway lined with red heart balloons for a Valentine's setup",
    caption: "Figma 463:1648 Naya gallery 3 video",
  },
  {
    filename: "mya-gallery-02.mp4",
    alt: "Coastal beach scene with a yellow hey! text overlay",
    caption: "Figma 463:1847 Mya gallery 2 video",
  },
  {
    filename: "mya-gallery-03.mp4",
    alt: "Workshop attendee in orange headscarf holding a framed mosaic heart artwork",
    caption: "Figma 463:1847 Mya gallery 3 video",
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
