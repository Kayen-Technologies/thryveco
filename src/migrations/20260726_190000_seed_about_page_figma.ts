import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

import {
  clearAboutPageContent,
  linkAboutPageContent,
  seedAllAboutMedia,
} from "./lib/seedAboutPageMedia";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "hero_image_id" integer;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "founder_story_headline_lead" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "founder_story_headline_muted" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "founder_story_headline_end" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "founder_story_paragraph_one" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "founder_story_paragraph_two" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "founder_story_story_image_id" integer;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "what_thryve_intro" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "what_thryve_agency_copy" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "what_thryve_aspiration_copy" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "what_thryve_image_id" integer;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "cta_subtext" varchar;
    ALTER TABLE "about_page" ADD COLUMN IF NOT EXISTS "cta_image_id" integer;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page"
        ADD CONSTRAINT "about_page_hero_image_id_media_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page"
        ADD CONSTRAINT "about_page_founder_story_story_image_id_media_id_fk"
        FOREIGN KEY ("founder_story_story_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page"
        ADD CONSTRAINT "about_page_what_thryve_image_id_media_id_fk"
        FOREIGN KEY ("what_thryve_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "about_page"
        ADD CONSTRAINT "about_page_cta_image_id_media_id_fk"
        FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "about_page_hero_image_idx" ON "about_page" USING btree ("hero_image_id");
    CREATE INDEX IF NOT EXISTS "about_page_founder_story_story_image_idx" ON "about_page" USING btree ("founder_story_story_image_id");
    CREATE INDEX IF NOT EXISTS "about_page_what_thryve_image_idx" ON "about_page" USING btree ("what_thryve_image_id");
    CREATE INDEX IF NOT EXISTS "about_page_cta_image_idx" ON "about_page" USING btree ("cta_image_id");
  `);

  const mediaByFilename = await seedAllAboutMedia({ payload, req });
  await linkAboutPageContent({ payload, req, mediaByFilename });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await clearAboutPageContent({ payload, req });

  await db.execute(sql`
    ALTER TABLE "about_page" DROP CONSTRAINT IF EXISTS "about_page_hero_image_id_media_id_fk";
    ALTER TABLE "about_page" DROP CONSTRAINT IF EXISTS "about_page_founder_story_story_image_id_media_id_fk";
    ALTER TABLE "about_page" DROP CONSTRAINT IF EXISTS "about_page_what_thryve_image_id_media_id_fk";
    ALTER TABLE "about_page" DROP CONSTRAINT IF EXISTS "about_page_cta_image_id_media_id_fk";
    DROP INDEX IF EXISTS "about_page_hero_image_idx";
    DROP INDEX IF EXISTS "about_page_founder_story_story_image_idx";
    DROP INDEX IF EXISTS "about_page_what_thryve_image_idx";
    DROP INDEX IF EXISTS "about_page_cta_image_idx";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "hero_image_id";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "founder_story_headline_lead";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "founder_story_headline_muted";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "founder_story_headline_end";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "founder_story_paragraph_one";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "founder_story_paragraph_two";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "founder_story_story_image_id";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "what_thryve_intro";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "what_thryve_agency_copy";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "what_thryve_aspiration_copy";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "what_thryve_image_id";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "cta_subtext";
    ALTER TABLE "about_page" DROP COLUMN IF EXISTS "cta_image_id";
  `);
}
