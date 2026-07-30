import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type MediaDoc = {
  id: number;
  filesize?: number | null;
};

export type MediaSeed = {
  filename: string;
  alt: string;
  caption: string;
};

export const HOMEPAGE_MEDIA_SEED: MediaSeed[] = [
  {
    filename: "hero.jpg",
    alt: "Founder reviewing work on a tablet",
    caption: "Figma homepage hero poster",
  },
  {
    filename: "hero.mp4",
    alt: "Thryve & Co home hero background video",
    caption: "Figma homepage hero video",
  },
  {
    filename: "intro-portrait.jpg",
    alt: "Thryve & Co intro portrait",
    caption: "Figma homepage intro portrait",
  },
  {
    filename: "marquee-photo.jpg",
    alt: "Thryve & Co marquee portrait",
    caption: "Figma homepage marquee photo",
  },
  {
    filename: "final-cta.jpg",
    alt: "Thryve & Co final call-to-action background",
    caption: "Figma homepage final CTA",
  },
  {
    filename: "work-01.jpg",
    alt: "Casa Muse project image",
    caption: "Figma featured work band 1",
  },
  {
    filename: "work-02.jpg",
    alt: "SOLE skincare project image",
    caption: "Figma featured work band 2",
  },
  {
    filename: "work-03.jpg",
    alt: "Aure fine jewellery project image",
    caption: "Figma featured work band 3",
  },
  {
    filename: "work-04.jpg",
    alt: "Lune luxury fragrance project image",
    caption: "Figma featured work band 4",
  },
];

export const WORK_IMAGE_MAP: Array<{ slug: string; filename: string }> = [
  { slug: "casa-muse", filename: "work-01.jpg" },
  { slug: "sole", filename: "work-02.jpg" },
  { slug: "aure", filename: "work-03.jpg" },
  { slug: "lune", filename: "work-04.jpg" },
];

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "home", filename);
}

function publicMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "media", filename);
}

