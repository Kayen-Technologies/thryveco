import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

type WorkDoc = { id: number };

const FEATURED_WORKS = [
  {
    slug: "purple-square-interiors",
    title: "Purple Square Interiors",
    client: "Purple Square Interiors",
    industry: "Interior Design Studio",
    tagline: "Interior Design Studio",
    tags: [
      "Brand Identity",
      "Content Strategy",
      "Digital Marketing",
      "Videography",
    ],
    filename: "work-purple-square.jpg",
    alt: "Purple Square Interiors styled shelf vignette",
    sortOrder: 1,
  },
  {
    slug: "naya-moments",
    title: "Naya Moments",
    client: "Naya Moments",
    industry: "Events Stylist",
    tagline: "Events Stylist",
    tags: [
      "Brand Identity",
      "Photography",
      "Social Media Management",
      "Videography",
    ],
    filename: "work-naya-moments.jpg",
    alt: "Naya Moments skincare dialogue event set",
    sortOrder: 2,
  },
  {
    slug: "mya-art-workshop",
    title: "Mya Art Workshop",
    client: "Mya Art Workshop",
    industry: "Art Studio",
    tagline: "Art Studio",
    tags: [
      "Brand Positioning",
      "Content Strategy",
      "Social Media Management",
      "Videography",
    ],
    filename: "work-mya-art.jpg",
    alt: "Mya Art Workshop studio with easels",
    sortOrder: 3,
  },
] as const;

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "home", filename);
}

async function upsertWork(
  { payload, req }: Pick<MigrateUpArgs, "payload" | "req">,
  seed: (typeof FEATURED_WORKS)[number],
  mediaId: number,
): Promise<number> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: seed.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const data = {
    title: seed.title,
    slug: seed.slug,
    client: seed.client,
    industry: seed.industry,
    tagline: seed.tagline,
    tags: seed.tags.map((tag) => ({ tag })),
    sortOrder: seed.sortOrder,
    coverImage: mediaId,
    heroImage: mediaId,
    publishedAt: new Date().toISOString(),
    _status: "published" as const,
  };

  if (existing.docs.length > 0) {
    const updated = await payload.update({
      collection: "works",
      id: (existing.docs[0] as WorkDoc).id,
      data,
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });
    return (updated as WorkDoc).id;
  }

  const created = await payload.create({
    collection: "works",
    data,
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
  return (created as WorkDoc).id;
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const workIds: number[] = [];

  for (const seed of FEATURED_WORKS) {
    const mediaId = await upsertSeedMedia({
      payload,
      req,
      filePath: sourcePath(seed.filename),
      filename: seed.filename,
      alt: seed.alt,
    });
    workIds.push(await upsertWork({ payload, req }, seed, mediaId));
  }

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      featuredWork: {
        headline: "Every brand has a story. We make sure it's one worth remembering.",
        works: workIds,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const legacy = await payload.find({
    collection: "works",
    where: {
      slug: {
        in: ["casa-muse", "sole", "aure", "lune"],
      },
    },
    limit: 4,
    depth: 0,
    overrideAccess: true,
    req,
  });

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      featuredWork: {
        headline: "Every brand has a story. We make sure it's one worth remembering.",
        works: legacy.docs.map((doc) => (doc as WorkDoc).id).slice(0, 3),
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}
