import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import type { Work } from "@/payload-types";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * Naya Moments gallery tiles 2 and 3 (the two tall portraits) play muted loops
 * instead of stills. The `video_id` columns already exist from the Purple
 * Square migration, so this only seeds the clips and links them.
 */
const SLUG = "naya-moments";

/** Zero-based gallery rows: the upper-right and lower-left portraits. */
const UPPER_RIGHT_INDEX = 1;
const LOWER_LEFT_INDEX = 2;

const VIDEO_UPPER_RIGHT = {
  filename: "naya-gallery-02.mp4",
  alt: "Essakobea event entrance with charcoal plinths, white florals and a champagne tower",
  caption: "Figma 463:1648 Naya gallery 2 video",
};

const VIDEO_LOWER_LEFT = {
  filename: "naya-gallery-03.mp4",
  alt: "Candlelit walkway lined with red heart balloons for a Valentine's setup",
  caption: "Figma 463:1648 Naya gallery 3 video",
};

function assetPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "works", "case-study", filename);
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  console.log("[Migration] Seeding Naya Moments gallery videos...");

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

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const work = existing.docs[0] as Work | undefined;
  if (!work) return;

  const gallery = work.galleryImages ?? [];

  await payload.update({
    collection: "works",
    id: work.id,
    data: {
      galleryImages: gallery.map((entry, index) => {
        if (index === UPPER_RIGHT_INDEX || index === LOWER_LEFT_INDEX) {
          return { ...entry, video: null };
        }
        return entry;
      }),
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}
