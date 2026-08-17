import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type MediaDoc = {
  id: number;
  filesize?: number | null;
};

export type AboutMediaSeed = {
  filename: string;
  alt: string;
  caption: string;
};

export const ABOUT_MEDIA_SEED: AboutMediaSeed[] = [
  {
    filename: "about-hero.jpg",
    alt: "Thryve & Co about hero background",
    caption: "Figma about hero",
  },
  {
    filename: "about-founder-collage-01.jpg",
    alt: "Michelle Teschmaker portrait",
    caption: "Figma about founder collage 1",
  },
  {
    filename: "about-founder-collage-02.jpg",
    alt: "Brand collateral detail",
    caption: "Figma about founder collage 2",
  },
  {
    filename: "about-founder-collage-03.jpg",
    alt: "Michelle Teschmaker portrait",
    caption: "Figma about founder collage 3",
  },
  {
    filename: "about-story-portrait.jpg",
    alt: "Michelle Teschmaker with camera",
    caption: "Figma about story portrait",
  },
  {
    filename: "about-what-thryve.jpg",
    alt: "Michelle reviewing brand work on a tablet",
    caption: "Figma about what thryve image",
  },
  {
    filename: "about-cta.jpg",
    alt: "Creative studio lifestyle scene",
    caption: "Figma about final CTA",
  },
];

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "about", filename);
}

function publicMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "media", filename);
}

