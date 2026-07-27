import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

import {
  clearHomepageMediaLinks,
  linkHomepageMedia,
  seedAllHomepageMedia,
} from "./lib/seedHomepageMedia";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "intro_image_id" integer;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "marquee_image_id" integer;
    ALTER TABLE "home_page" ADD COLUMN IF NOT EXISTS "final_cta_image_id" integer;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page"
        ADD CONSTRAINT "home_page_intro_image_id_media_id_fk"
        FOREIGN KEY ("intro_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page"
        ADD CONSTRAINT "home_page_marquee_image_id_media_id_fk"
        FOREIGN KEY ("marquee_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "home_page"
        ADD CONSTRAINT "home_page_final_cta_image_id_media_id_fk"
        FOREIGN KEY ("final_cta_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_intro_image_idx" ON "home_page" USING btree ("intro_image_id");
    CREATE INDEX IF NOT EXISTS "home_page_marquee_image_idx" ON "home_page" USING btree ("marquee_image_id");
    CREATE INDEX IF NOT EXISTS "home_page_final_cta_image_idx" ON "home_page" USING btree ("final_cta_image_id");
  `);

  const mediaByFilename = await seedAllHomepageMedia({ payload, req });
  await linkHomepageMedia({ payload, req, mediaByFilename });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await clearHomepageMediaLinks({ payload, req });

  await db.execute(sql`
    ALTER TABLE "home_page" DROP CONSTRAINT IF EXISTS "home_page_intro_image_id_media_id_fk";
    ALTER TABLE "home_page" DROP CONSTRAINT IF EXISTS "home_page_marquee_image_id_media_id_fk";
    ALTER TABLE "home_page" DROP CONSTRAINT IF EXISTS "home_page_final_cta_image_id_media_id_fk";
    DROP INDEX IF EXISTS "home_page_intro_image_idx";
    DROP INDEX IF EXISTS "home_page_marquee_image_idx";
    DROP INDEX IF EXISTS "home_page_final_cta_image_idx";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "intro_image_id";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "marquee_image_id";
    ALTER TABLE "home_page" DROP COLUMN IF EXISTS "final_cta_image_id";
  `);
}
