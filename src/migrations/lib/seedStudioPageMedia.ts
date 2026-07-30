import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { STUDIO_DEFAULTS } from "@/components/studio/defaults";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type MediaDoc = {
  id: number;
  filesize?: number | null;
};

export type StudioMediaSeed = {
  filename: string;
  alt: string;
  caption: string;
};

function filenameFromSrc(src: string): string {
  return src.split("/").pop() ?? src;
}

function buildStudioMediaSeed(): StudioMediaSeed[] {
  const seeds: StudioMediaSeed[] = [
    {
      filename: "studio-hero.jpg",
      alt: "Creative studio hands holding camera and tablet",
      caption: "Figma studio hero",
    },
    {
      filename: "studio-cta.jpg",
      alt: "Creative studio lifestyle scene",
      caption: "Figma studio final CTA",
    },
  ];

  const seen = new Set(seeds.map((seed) => seed.filename));

  for (const service of STUDIO_DEFAULTS.services) {
    for (const image of service.stackImages) {
      const filename = filenameFromSrc(image.src);
      if (seen.has(filename)) continue;

      seen.add(filename);
      seeds.push({
        filename,
        alt: image.alt,
        caption: `Figma ${service.title} stack`,
      });
    }
  }

  for (const step of STUDIO_DEFAULTS.howItWorks) {
    const filename = filenameFromSrc(step.image.src);
    if (seen.has(filename)) continue;

    seen.add(filename);
    seeds.push({
      filename,
      alt: step.image.alt,
      caption: `Figma How It Works step ${step.step}`,
    });
  }

  return seeds;
}

export const STUDIO_MEDIA_SEED = buildStudioMediaSeed();

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "studio", filename);
}

function publicMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "media", filename);
}

export async function upsertStudioMedia({
  payload,
  req,
  seed,
}: {
  payload: Payload;
  req: Req;
  seed: StudioMediaSeed;
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
    }

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

export async function seedAllStudioMedia({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}): Promise<Map<string, number>> {
  const mediaByFilename = new Map<string, number>();

  for (const seed of STUDIO_MEDIA_SEED) {
    mediaByFilename.set(seed.filename, await upsertStudioMedia({ payload, req, seed }));
  }

  return mediaByFilename;
}

function stackImagesForService(
  serviceIndex: number,
  mediaByFilename: Map<string, number>,
): { image: number }[] {
  const service = STUDIO_DEFAULTS.services[serviceIndex] ?? STUDIO_DEFAULTS.services[0];

  return service.stackImages.map((image) => ({
    image: mediaByFilename.get(filenameFromSrc(image.src))!,
  }));
}

export async function linkStudioPageContent({
  payload,
  req,
  mediaByFilename,
}: {
  payload: Payload;
  req: Req;
  mediaByFilename: Map<string, number>;
}): Promise<void> {
  await payload.updateGlobal({
    slug: "studio-page",
    data: {
      hero: {
        headline: STUDIO_DEFAULTS.hero.headline,
        tagline: STUDIO_DEFAULTS.hero.tagline,
        image: mediaByFilename.get("studio-hero.jpg") ?? null,
      },
      servicesSection: {
        title: STUDIO_DEFAULTS.servicesSection.title,
      },
      services: STUDIO_DEFAULTS.services.map((service, index) => ({
        serviceLabel: service.serviceLabel,
        title: service.title,
        displayTitlePrefix: service.displayTitlePrefix,
        displayTitleAccent: service.displayTitleAccent,
        description: service.description,
        includes: service.includes.map((item) => ({ item })),
        stackImages: stackImagesForService(index, mediaByFilename),
        ctaLabel: service.ctaLabel,
        ctaHref: service.ctaHref,
      })),
      howItWorksSection: {
        title: STUDIO_DEFAULTS.howItWorksSection.title,
      },
      howItWorks: STUDIO_DEFAULTS.howItWorks.map((step) => ({
        step: step.step,
        title: step.title,
        description: step.description,
        image: mediaByFilename.get(filenameFromSrc(step.image.src)) ?? null,
      })),
      cta: {
        headline: STUDIO_DEFAULTS.cta.headline,
        subtext: STUDIO_DEFAULTS.cta.subtext,
        ctaLabel: STUDIO_DEFAULTS.cta.ctaLabel,
        ctaHref: STUDIO_DEFAULTS.cta.ctaHref,
        image: mediaByFilename.get("studio-cta.jpg") ?? null,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function clearStudioPageMedia({
  payload,
  req,
}: {
  payload: Payload | MigrateDownArgs["payload"];
  req: Req | MigrateDownArgs["req"];
}): Promise<void> {
  const current = await payload.findGlobal({
    slug: "studio-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  await payload.updateGlobal({
    slug: "studio-page",
    data: {
      hero: {
        headline: current.hero?.headline ?? STUDIO_DEFAULTS.hero.headline,
        tagline: current.hero?.tagline ?? STUDIO_DEFAULTS.hero.tagline,
        image: null,
      },
      howItWorksSection: {
        title: current.howItWorksSection?.title ?? STUDIO_DEFAULTS.howItWorksSection.title,
      },
      cta: {
        headline: current.cta?.headline ?? STUDIO_DEFAULTS.cta.headline,
        subtext: current.cta?.subtext ?? STUDIO_DEFAULTS.cta.subtext,
        ctaLabel: current.cta?.ctaLabel ?? STUDIO_DEFAULTS.cta.ctaLabel,
        ctaHref: current.cta?.ctaHref ?? STUDIO_DEFAULTS.cta.ctaHref,
        image: null,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}
