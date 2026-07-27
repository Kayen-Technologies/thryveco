import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

async function upsertMediaFile({
  payload,
  req,
  sourcePath,
  filename,
  alt,
  caption,
}: {
  payload: Payload;
  req: Req;
  sourcePath: string;
  filename: string;
  alt: string;
  caption: string;
}): Promise<number> {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing seeded media file: ${sourcePath}`);
  }

  const mediaPath = path.resolve(process.cwd(), "public", "media", filename);
  fs.copyFileSync(sourcePath, mediaPath);

  const sourceSize = fs.statSync(sourcePath).size;
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length > 0) {
    return (existing.docs[0] as { id: number }).id;
  }

  const created = await payload.create({
    collection: "media",
    data: {
      alt,
      caption,
    },
    filePath: mediaPath,
    overrideAccess: true,
    req,
    depth: 0,
  });

  return (created as { id: number }).id;
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "footer_image_id" integer;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "site_settings"
        ADD CONSTRAINT "site_settings_footer_image_id_media_id_fk"
        FOREIGN KEY ("footer_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_settings_footer_image_idx"
    ON "site_settings" USING btree ("footer_image_id");
  `);

  const footerBrandCardId = await upsertMediaFile({
    payload,
    req,
    sourcePath: path.resolve(process.cwd(), "public", "assets", "footer", "brand-card.jpg"),
    filename: "footer-brand-card.jpg",
    alt: "Thryve & Co brand card held in hands",
    caption: "Figma footer brand card",
  });

  const logoDarkId = await upsertMediaFile({
    payload,
    req,
    sourcePath: path.resolve(process.cwd(), "public", "assets", "home", "nav-monogram.png"),
    filename: "nav-monogram.png",
    alt: "Thryve & Co monogram",
    caption: "Figma nav/footer monogram",
  });

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      tagline: "Making brands feel as good as they look.",
      footerLinks: [
        { label: "Home", href: "/" },
        { label: "Studio", href: "/studio" },
        { label: "Works", href: "/works" },
        { label: "Journal", href: "/journal" },
        { label: "About", href: "/about" },
      ],
      socialLinks: [
        { label: "Instagram", href: "https://instagram.com" },
        { label: "TikTok", href: "https://tiktok.com" },
      ],
      footerImage: footerBrandCardId,
      logoDark: logoDarkId,
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      footerImage: null,
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  await db.execute(sql`
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_footer_image_id_media_id_fk";
    DROP INDEX IF EXISTS "site_settings_footer_image_idx";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "footer_image_id";
  `);
}
