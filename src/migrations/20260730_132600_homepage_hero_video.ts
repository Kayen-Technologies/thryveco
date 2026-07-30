import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

import { linkHomepageMedia, upsertHomepageMedia } from "./lib/seedHomepageMedia";

const HERO_MEDIA = [
  {
    filename: "hero.jpg",
    alt: "Founder reviewing work on a tablet",
    caption: "Figma homepage hero poster",
  },
  {
    filename: "hero.mp4",
    alt: "Thryve & Co home hero background video",
    caption: "Figma homepage hero video",
  },
] as const;

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  console.log("[Migration] Adding home_page.hero_hero_video_id...");

  await db.execute(sql`
    ALTER TABLE "home_page"
    ADD COLUMN IF NOT EXISTS "hero_hero_video_id" integer;
  `);

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'home_page_hero_hero_video_id_media_id_fk'
      ) THEN
        ALTER TABLE "home_page"
        ADD CONSTRAINT "home_page_hero_hero_video_id_media_id_fk"
        FOREIGN KEY ("hero_hero_video_id") REFERENCES "public"."media"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_hero_hero_hero_video_idx"
    ON "home_page" USING btree ("hero_hero_video_id");
  `);

  console.log("[Migration] Seeding hero poster + video...");

  const mediaByFilename = new Map<string, number>();

  for (const seed of HERO_MEDIA) {
    mediaByFilename.set(
      seed.filename,
      await upsertHomepageMedia({ payload, req, seed }),
    );
  }

  await linkHomepageMedia({ payload, req, mediaByFilename });

  console.log("[Migration] Done seeding homepage hero video");
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log("[Migration] Removing home_page.hero_hero_video_id...");

  await db.execute(sql`
    ALTER TABLE "home_page"
    DROP CONSTRAINT IF EXISTS "home_page_hero_hero_video_id_media_id_fk";
  `);

  await db.execute(sql`
    DROP INDEX IF EXISTS "home_page_hero_hero_hero_video_idx";
  `);

  await db.execute(sql`
    ALTER TABLE "home_page"
    DROP COLUMN IF EXISTS "hero_hero_video_id";
  `);
}
