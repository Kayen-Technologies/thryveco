import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

import {
  clearJournalPageContent,
  linkJournalPageContent,
  seedAllJournalMedia,
} from "./lib/seedJournalPageMedia";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "journal_page" ADD COLUMN IF NOT EXISTS "hero_image_id" integer;
    ALTER TABLE "journal_page" ADD COLUMN IF NOT EXISTS "entries_section_title" varchar DEFAULT 'Journal Entry';
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "journal_page"
        ADD CONSTRAINT "journal_page_hero_image_id_media_id_fk"
        FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "journal_page_hero_image_idx" ON "journal_page" USING btree ("hero_image_id");
  `);

  const mediaByFilename = await seedAllJournalMedia({ payload, req });
  await linkJournalPageContent({ payload, req, mediaByFilename });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await clearJournalPageContent({ payload, req });

  await db.execute(sql`
    ALTER TABLE "journal_page" DROP CONSTRAINT IF EXISTS "journal_page_hero_image_id_media_id_fk";
    DROP INDEX IF EXISTS "journal_page_hero_image_idx";
    ALTER TABLE "journal_page" DROP COLUMN IF EXISTS "hero_image_id";
    ALTER TABLE "journal_page" DROP COLUMN IF EXISTS "entries_section_title";
  `);
}
