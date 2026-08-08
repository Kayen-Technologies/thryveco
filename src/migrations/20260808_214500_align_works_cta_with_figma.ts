import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Figma node 488:1532 — the Works page CTA is the shared burgundy FinalCta panel,
 * not the old white-frame WorksCta. Realign the `works_page` global `cta` group to
 * the FinalCta shape (headline / subtext / image) used by home, about and studio,
 * reusing the homepage copy so every page CTA reads identically.
 */
const HEADLINE = "Your Next Brand Move Starts Here.";
const SUBTEXT =
  "Your brand deserves more than content that fills a feed. Let’s build a strategy, presence, and visual identity people actually remember.";
const CTA_LABEL = "Book My Discovery Call";
const CTA_HREF = "/contact";
const IMAGE_FILENAME = "final-cta.jpg";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "works_page"
    ADD COLUMN IF NOT EXISTS "cta_subtext" varchar,
    ADD COLUMN IF NOT EXISTS "cta_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL;
  `);

  await db.execute(sql`
    UPDATE "works_page"
    SET
      "cta_headline" = ${HEADLINE},
      "cta_subtext" = ${SUBTEXT},
      "cta_cta_label" = ${CTA_LABEL},
      "cta_cta_href" = ${CTA_HREF},
      "cta_image_id" = (SELECT "id" FROM "media" WHERE "filename" = ${IMAGE_FILENAME} LIMIT 1)
  `);

  await db.execute(sql`
    ALTER TABLE "works_page"
    DROP COLUMN IF EXISTS "cta_top_line",
    DROP COLUMN IF EXISTS "cta_top_line_accent",
    DROP COLUMN IF EXISTS "cta_bottom_line",
    DROP COLUMN IF EXISTS "cta_bottom_line_accent",
    DROP COLUMN IF EXISTS "cta_background_image_id";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "works_page"
    ADD COLUMN IF NOT EXISTS "cta_top_line" varchar,
    ADD COLUMN IF NOT EXISTS "cta_top_line_accent" varchar,
    ADD COLUMN IF NOT EXISTS "cta_bottom_line" varchar,
    ADD COLUMN IF NOT EXISTS "cta_bottom_line_accent" varchar,
    ADD COLUMN IF NOT EXISTS "cta_background_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL;
  `);

  await db.execute(sql`
    UPDATE "works_page"
    SET
      "cta_headline" = NULL,
      "cta_top_line" = 'READY TO BUILD A BRAND',
      "cta_top_line_accent" = 'PEOPLE REMEMBER?',
      "cta_bottom_line" = 'BEAUTIFUL BRANDS',
      "cta_bottom_line_accent" = 'START HERE',
      "cta_cta_label" = 'Book A Discovery Call',
      "cta_cta_href" = '/contact'
  `);

  await db.execute(sql`
    ALTER TABLE "works_page"
    DROP COLUMN IF EXISTS "cta_subtext",
    DROP COLUMN IF EXISTS "cta_image_id";
  `);
}