export async function upsertAboutMedia({
  payload,
  req,
  seed,
}: {
  payload: Payload;
  req: Req;
  seed: AboutMediaSeed;
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

export async function seedAllAboutMedia({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}): Promise<Map<string, number>> {
  const mediaByFilename = new Map<string, number>();

  for (const seed of ABOUT_MEDIA_SEED) {
    mediaByFilename.set(seed.filename, await upsertAboutMedia({ payload, req, seed }));
  }

  return mediaByFilename;
}

type AboutGlobal = {
  hero?: {
    headline?: string | null;
    tagline?: string | null;
    image?: number | null;
  };
  founderSection?: {
    headline?: string | null;
    name?: string | null;
    title?: string | null;
  };
  founderStory?: {
    headlineLead?: string | null;
    headlineMuted?: string | null;
    headlineEnd?: string | null;
    paragraphOne?: string | null;
    paragraphTwo?: string | null;
    storyImage?: number | null;
    photos?: { photo: number }[] | null;
  };
  founderQuote?: {
    quote?: string | null;
    attribution?: string | null;
  };
  whatThryve?: {
    intro?: string | null;
    agencyCopy?: string | null;
    aspirationCopy?: string | null;
    image?: number | null;
  };
  cta?: {
    headline?: string | null;
    subtext?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    image?: number | null;
  };
};

export async function linkAboutPageContent({
  payload,
  req,
  mediaByFilename,
}: {
  payload: Payload;
  req: Req;
  mediaByFilename: Map<string, number>;
}): Promise<void> {
  const current = (await payload.findGlobal({
    slug: "about-page",
    depth: 0,
    overrideAccess: true,
    req,
  })) as AboutGlobal;

  await payload.updateGlobal({
    slug: "about-page",
    data: {
      hero: {
        headline: current.hero?.headline ?? "We're not here to fit in",
        tagline: current.hero?.tagline ?? "We never were",
        image: mediaByFilename.get("about-hero.jpg") ?? current.hero?.image ?? null,
      },
      founderSection: {
        headline: current.founderSection?.headline ?? "Meet the Founder",
        name: current.founderSection?.name ?? "Michelle Teschmaker",
        title: current.founderSection?.title ?? "Founder & Creative Director",
      },
      founderStory: {
        headlineLead: current.founderStory?.headlineLead ?? "It started, like ",
        headlineMuted:
          current.founderStory?.headlineMuted ?? "most good things do, with a camera and a ",
        headlineEnd: current.founderStory?.headlineEnd ?? "lot of curiosity.",
        paragraphOne:
          current.founderStory?.paragraphOne ??
          "Before Thryve, Michelle was a digital creator learning the language of content, aesthetics and storytelling one post at a time. She had an eye for what looked good and an instinct for what felt right. That combination led her into social media management, where she discovered something she hadn't expected a love for strategy. For the thinking behind the making. For the way a well-built brand presence could change how a business was perceived overnight.",
        paragraphTwo:
          current.founderStory?.paragraphTwo ??
          "Two years, multiple clients, and countless content pieces later, it became clear that what she was building wasn't just a freelance career. It was something bigger. Something with a name, a vision, and a standard.",
        storyImage:
          mediaByFilename.get("about-story-portrait.jpg") ??
          current.founderStory?.storyImage ??
          null,
        photos: [
          { photo: mediaByFilename.get("about-founder-collage-01.jpg")! },
          { photo: mediaByFilename.get("about-founder-collage-02.jpg")! },
          { photo: mediaByFilename.get("about-founder-collage-03.jpg")! },
        ],
      },
      founderQuote: {
        quote:
          current.founderQuote?.quote ??
          "I've always been fascinated by the creative process — the idea, the execution, the way something beautiful comes together. That giddiness I feel when I come across something truly aesthetic and intentional? That's what I want people to feel when they encounter the brands I work with. I don't just want my clients to post — I want them to have a presence that has class, intention, and an aesthetic that's undeniably theirs.",
        attribution:
          current.founderQuote?.attribution ??
          "Michelle Teschmaker, Founder & Creative Director",
      },
      whatThryve: {
        intro:
          current.whatThryve?.intro ??
          "Thriving isn't passive. It's putting yourself out there, taking up space, and doing it on your own terms. And the & Co.? That's the part that says we're always doing more. More than just thriving. More ideas, more possibilities, more of what your brand deserves.",
        agencyCopy:
          current.whatThryve?.agencyCopy ??
          "We call ourselves a Creative Agency because that's exactly what we are a team of people whose job is to make your brand impossible to ignore. A creative partner with a point of view, in your corner, invested in what you're building.",
        aspirationCopy:
          current.whatThryve?.aspirationCopy ??
          "We aspire to be the agency that changes how lifestyle and product brands show up the name people mention when they talk about brands that look different. The agency behind the brands you can't stop watching.",
        image:
          mediaByFilename.get("about-what-thryve.jpg") ?? current.whatThryve?.image ?? null,
      },
      cta: {
        headline: current.cta?.headline ?? "Ready to build a brand people remember?",
        subtext: current.cta?.subtext ?? "Beautiful brands start here",
        ctaLabel: current.cta?.ctaLabel ?? "Book a Discovery Call",
        ctaHref: current.cta?.ctaHref ?? "/contact",
        image: mediaByFilename.get("about-cta.jpg") ?? current.cta?.image ?? null,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function clearAboutPageContent({
  payload,
  req,
}: {
  payload: Payload | MigrateDownArgs["payload"];
  req: Req | MigrateDownArgs["req"];
}): Promise<void> {
  const current = (await payload.findGlobal({
    slug: "about-page",
    depth: 0,
    overrideAccess: true,
    req,
  })) as AboutGlobal;

  await payload.updateGlobal({
    slug: "about-page",
    data: {
      hero: {
        headline: current.hero?.headline ?? "We're not here to fit in",
        tagline: current.hero?.tagline ?? "We never were",
        image: null,
      },
      founderStory: {
        headlineLead: current.founderStory?.headlineLead ?? "It started, like ",
        headlineMuted:
          current.founderStory?.headlineMuted ?? "most good things do, with a camera and a ",
        headlineEnd: current.founderStory?.headlineEnd ?? "lot of curiosity.",
        paragraphOne: current.founderStory?.paragraphOne ?? null,
        paragraphTwo: current.founderStory?.paragraphTwo ?? null,
        storyImage: null,
        photos: [],
      },
      whatThryve: {
        intro: current.whatThryve?.intro ?? null,
        agencyCopy: current.whatThryve?.agencyCopy ?? null,
        aspirationCopy: current.whatThryve?.aspirationCopy ?? null,
        image: null,
      },
      cta: {
        headline: current.cta?.headline ?? "Ready to build a brand people remember?",
        subtext: current.cta?.subtext ?? "Beautiful brands start here",
        ctaLabel: current.cta?.ctaLabel ?? "Book a Discovery Call",
        ctaHref: current.cta?.ctaHref ?? "/contact",
        image: null,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  for (const seed of ABOUT_MEDIA_SEED) {
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
