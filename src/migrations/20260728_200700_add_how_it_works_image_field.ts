import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "drizzle-orm";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  console.log("[Migration] Adding image_id column to studio_page_how_it_works...");

  await db.execute(sql`
    ALTER TABLE "studio_page_how_it_works"
    ADD COLUMN IF NOT EXISTS "image_id" integer;
  `);

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'studio_page_how_it_works_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "studio_page_how_it_works"
        ADD CONSTRAINT "studio_page_how_it_works_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "studio_page_how_it_works_image_idx"
    ON "studio_page_how_it_works" USING btree ("image_id");
  `);

  console.log("[Migration] Done adding image_id column");
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log("[Migration] Removing image_id column from studio_page_how_it_works...");

  await db.execute(sql`
    DROP INDEX IF EXISTS "studio_page_how_it_works_image_idx";
  `);

  await db.execute(sql`
    ALTER TABLE "studio_page_how_it_works"
    DROP CONSTRAINT IF EXISTS "studio_page_how_it_works_image_id_media_id_fk";
  `);

  await db.execute(sql`
    ALTER TABLE "studio_page_how_it_works"
    DROP COLUMN IF EXISTS "image_id";
  `);

  console.log("[Migration] Done removing image_id column");
}
