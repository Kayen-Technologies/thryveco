import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

const CTA_BG = {
  filename: "cta-bg.jpg",
  alt: "Creative work in progress",
};

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "works", filename);
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const filePath = sourcePath(CTA_BG.filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing works CTA asset: ${filePath}`);
  }

  const sourceSize = fs.statSync(filePath).size;
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: CTA_BG.filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  let mediaId: number;

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as { id: number; filesize?: number | null };
    const fileChanged = doc.filesize !== sourceSize;

    if (fileChanged) {
      const updated = await payload.update({
        collection: "media",
        id: doc.id,
        data: { alt: CTA_BG.alt },
        filePath,
        overrideAccess: true,
        req,
        depth: 0,
      });
      mediaId = updated.id;
    } else {
      mediaId = doc.id;
    }
  } else {
    const created = await payload.create({
      collection: "media",
      data: { alt: CTA_BG.alt },
      filePath,
      overrideAccess: true,
      req,
      depth: 0,
    });
    mediaId = created.id;
  }

  await payload.updateGlobal({
    slug: "works-page",
    data: {
      cta: {
        topLine: "READY TO BUILD A BRAND",
        topLineAccent: "PEOPLE REMEMBER?",
        bottomLine: "BEAUTIFUL BRANDS",
        bottomLineAccent: "START HERE",
        ctaLabel: "Book A Discovery Call",
        ctaHref: "/contact",
        backgroundImage: mediaId,
      },
    },
    depth: 0,
    overrideAccess: true,
    req,
  });
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No rollback — media refresh is idempotent.
}
