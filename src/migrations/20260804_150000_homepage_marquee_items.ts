import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

type MediaDoc = { id: number; filesize?: number | null };

const MARQUEE_SEEDS = [
  {
    word: "Social",
    filename: "marquee-social.jpg",
    alt: "Tablet and Positivity book on textured fabric",
  },
  {
    word: "Cultured",
    filename: "marquee-cultured.jpg",
    alt: "Gold vessel and chain on burgundy surface",
  },
  {
    word: "Curated",
    filename: "marquee-curated.jpg",
    alt: "Founder in burgundy suit by a window",
  },
] as const;

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "home", filename);
}

async function upsertMedia(
  { payload, req }: Pick<MigrateUpArgs, "payload" | "req">,
  seed: (typeof MARQUEE_SEEDS)[number],
): Promise<number> {
  const filePath = sourcePath(seed.filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing seeded media file: ${filePath}`);
  }

  const sourceSize = fs.statSync(filePath).size;
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: seed.filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as MediaDoc;
    if (doc.filesize !== sourceSize) {
      await payload.update({
        collection: "media",
        id: doc.id,
        data: { alt: seed.alt },
        filePath,
        overrideAccess: true,
        req,
        depth: 0,
      });
    } else {
      await payload.update({
        collection: "media",
        id: doc.id,
        data: { alt: seed.alt },
        overrideAccess: true,
        req,
        depth: 0,
      });
    }
    return doc.id;
  }

  const created = await payload.create({
    collection: "media",
    data: { alt: seed.alt },
    filePath,
    overrideAccess: true,
    req,
    depth: 0,
  });
  return created.id as number;
}

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
    imageIds.push(await upsertMedia({ payload, req }, seed));
  }

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      marqueeWords: MARQUEE_SEEDS.map((seed, index) => ({
        word: seed.word,
        image: imageIds[index],
      })),
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "home-page",
    data: {
      marqueeWords: [
        { word: "Cultured" },
        { word: "Intentional" },
        { word: "Creative" },
        { word: "Bold" },
        { word: "Strategic" },
        { word: "Purposeful" },
      ],
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

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
