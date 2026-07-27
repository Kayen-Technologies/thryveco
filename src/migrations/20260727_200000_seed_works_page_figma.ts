import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import fs from "fs";
import path from "path";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

const WORKS_MEDIA = [
  {
    filename: "hero-backdrop.jpg",
    alt: "Decorative interior design backdrop",
  },
  {
    filename: "work-casa-muse.jpg",
    alt: "Casa Muse interior design showcase",
  },
  {
    filename: "work-sole.jpg",
    alt: "Solé skincare products",
  },
  {
    filename: "work-aure.jpg",
    alt: "Aure fine jewellery collection",
  },
  {
    filename: "work-lune.jpg",
    alt: "Lune luxury fragrance presentation",
  },
  {
    filename: "cta-bg.jpg",
    alt: "Creative work in progress",
  },
];

const WORK_UPDATES = [
  { slug: "casa-muse", industry: "Interior Design Studio", coverFilename: "work-casa-muse.jpg" },
  { slug: "sole", industry: "Skincare", coverFilename: "work-sole.jpg" },
  { slug: "aure", industry: "Fine Jewellery", coverFilename: "work-aure.jpg" },
  { slug: "lune", industry: "Luxury Fragrance", coverFilename: "work-lune.jpg" },
];

async function seedMedia(payload: Payload, req: Req): Promise<Map<string, number>> {
  const mediaMap = new Map<string, number>();
  const assetsDir = path.join(process.cwd(), "public/assets/works");

  for (const item of WORKS_MEDIA) {
    const filePath = path.join(assetsDir, item.filename);

    if (!fs.existsSync(filePath)) {
      payload.logger.warn(`Missing asset: ${filePath}`);
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
        mimetype: item.filename.endsWith(".svg") ? "image/svg+xml" : "image/jpeg",
        name: item.filename,
        size: buffer.length,
      },
      overrideAccess: true,
      req,
    });

    mediaMap.set(item.filename, created.id);
    payload.logger.info(`Created media: ${item.filename}`);
  }

  return mediaMap;
}

async function updateWorksPage(
  payload: Payload,
  req: Req,
  mediaMap: Map<string, number>,
): Promise<void> {
  const heroImageId = mediaMap.get("hero-backdrop.jpg");
  const ctaBgImageId = mediaMap.get("cta-bg.jpg");

  await payload.updateGlobal({
    slug: "works-page",
    data: {
      hero: {
        headline: "Good brands are built. Great brands are Thryved.",
        subheadline:
          "A collection of brands we've helped find their voice, their aesthetic, and their people.",
        heroImage: heroImageId ?? null,
      },
      portfolio: {
        title: "Brands We've Built",
      },
      cta: {
        topLine: "READY TO BUILD A BRAND",
        topLineAccent: "PEOPLE REMEMBER?",
        bottomLine: "BEAUTIFUL BRANDS",
        bottomLineAccent: "START HERE",
        ctaLabel: "Book A Discovery Call",
        ctaHref: "/contact",
        backgroundImage: ctaBgImageId ?? null,
      },
    },
    depth: 0,
    overrideAccess: true,
    req,
  });

  payload.logger.info("Updated works-page global");
}

async function updateWorks(
  payload: Payload,
  req: Req,
  mediaMap: Map<string, number>,
): Promise<void> {
  for (const work of WORK_UPDATES) {
    const existing = await payload.find({
      collection: "works",
      where: { slug: { equals: work.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (existing.docs.length === 0) {
      payload.logger.warn(`Work not found: ${work.slug}`);
      continue;
    }

    const coverImageId = mediaMap.get(work.coverFilename);

    await payload.update({
      collection: "works",
      id: existing.docs[0].id,
      data: {
        industry: work.industry,
        coverImage: coverImageId ?? undefined,
      },
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });

    payload.logger.info(`Updated work: ${work.slug}`);
  }
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const mediaMap = await seedMedia(payload, req);
  await updateWorksPage(payload, req, mediaMap);
  await updateWorks(payload, req, mediaMap);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info("Down migration: works page seeding is not reversible");
}
