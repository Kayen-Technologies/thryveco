import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

const SOURCE = path.resolve(process.cwd(), "public", "assets", "footer", "brand-card.jpg");
const FILENAME = "footer-brand-card.jpg";
const ALT = "Thryve & Co brand card held in hands";

type MediaDoc = { id: number; filesize?: number | null; filename?: string | null };

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  if (!fs.existsSync(SOURCE)) {
    throw new Error(`Missing seeded media file: ${SOURCE}`);
  }

  const sourceSize = fs.statSync(SOURCE).size;
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: FILENAME } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  let mediaId: number;

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as MediaDoc;
    mediaId = doc.id;
    await payload.update({
      collection: "media",
      id: doc.id,
      data: { alt: ALT },
      filePath: SOURCE,
      overrideAccess: true,
      req,
      depth: 0,
    });
  } else {
    const created = await payload.create({
      collection: "media",
      data: { alt: ALT },
      filePath: SOURCE,
      overrideAccess: true,
      req,
      depth: 0,
    });
    mediaId = created.id as number;
  }

  // Also refresh whatever file is currently linked (e.g. footer-brand-card-2.jpg)
  const settings = await payload.findGlobal({
    slug: "site-settings",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const currentFooterImage = (settings as { footerImage?: number | null }).footerImage;
  if (typeof currentFooterImage === "number" && currentFooterImage !== mediaId) {
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

  void sourceSize;
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Framing/asset refresh — no destructive rollback of media bytes.
}
