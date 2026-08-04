import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { del } from "@vercel/blob";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

const SOURCE = path.resolve(process.cwd(), "public", "assets", "footer", "brand-card.jpg");
const FILENAME = "footer-brand-card.jpg";
const ALT = "Thryve & Co brand card held in hands";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const mediaId = await upsertSeedMedia({
    payload,
    req,
    filePath: SOURCE,
    filename: FILENAME,
    alt: ALT,
  });

  // Also refresh whatever file is currently linked (e.g. footer-brand-card-2.jpg)
  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const currentFooterImage = (settings as { footerImage?: number | null }).footerImage;
  if (typeof currentFooterImage === "number" && currentFooterImage !== mediaId) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const linked = await payload.findByID({
      collection: "media",
      id: currentFooterImage,
      depth: 0,
      overrideAccess: true,
      req,
    });
    const linkedFilename =
      linked && typeof linked === "object" && "filename" in linked
        ? (linked.filename as string | null | undefined)
        : null;

    if (token && linkedFilename) {
      try {
        await del(linkedFilename, { token });
      } catch {
        // Missing blob is fine.
      }
    }

    await payload.update({
      collection: "media",
      id: currentFooterImage,
      data: { alt: ALT },
      filePath: SOURCE,
      overrideAccess: true,
      req,
      depth: 0,
    });
  }

  await payload.updateGlobal({
    slug: "site-settings",
    data: { footerImage: mediaId },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Framing/asset refresh — no destructive rollback of media bytes.
}