export async function upsertHomepageMedia({
  payload,
  req,
  seed,
}: {
  payload: Payload;
  req: Req;
  seed: MediaSeed;
}): Promise<number> {
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
    const fileChanged = doc.filesize !== sourceSize;
    const missingOnDisk = !fs.existsSync(publicMediaPath(seed.filename));

    if (fileChanged || missingOnDisk) {
      const updated = await payload.update({
        collection: "media",
        id: doc.id,
        data: { alt: seed.alt, caption: seed.caption },
        filePath,
        overrideAccess: true,
        req,
        depth: 0,
      });
      return (updated as MediaDoc).id;
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

export async function seedAllHomepageMedia({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}): Promise<Map<string, number>> {
  const mediaByFilename = new Map<string, number>();

  for (const seed of HOMEPAGE_MEDIA_SEED) {
    mediaByFilename.set(seed.filename, await upsertHomepageMedia({ payload, req, seed }));
  }

  return mediaByFilename;
}

type HomeGlobal = {
  hero?: {
    headline?: string | null;
    headlineEmphasis?: string | null;
    tagline?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    heroImage?: number | null;
    heroVideo?: number | null;
  };
  intro?: {
    headline?: string | null;
    body?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    image?: number | null;
  };
  marquee?: {
    image?: number | null;
  };
  finalCta?: {
    headline?: string | null;
    subtext?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    image?: number | null;
  };
};

export async function linkHomepageMedia({
  payload,
  req,
  mediaByFilename,
}: {
  payload: Payload;
  req: Req;
  mediaByFilename: Map<string, number>;
}): Promise<void> {
  for (const mapping of WORK_IMAGE_MAP) {
    const mediaId = mediaByFilename.get(mapping.filename);
    if (!mediaId) continue;

    const result = await payload.find({
      collection: "works",
      where: { slug: { equals: mapping.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (result.docs.length === 0) continue;

    await payload.update({
      collection: "works",
      id: (result.docs[0] as { id: number }).id,
      data: {
        heroImage: mediaId,
        coverImage: mediaId,
        _status: "published",
      },
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });
  }

  const current = (await payload.findGlobal({
    slug: "home-page",
    depth: 0,
    overrideAccess: true,
    req,
  })) as HomeGlobal;

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      hero: {
        headline: current.hero?.headline ?? "Your Brand's New Creative Friend",
        headlineEmphasis: current.hero?.headlineEmphasis ?? "Creative Friend",
        tagline: current.hero?.tagline ?? "",
        ctaLabel: current.hero?.ctaLabel ?? "Book a Call",
        ctaHref: current.hero?.ctaHref ?? "/contact",
        heroImage: mediaByFilename.get("hero.jpg") ?? current.hero?.heroImage ?? null,
        heroVideo: mediaByFilename.get("hero.mp4") ?? current.hero?.heroVideo ?? null,
      },
      intro: {
        headline: current.intro?.headline ?? "Growth should look as good as it performs.",
        body: current.intro?.body ?? "",
        ctaLabel: current.intro?.ctaLabel ?? "Book a Discovery Call",
        ctaHref: current.intro?.ctaHref ?? "/contact",
        image: mediaByFilename.get("intro-portrait.jpg") ?? current.intro?.image ?? null,
      },
      marquee: {
        image: mediaByFilename.get("marquee-photo.jpg") ?? current.marquee?.image ?? null,
      },
      finalCta: {
        headline: current.finalCta?.headline ?? "Ready to build a brand people remember?",
        subtext: current.finalCta?.subtext ?? "Beautiful brands start here",
        ctaLabel: current.finalCta?.ctaLabel ?? "Book A Discovery Call",
        ctaHref: current.finalCta?.ctaHref ?? "/contact",
        image: mediaByFilename.get("final-cta.jpg") ?? current.finalCta?.image ?? null,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function clearHomepageMediaLinks({
  payload,
  req,
}: {
  payload: Payload | MigrateDownArgs["payload"];
  req: Req | MigrateDownArgs["req"];
}): Promise<void> {
  const current = (await payload.findGlobal({
    slug: "home-page",
    depth: 0,
    overrideAccess: true,
    req,
  })) as HomeGlobal;

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      hero: {
        headline: current.hero?.headline ?? "Your Brand's New Creative Friend",
        headlineEmphasis: current.hero?.headlineEmphasis ?? "Creative Friend",
        tagline: current.hero?.tagline ?? "",
        ctaLabel: current.hero?.ctaLabel ?? "Book a Call",
        ctaHref: current.hero?.ctaHref ?? "/contact",
        heroImage: null,
        heroVideo: null,
      },
      intro: {
        headline: current.intro?.headline ?? "Growth should look as good as it performs.",
        body: current.intro?.body ?? "",
        ctaLabel: current.intro?.ctaLabel ?? "Book a Discovery Call",
        ctaHref: current.intro?.ctaHref ?? "/contact",
        image: null,
      },
      marquee: {
        image: null,
      },
      finalCta: {
        headline: current.finalCta?.headline ?? "Ready to build a brand people remember?",
        subtext: current.finalCta?.subtext ?? "Beautiful brands start here",
        ctaLabel: current.finalCta?.ctaLabel ?? "Book A Discovery Call",
        ctaHref: current.finalCta?.ctaHref ?? "/contact",
        image: null,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  for (const { slug } of WORK_IMAGE_MAP) {
    const result = await payload.find({
      collection: "works",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (result.docs.length === 0) continue;

    await payload.update({
      collection: "works",
      id: (result.docs[0] as { id: number }).id,
      data: { heroImage: null, coverImage: null, _status: "published" },
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });
  }

  for (const seed of HOMEPAGE_MEDIA_SEED) {
    const result = await payload.find({
      collection: "media",
      where: { filename: { equals: seed.filename } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (result.docs.length === 0) continue;

    await payload.delete({
      collection: "media",
      id: (result.docs[0] as MediaDoc).id,
      overrideAccess: true,
      req,
    });
  }
}
