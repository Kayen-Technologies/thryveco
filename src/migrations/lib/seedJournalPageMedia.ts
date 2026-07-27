import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type MediaDoc = {
  id: number;
  filesize?: number | null;
};

export type JournalMediaSeed = {
  filename: string;
  alt: string;
  caption: string;
};

export const JOURNAL_MEDIA_SEED: JournalMediaSeed[] = [
  {
    filename: "journal-hero-backdrop.jpg",
    alt: "Creative workspace with notebook and candle",
    caption: "Figma journal hero backdrop",
  },
  {
    filename: "journal-post-01.jpg",
    alt: "Person working on a rose-gold laptop beside a houseplant",
    caption: "Figma journal post 1",
  },
  {
    filename: "journal-post-02.jpg",
    alt: "Hand holding a smartphone in front of city billboards",
    caption: "Figma journal post 2",
  },
  {
    filename: "journal-post-03.jpg",
    alt: "Group of creative women smiling together",
    caption: "Figma journal post 3",
  },
  {
    filename: "journal-post-04.jpg",
    alt: "Art books, mug, and sculptural candle on a table",
    caption: "Figma journal post 4",
  },
];

export type JournalPostSeed = {
  slug: string;
  title: string;
  category: string;
  readTime: number;
  excerpt: string;
  imageFilename: string;
};

export const JOURNAL_POSTS_SEED: JournalPostSeed[] = [
  {
    slug: "your-aesthetic-is-your-most-powerful-business-tool",
    title: "Your aesthetic isn't just pretty it's your most powerful business tool.",
    category: "Branding",
    readTime: 4,
    excerpt:
      "The brands you can't stop watching aren't just lucky. There's intention behind every colour, every caption, every carefully placed detail. Here's why your aesthetic might be the most underrated part of your business.",
    imageFilename: "journal-post-01.jpg",
  },
  {
    slug: "posting-every-day-wont-save-your-brand",
    title: "Posting every day alone won't save your brand but this will.",
    category: "Social Media",
    readTime: 3,
    excerpt:
      "We get it. You've heard 'stay consistent' so many times it's practically a mantra. But there's a difference between showing up and showing up with something to say. Here's what actually moves the needle.",
    imageFilename: "journal-post-02.jpg",
  },
  {
    slug: "accra-creative-scene-having-a-moment",
    title: "The Accra creative scene is having a moment and we're here for it.",
    category: "Culture",
    readTime: 5,
    excerpt:
      "Something is shifting in Accra. The brands are bolder, the creatives are louder, and the work is undeniably world class. We've got front row seats — and we wouldn't have it any other way.",
    imageFilename: "journal-post-03.jpg",
  },
  {
    slug: "why-the-best-brands-never-leave-creativity-to-chance",
    title: "Why the best brands never leave creativity to chance.",
    category: "Creative Direction",
    readTime: 3,
    excerpt:
      "Creative direction is more than making things look good. It's about creating a consistent visual language that shapes how people recognize, remember, and connect with your brand.",
    imageFilename: "journal-post-04.jpg",
  },
];

function sourcePath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "journal", filename);
}

function publicMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "media", filename);
}

export async function upsertJournalMedia({
  payload,
  req,
  seed,
}: {
  payload: Payload;
  req: Req;
  seed: JournalMediaSeed;
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

export async function seedAllJournalMedia({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}): Promise<Map<string, number>> {
  const mediaByFilename = new Map<string, number>();

  for (const seed of JOURNAL_MEDIA_SEED) {
    mediaByFilename.set(seed.filename, await upsertJournalMedia({ payload, req, seed }));
  }

  return mediaByFilename;
}

type JournalGlobal = {
  hero?: {
    headline?: string | null;
    tagline?: string | null;
    image?: number | null;
  };
  entriesSection?: {
    title?: string | null;
  };
};

type JournalPostDoc = { id: number };

export async function upsertJournalPost({
  payload,
  req,
  seed,
  heroImageId,
}: {
  payload: Payload;
  req: Req;
  seed: JournalPostSeed;
  heroImageId: number;
}): Promise<number> {
  const existing = await payload.find({
    collection: "journal-posts",
    where: { slug: { equals: seed.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const data = {
    title: seed.title,
    slug: seed.slug,
    category: seed.category,
    readTime: seed.readTime,
    excerpt: seed.excerpt,
    heroImage: heroImageId,
    author: "Thryve & Co.",
    publishedAt: new Date("2026-01-15").toISOString(),
    _status: "published" as const,
  };

  if (existing.docs.length > 0) {
    const updated = await payload.update({
      collection: "journal-posts",
      id: (existing.docs[0] as JournalPostDoc).id,
      data,
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });
    return (updated as JournalPostDoc).id;
  }

  const created = await payload.create({
    collection: "journal-posts",
    data,
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });

  return (created as JournalPostDoc).id;
}

export async function linkJournalPageContent({
  payload,
  req,
  mediaByFilename,
}: {
  payload: Payload;
  req: Req;
  mediaByFilename: Map<string, number>;
}): Promise<void> {
  const current = (await payload.findGlobal({
    slug: "journal-page",
    depth: 0,
    overrideAccess: true,
    req,
  })) as JournalGlobal;

  await payload.updateGlobal({
    slug: "journal-page",
    data: {
      hero: {
        headline:
          current.hero?.headline ?? "Thoughts, perspective & a little creative obsession.",
        tagline:
          current.hero?.tagline ??
          "We write about the things we care about aesthetics, strategy, social media, and everything happening in the creative world around us. Pull up a seat.",
        image:
          mediaByFilename.get("journal-hero-backdrop.jpg") ?? current.hero?.image ?? null,
      },
      entriesSection: {
        title: current.entriesSection?.title ?? "Journal Entry",
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  for (const seed of JOURNAL_POSTS_SEED) {
    const heroImageId = mediaByFilename.get(seed.imageFilename);
    if (!heroImageId) {
      throw new Error(`Missing media for journal post seed: ${seed.imageFilename}`);
    }

    await upsertJournalPost({ payload, req, seed, heroImageId });
  }
}

export async function clearJournalPageContent({
  payload,
  req,
}: {
  payload: Payload | MigrateDownArgs["payload"];
  req: Req | MigrateDownArgs["req"];
}): Promise<void> {
  const current = (await payload.findGlobal({
    slug: "journal-page",
    depth: 0,
    overrideAccess: true,
    req,
  })) as JournalGlobal;

  await payload.updateGlobal({
    slug: "journal-page",
    data: {
      hero: {
        headline:
          current.hero?.headline ?? "Thoughts, perspective & a little creative obsession.",
        tagline:
          current.hero?.tagline ??
          "We write about the things we care about aesthetics, strategy, social media, and everything happening in the creative world around us. Pull up a seat.",
        image: null,
      },
      entriesSection: {
        title: current.entriesSection?.title ?? "Journal Entry",
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });

  for (const seed of JOURNAL_POSTS_SEED) {
    const result = await payload.find({
      collection: "journal-posts",
      where: { slug: { equals: seed.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (result.docs.length === 0) continue;

    await payload.delete({
      collection: "journal-posts",
      id: (result.docs[0] as JournalPostDoc).id,
      overrideAccess: true,
      req,
    });
  }

  for (const seed of JOURNAL_MEDIA_SEED) {
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
