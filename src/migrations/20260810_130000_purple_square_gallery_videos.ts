import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

import type { Work } from "@/payload-types";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * Purple Square Interiors gallery tiles 2 and 3 (the two tall portraits) play
 * muted loops instead of stills. Adds the `video` upload to the gallery array —
 * live and version tables — then seeds both clips and links them.
 */
const SLUG = "purple-square-interiors";

/** Zero-based gallery rows: the upper-right and lower-left portraits. */
const UPPER_RIGHT_INDEX = 1;
const LOWER_LEFT_INDEX = 2;

const VIDEO_UPPER_RIGHT = {
  filename: "psi-gallery-02.mp4",
  alt: "Empty renovated room before furniture installation",
  caption: "Figma 463:1748 PSI gallery 2 video",
};

const VIDEO_LOWER_LEFT = {
  filename: "psi-gallery-03.mp4",
  alt: "Founder reviewing materials in a furniture showroom",
  caption: "Figma 463:1748 PSI gallery 3 video",
};

function assetPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "works", "case-study", filename);
}

const GALLERY_TABLES = [
  {
    table: "works_gallery_images",
    constraint: "works_gallery_images_video_id_media_id_fk",
    index: "works_gallery_images_video_idx",
  },
  {
    table: "_works_v_version_gallery_images",
    constraint: "_works_v_version_gallery_images_video_id_media_id_fk",
    index: "_works_v_version_gallery_images_video_idx",
  },
] as const;

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  console.log("[Migration] Adding gallery video columns...");

  for (const { table, constraint, index } of GALLERY_TABLES) {
    const tableRef = sql.raw(`"${table}"`);
    const constraintRef = sql.raw(`"${constraint}"`);
    const constraintName = sql.raw(`'${constraint}'`);
    const indexRef = sql.raw(`"${index}"`);

    await db.execute(sql`
      ALTER TABLE ${tableRef}
      ADD COLUMN IF NOT EXISTS "video_id" integer;
    `);

    await db.execute(sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = ${constraintName}
        ) THEN
          ALTER TABLE ${tableRef}
          ADD CONSTRAINT ${constraintRef}
          FOREIGN KEY ("video_id") REFERENCES "public"."media"("id")
          ON DELETE SET NULL ON UPDATE NO ACTION;
        END IF;
      END $$;
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS ${indexRef}
      ON ${tableRef} USING btree ("video_id");
    `);
  }

  console.log("[Migration] Seeding Purple Square gallery videos...");

  const upperRightId = await upsertSeedMedia({
    payload,
    req,
    filePath: assetPath(VIDEO_UPPER_RIGHT.filename),
    filename: VIDEO_UPPER_RIGHT.filename,
    alt: VIDEO_UPPER_RIGHT.alt,
    caption: VIDEO_UPPER_RIGHT.caption,
  });

  const lowerLeftId = await upsertSeedMedia({
    payload,
    req,
    filePath: assetPath(VIDEO_LOWER_LEFT.filename),
    filename: VIDEO_LOWER_LEFT.filename,
    alt: VIDEO_LOWER_LEFT.alt,
    caption: VIDEO_LOWER_LEFT.caption,
  });

  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const work = existing.docs[0] as Work | undefined;
  if (!work) {
    throw new Error(`Missing work for slug ${SLUG}`);
  }

  const gallery = work.galleryImages ?? [];
  if (gallery.length <= LOWER_LEFT_INDEX) {
    throw new Error(
      `Expected at least ${LOWER_LEFT_INDEX + 1} gallery rows on ${SLUG}, found ${gallery.length}`,
    );
  }

  const videoByIndex = new Map<number, number>([
    [UPPER_RIGHT_INDEX, upperRightId],
    [LOWER_LEFT_INDEX, lowerLeftId],
  ]);

  await payload.update({
    collection: "works",
    id: work.id,
    data: {
      galleryImages: gallery.map((entry, index) => ({
        ...entry,
        video: videoByIndex.get(index) ?? entry.video ?? null,
      })),
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });

  console.log("[Migration] Linked gallery videos to", SLUG);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  console.log("[Migration] Removing gallery video columns...");

  for (const { table, constraint, index } of GALLERY_TABLES) {
    const tableRef = sql.raw(`"${table}"`);
    const constraintRef = sql.raw(`"${constraint}"`);
    const indexRef = sql.raw(`"${index}"`);

    await db.execute(sql`
      ALTER TABLE ${tableRef}
      DROP CONSTRAINT IF EXISTS ${constraintRef};
    `);

    await db.execute(sql`DROP INDEX IF EXISTS ${indexRef};`);

    await db.execute(sql`
      ALTER TABLE ${tableRef}
      DROP COLUMN IF EXISTS "video_id";
    `);
  }
}
