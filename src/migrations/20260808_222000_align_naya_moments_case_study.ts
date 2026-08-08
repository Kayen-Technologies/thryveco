import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

import {
  CASE_STUDY_DEFAULTS,
  defaultApproachLexical,
  defaultBrandLexical,
  defaultChallengeLexical,
} from "@/components/works/caseStudyDefaults";
import type { Work } from "@/payload-types";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * Figma node 463:1648 — Naya Moments case study.
 * Writes brand / challenge / approach / deliverables / results / quote and
 * upserts hero + brand + gallery media onto the live `naya-moments` work.
 */
const SLUG = "naya-moments";

type MediaSeed = {
  filename: string;
  assetFilename: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  filesize: number;
};

const HERO: MediaSeed = {
  filename: "naya-hero.jpg",
  assetFilename: "naya-hero.jpg",
  alt: "The Skincare Dialogue event styled by Naya Moments with an arched backdrop and white armchairs",
  caption: "Figma 463:1648 Naya Moments case study hero",
  width: 3600,
  height: 2400,
  filesize: 1199466,
};

const BRAND_01: MediaSeed = {
  filename: "naya-brand-01.jpg",
  assetFilename: "naya-brand-01.jpg",
  alt: "Outdoor welcome baby tablescape with blush napkins, gold cutlery and scalloped table lamps",
  caption: "Figma 463:1648 Naya Moments brand image 1",
  width: 2400,
  height: 3600,
  filesize: 1699387,
};

const BRAND_02: MediaSeed = {
  filename: "naya-brand-02.jpg",
  assetFilename: "naya-brand-02.jpg",
  alt: "Garden reception table set beneath a suspended coral and pink floral installation",
  caption: "Figma 463:1648 Naya Moments brand image 2",
  width: 2400,
  height: 3600,
  filesize: 2314712,
};

const GALLERY_01: MediaSeed = {
  filename: "naya-gallery-01.jpg",
  assetFilename: "naya-gallery-01.jpg",
  alt: "Green and pink tablescape layered with florals, grapes and crystal glassware",
  caption: "Figma 463:1648 Naya Moments gallery 1",
  width: 2400,
  height: 3600,
  filesize: 2123803,
};

const GALLERY_02: MediaSeed = {
  filename: "naya-gallery-02.jpg",
  assetFilename: "naya-gallery-02.jpg",
  alt: "Essakobea event entrance with charcoal plinths, white florals and a champagne tower",
  caption: "Figma 463:1648 Naya Moments gallery 2",
  width: 1080,
  height: 1920,
  filesize: 337068,
};

const GALLERY_03: MediaSeed = {
  filename: "naya-gallery-03.jpg",
  assetFilename: "naya-gallery-03.jpg",
  alt: "Candlelit walkway lined with red heart balloons for a Valentine’s setup",
  caption: "Figma 463:1648 Naya Moments gallery 3",
  width: 1080,
  height: 1920,
  filesize: 299209,
};

const GALLERY_04: MediaSeed = {
  filename: "naya-gallery-04.jpg",
  assetFilename: "naya-gallery-04.jpg",
  alt: "Bridal shower wellness setup with yoga mats, arched mirrors and pastel florals",
  caption: "Figma 463:1648 Naya Moments gallery 4",
  width: 1206,
  height: 1499,
  filesize: 386405,
};

function assetPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "works", "case-study", filename);
}

/**
 * Never pre-copy the asset into `public/media`: Payload dedupes against an
 * existing file of the same name and silently renames the upload, which leaves
 * the Blob key and the `filename` column pointing at different objects.
 */
function upsertMedia(
  payload: MigrateUpArgs["payload"],
  req: MigrateUpArgs["req"],
  seed: MediaSeed,
): Promise<number> {
  return upsertSeedMedia({
    payload,
    req,
    filePath: assetPath(seed.assetFilename),
    filename: seed.filename,
    alt: seed.alt,
    caption: seed.caption,
  });
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const defaults = CASE_STUDY_DEFAULTS[SLUG];
  if (!defaults) {
    throw new Error(`Missing CASE_STUDY_DEFAULTS for ${SLUG}`);
  }

  const heroId = await upsertMedia(payload, req, HERO);
  const brand1 = await upsertMedia(payload, req, BRAND_01);
  const brand2 = await upsertMedia(payload, req, BRAND_02);
  const gallery1 = await upsertMedia(payload, req, GALLERY_01);
  const gallery2 = await upsertMedia(payload, req, GALLERY_02);
  const gallery3 = await upsertMedia(payload, req, GALLERY_03);
  const gallery4 = await upsertMedia(payload, req, GALLERY_04);

  const mediaIds: Array<{ seed: MediaSeed; id: number }> = [
    { seed: HERO, id: heroId },
    { seed: BRAND_01, id: brand1 },
    { seed: BRAND_02, id: brand2 },
    { seed: GALLERY_01, id: gallery1 },
    { seed: GALLERY_02, id: gallery2 },
    { seed: GALLERY_03, id: gallery3 },
    { seed: GALLERY_04, id: gallery4 },
  ];

  for (const { seed, id } of mediaIds) {
    await db.execute(sql`
      UPDATE "media"
      SET
        "width" = ${seed.width},
        "height" = ${seed.height},
        "filesize" = ${seed.filesize},
        "updated_at" = now()
      WHERE "id" = ${id}
    `);
  }

  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const doc = existing.docs[0] as { id: number } | undefined;
  if (!doc) {
    payload.logger.warn(`Work not found for case study seed: ${SLUG}`);
    return;
  }

  await payload.update({
    collection: "works",
    id: doc.id,
    data: {
      title: "Naya Moments",
      client: "Naya Moments",
      industry: "Events Stylist",
      seriesLabel: defaults.seriesLabel,
      heroImage: heroId,
      overview: (defaultBrandLexical(SLUG) ?? undefined) as Work["overview"],
      brandImages: [{ image: brand1 }, { image: brand2 }],
      problem: (defaultChallengeLexical(SLUG) ?? undefined) as Work["problem"],
      solution: (defaultApproachLexical(SLUG) ?? undefined) as Work["solution"],
      deliverables: defaults.deliverables.map((item) => ({ item })),
      results: defaults.results.map((item) => ({ item })),
      feedback: {
        quote: defaults.quote,
        attribution: defaults.attribution,
      },
      galleryImages: [
        { image: gallery1 },
        { image: gallery2 },
        { image: gallery3 },
        { image: gallery4 },
      ],
      publishedAt: null,
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });

  payload.logger.info(`Aligned case study content for: ${SLUG}`);
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

  const doc = existing.docs[0] as { id: number } | undefined;
  if (!doc) return;

  await payload.update({
    collection: "works",
    id: doc.id,
    data: {
      seriesLabel: "The Thryve Edit",
      overview: null,
      brandImages: [],
      problem: null,
      solution: null,
      deliverables: [],
      results: [],
      feedback: {
        quote: null,
        attribution: null,
      },
      galleryImages: [],
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}
