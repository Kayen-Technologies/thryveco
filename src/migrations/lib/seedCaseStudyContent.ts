import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import fs from "fs";
import path from "path";

import {
  CASE_STUDY_DEFAULTS,
  defaultApproachLexical,
  defaultBrandLexical,
  defaultChallengeLexical,
} from "@/components/works/caseStudyDefaults";
import type { Work } from "@/payload-types";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

const CASE_STUDY_SLUG = "casa-muse";

const CASE_STUDY_MEDIA = [
  { filename: "case-study-hero.jpg", source: "hero.jpg", alt: "Casa Muse interior design hero image" },
  {
    filename: "case-study-brand-01.jpg",
    source: "brand-01.jpg",
    alt: "Interior styling detail for Casa Muse",
  },
  {
    filename: "case-study-brand-02.jpg",
    source: "brand-02.jpg",
    alt: "Casa Muse brand materials on a styled surface",
  },
  {
    filename: "case-study-gallery-01.jpg",
    source: "gallery-01.jpg",
    alt: "Casa Muse project gallery image 1",
  },
  {
    filename: "case-study-gallery-02.jpg",
    source: "gallery-02.jpg",
    alt: "Casa Muse project gallery image 2",
  },
  {
    filename: "case-study-gallery-03.jpg",
    source: "gallery-03.jpg",
    alt: "Casa Muse project gallery image 3",
  },
  {
    filename: "case-study-gallery-04.jpg",
    source: "gallery-04.jpg",
    alt: "Casa Muse project gallery image 4",
  },
] as const;

async function seedMedia(payload: Payload, req: Req): Promise<Map<string, number>> {
  const mediaMap = new Map<string, number>();
  const assetsDir = path.join(process.cwd(), "public/assets/works/case-study");

  for (const item of CASE_STUDY_MEDIA) {
    const filePath = path.join(assetsDir, item.source);

    if (!fs.existsSync(filePath)) {
      payload.logger.warn(`Missing case study asset: ${filePath}`);
      continue;
    }

    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: item.filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (existing.docs.length > 0) {
      mediaMap.set(item.filename, existing.docs[0].id);
      continue;
    }

    const buffer = fs.readFileSync(filePath);

    const created = await payload.create({
      collection: "media",
      data: { alt: item.alt },
      file: {
        data: buffer,
        mimetype: "image/jpeg",
        name: item.filename,
        size: buffer.length,
      },
      overrideAccess: true,
      req,
    });

    mediaMap.set(item.filename, created.id);
    payload.logger.info(`Created case study media: ${item.filename}`);
  }

  return mediaMap;
}

export async function seedCaseStudyContent({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}): Promise<void> {
  const defaults = CASE_STUDY_DEFAULTS[CASE_STUDY_SLUG];
  if (!defaults) {
    payload.logger.warn(`No case study defaults for slug: ${CASE_STUDY_SLUG}`);
    return;
  }

  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: CASE_STUDY_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length === 0) {
    payload.logger.warn(`Work not found for case study seed: ${CASE_STUDY_SLUG}`);
    return;
  }

  const mediaMap = await seedMedia(payload, req);

  const heroImageId = mediaMap.get("case-study-hero.jpg");
  const brandImageIds = [
    mediaMap.get("case-study-brand-01.jpg"),
    mediaMap.get("case-study-brand-02.jpg"),
  ].filter((id): id is number => typeof id === "number");

  const galleryImageIds = [
    mediaMap.get("case-study-gallery-01.jpg"),
    mediaMap.get("case-study-gallery-02.jpg"),
    mediaMap.get("case-study-gallery-03.jpg"),
    mediaMap.get("case-study-gallery-04.jpg"),
  ].filter((id): id is number => typeof id === "number");

  await payload.update({
    collection: "works",
    id: existing.docs[0].id,
    data: {
      seriesLabel: defaults.seriesLabel,
      heroImage: heroImageId ?? undefined,
      overview: (defaultBrandLexical(CASE_STUDY_SLUG) ?? undefined) as Work["overview"],
      brandImages: brandImageIds.map((image) => ({ image })),
      problem: (defaultChallengeLexical(CASE_STUDY_SLUG) ?? undefined) as Work["problem"],
      solution: (defaultApproachLexical(CASE_STUDY_SLUG) ?? undefined) as Work["solution"],
      deliverables: defaults.deliverables.map((item) => ({ item })),
      results: defaults.results.map((item) => ({ item })),
      feedback: {
        quote: defaults.quote,
        attribution: defaults.attribution,
      },
      galleryImages: galleryImageIds.map((image) => ({ image })),
      publishedAt: new Date("2025-06-01").toISOString(),
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });

  payload.logger.info(`Seeded case study content for: ${CASE_STUDY_SLUG}`);
}

export async function clearCaseStudyContent({
  payload,
  req,
}: {
  payload: MigrateDownArgs["payload"];
  req: MigrateDownArgs["req"];
}): Promise<void> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: CASE_STUDY_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length === 0) return;

  await payload.update({
    collection: "works",
    id: existing.docs[0].id,
    data: {
      seriesLabel: null,
      heroImage: null,
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
