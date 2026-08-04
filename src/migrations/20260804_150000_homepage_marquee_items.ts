import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

const MARQUEE_SEEDS = [
  {
    word: "Social",
    filename: "marquee-social.jpg",
    alt: "Tablet and Positivity book on textured fabric",
    rowId: "marquee-social",
  },
  {
    word: "Cultured",
    filename: "marquee-cultured.jpg",
    alt: "Gold vessel and chain on burgundy surface",
    rowId: "marquee-cultured",
  },
  {
    word: "Curated",
    filename: "marquee-curated.jpg",
    alt: "Founder in burgundy suit by a window",
    rowId: "marquee-curated",
  },
] as const;

const LEGACY_WORDS = [
  { word: "Cultured", rowId: "marquee-legacy-1" },
  { word: "Intentional", rowId: "marquee-legacy-2" },
  { word: "Creative", rowId: "marquee-legacy-3" },
  { word: "Bold", rowId: "marquee-legacy-4" },
  { word: "Strategic", rowId: "marquee-legacy-5" },
  { word: "Purposeful", rowId: "marquee-legacy-6" },
] as const;

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "home", filename);
}

/**
 * Seed marquee rows via SQL — do not use updateGlobal here.
 * Current config has featuredWork.works maxRows: 3, but production may still
 * have 4 linked works until 20260804_151500 runs. Local API validates the
 * whole global and fails with "4 is greater than the max allowed Rows of 3."
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_marquee_words"
    ADD COLUMN IF NOT EXISTS "image_id" integer;
  `);

  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'home_page_marquee_words_image_id_media_id_fk'
      ) THEN
        ALTER TABLE "home_page_marquee_words"
        ADD CONSTRAINT "home_page_marquee_words_image_id_media_id_fk"
        FOREIGN KEY ("image_id") REFERENCES "media"("id")
        ON DELETE SET NULL ON UPDATE NO ACTION;
      END IF;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "home_page_marquee_words_image_idx"
    ON "home_page_marquee_words" USING btree ("image_id");
  `);

  const imageIds: number[] = [];
  for (const seed of MARQUEE_SEEDS) {
    imageIds.push(
      await upsertSeedMedia({
        payload,
        req,
        filePath: sourcePath(seed.filename),
        filename: seed.filename,
        alt: seed.alt,
      }),
    );
  }

  await db.execute(sql`
    DELETE FROM "home_page_marquee_words"
  `);

  for (let index = 0; index < MARQUEE_SEEDS.length; index += 1) {
    const seed = MARQUEE_SEEDS[index];
    const imageId = imageIds[index];
    await db.execute(sql`
      INSERT INTO "home_page_marquee_words" ("_order", "_parent_id", "id", "word", "image_id")
      SELECT ${index + 1}, "home_page"."id", ${seed.rowId}, ${seed.word}, ${imageId}
      FROM "home_page"
      LIMIT 1
    `);
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DELETE FROM "home_page_marquee_words"
  `);

  for (let index = 0; index < LEGACY_WORDS.length; index += 1) {
    const seed = LEGACY_WORDS[index];
    await db.execute(sql`
      INSERT INTO "home_page_marquee_words" ("_order", "_parent_id", "id", "word")
      SELECT ${index + 1}, "home_page"."id", ${seed.rowId}, ${seed.word}
      FROM "home_page"
      LIMIT 1
    `);
  }

  await db.execute(sql`
    DROP INDEX IF EXISTS "home_page_marquee_words_image_idx";
  `);

  await db.execute(sql`
    ALTER TABLE "home_page_marquee_words"
    DROP CONSTRAINT IF EXISTS "home_page_marquee_words_image_id_media_id_fk";
  `);

  await db.execute(sql`
    ALTER TABLE "home_page_marquee_words"
    DROP COLUMN IF EXISTS "image_id";
  `);
}
