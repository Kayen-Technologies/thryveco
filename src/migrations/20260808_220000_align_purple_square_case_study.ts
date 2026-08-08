import fs from "node:fs";
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

/**
 * Figma node 463:1748 — Purple Square Interiors case study.
 * Writes brand / challenge / approach / deliverables / results / quote and
 * upserts hero + brand + gallery media onto the live `purple-square-interiors` work.
 */
const SLUG = "purple-square-interiors";

type MediaDoc = { id: number; filesize?: number | null };

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
  filename: "psi-hero.jpg",
  assetFilename: "psi-hero.jpg",
  alt: "Styled shelf with ceramic vase, dried botanicals, and candle for Purple Square Interiors",
  caption: "Figma 463:1748 Purple Square Interiors case study hero",
  width: 3600,
  height: 2400,
  filesize: 1570559,
};

const BRAND_01: MediaSeed = {
  filename: "psi-brand-01.jpg",
  assetFilename: "psi-brand-01.jpg",
  alt: "Purple Square Interiors dining room with wood table and wall art",
  caption: "Figma 463:1748 PSI brand image 1",
  width: 1365,
  height: 2048,
  filesize: 492936,
};

const BRAND_02: MediaSeed = {
  filename: "psi-brand-02.jpg",
  assetFilename: "psi-brand-02.jpg",
  alt: "Purple Square Interiors bedroom with tufted headboard and bedside lamp",
  caption: "Figma 463:1748 PSI brand image 2",
  width: 2400,
  height: 3600,
  filesize: 1139068,
};

const GALLERY_01: MediaSeed = {
  filename: "psi-gallery-01.jpg",
  assetFilename: "psi-gallery-01.jpg",
  alt: "Brown lounge chair with white pillows and ceramic urn",
  caption: "Figma 463:1748 PSI gallery 1",
  width: 2400,
  height: 3600,
  filesize: 1905624,
};

const GALLERY_02: MediaSeed = {
  filename: "psi-gallery-02.jpg",
  assetFilename: "psi-gallery-02.jpg",
  alt: "Empty renovated room before furniture installation",
  caption: "Figma 463:1748 PSI gallery 2",
  width: 1080,
  height: 1920,
  filesize: 213789,
};

const GALLERY_03: MediaSeed = {
  filename: "psi-gallery-03.jpg",
  assetFilename: "psi-gallery-03.jpg",
  alt: "Founder reviewing materials in a furniture showroom",
  caption: "Figma 463:1748 PSI gallery 3",
  width: 1080,
  height: 1920,
  filesize: 452884,
};

const GALLERY_04: MediaSeed = {
  filename: "psi-gallery-04.jpg",
  assetFilename: "psi-gallery-04.jpg",
  alt: "Finished living room with ivory sofas and geometric coffee tables",
  caption: "Figma 463:1748 PSI gallery 4",
  width: 2400,
  height: 3600,
  filesize: 1283724,
};

function assetPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "works", "case-study", filename);
}

function publicMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "media", filename);
}

async function upsertMedia(
  payload: MigrateUpArgs["payload"],
  req: MigrateUpArgs["req"],
  seed: MediaSeed,
): Promise<number> {
  const filePath = assetPath(seed.assetFilename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing seeded media file: ${filePath}`);
  }

  fs.mkdirSync(path.dirname(publicMediaPath(seed.filename)), { recursive: true });
  fs.copyFileSync(filePath, publicMediaPath(seed.filename));

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
    const fileChanged = doc.filesize !== sourceSize;
    const missingOnDisk = !fs.existsSync(publicMediaPath(seed.filename));

    if (fileChanged || missingOnDisk) {
      await payload.delete({
        collection: "media",
        id: doc.id,
        overrideAccess: true,
        req,
      });
    } else {
      const updated = await payload.update({
        collection: "media",
        id: doc.id,
        data: { alt: seed.alt, caption: seed.caption },
        overrideAccess: true,
        req,
        depth: 0,
      });
      return (updated as MediaDoc).id;
    }
  }

  const created = await payload.create({
    collection: "media",
    data: { alt: seed.alt, caption: seed.caption },
    filePath,
    overrideAccess: true,
    req,
    depth: 0,
  });

  return (created as MediaDoc).id;
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
    fs.copyFileSync(assetPath(seed.assetFilename), publicMediaPath(seed.filename));
    await db.execute(sql`
      UPDATE "media"
      SET
        "filename" = ${seed.filename},
        "url" = ${`/api/media/file/${seed.filename}`},
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
      title: "Purple Square Interiors",
      client: "Purple Square Interiors",
      industry: "Interior Design Studio",
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
