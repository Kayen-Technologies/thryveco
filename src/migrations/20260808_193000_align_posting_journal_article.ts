import fs from "node:fs";
import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Figma node 439:1177 — Opened Journal 2.
 * Aligns the posting-every-day article title/deck/blocks, refreshes the hero
 * photo, and upserts the two inline images so the muted closing CTA renders.
 */
const SLUG = "posting-every-day-wont-save-your-brand";

const TITLE = "Posting every day won't save your brand but this will.";
const TITLE_PREVIOUS = "Posting every day alone won't save your brand but this will.";

const DECK =
  "You've heard 'stay consistent' so many times it's practically a mantra. But there's a difference between showing up and showing up with something to say.";

type ArticleBlock =
  | {
      blockType: "paragraphs";
      items: { text: string }[];
    }
  | {
      blockType: "headingGroup";
      heading: string;
      paragraphs: { text: string }[];
    }
  | {
      blockType: "image";
      media: number;
    }
  | {
      blockType: "closingCta";
      lead: string;
      muted: string;
      end: string;
      ctaLabel: string;
      ctaHref: string;
    };

type MediaDoc = { id: number; filesize?: number | null };

type MediaSeed = {
  filename: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  filesize: number;
};

const HERO: MediaSeed = {
  filename: "journal-post-02.jpg",
  alt: "Burgundy Thryve postcards and a tablet on a textured surface",
  caption: "Figma journal post 2 / Opened Journal 2 hero",
  width: 1280,
  height: 1600,
  filesize: 539636,
};

const INLINE_03: MediaSeed = {
  filename: "journal-article-inline-03.jpg",
  alt: "Camera on a tripod filming a sunset",
  caption: "Figma journal article inline 3 — posting article",
  width: 1840,
  height: 1840,
  filesize: 627766,
};

const INLINE_04: MediaSeed = {
  filename: "journal-article-inline-04.jpg",
  alt: "Hands planning brand work over a desk with sticky notes and a laptop",
  caption: "Figma journal article inline 4 — posting article",
  width: 1840,
  height: 1380,
  filesize: 875606,
};

function assetPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "journal", filename);
}

function publicMediaPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "media", filename);
}

function paragraphs(...texts: string[]): ArticleBlock {
  return {
    blockType: "paragraphs",
    items: texts.map((text) => ({ text })),
  };
}

function headingGroup(heading: string, ...texts: string[]): ArticleBlock {
  return {
    blockType: "headingGroup",
    heading,
    paragraphs: texts.map((text) => ({ text })),
  };
}

function buildBlocks(inline1: number, inline2: number): ArticleBlock[] {
  return [
    paragraphs(
      "Let's talk about something nobody really wants to admit. You can post every single day and still see absolutely no growth. No new followers. No inquiries. No engagement worth celebrating. Just content going out into the void and coming back with nothing.",
      "Sound familiar?",
      "Here's the thing: posting frequency is not your problem. Posting without purpose is.",
    ),
    headingGroup(
      "The myth of daily posting.",
      "Somewhere along the line, the algorithm conversation got twisted into this idea that more content equals more reach equals more growth. And while consistency matters (it genuinely does), volume without intention is just noise.",
      "Your audience isn't sitting around waiting for your next post. They're scrolling through hundreds of pieces of content every single day. The brands that cut through aren't the ones posting the most. They're the ones posting with the clearest point of view.",
    ),
    { blockType: "image", media: inline1 },
    headingGroup(
      "What actually moves the needle.",
      "Not a content calendar filled with random post ideas. Not a recycled trend that has nothing to do with your brand. A genuine, intentional strategy that answers three questions before a single piece of content is created:",
      "Who are we talking to?",
      "What do we want them to feel?",
      "What do we want them to do next?",
      "When every post has a clear answer to those three questions, that's when things start to shift. That's when your content stops being background noise and starts being something people actually stop for.",
    ),
    { blockType: "image", media: inline2 },
    headingGroup(
      "Quality over quantity. Every time.",
      "Three intentional, well-crafted posts a week will always outperform seven rushed, directionless ones. Always. Because your audience can feel the difference between content that was made for them and content that was made just to fill a slot in a calendar.",
      "The brands winning on social right now aren't posting more. They're thinking more. Planning more. Caring more about what goes out under their name.",
    ),
    {
      blockType: "closingCta",
      lead: "That's the standard we hold at Thryve & Co. ",
      muted:
        "and the one we bring to every brand we work with. If you're tired of posting into the void",
      end: " and ready to build a presence that actually performs, let's talk.",
      ctaLabel: "Book a Discovery Call",
      ctaHref: "/contact",
    },
  ];
}

async function upsertMedia(
  payload: MigrateUpArgs["payload"],
  req: MigrateUpArgs["req"],
  seed: MediaSeed,
): Promise<number> {
  const filePath = assetPath(seed.filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing seeded media file: ${filePath}`);
  }

  // Keep public/media in sync for local Next image serving.
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

    // Delete + recreate when bytes change. Updating with `filePath` lets Payload
    // rewrite the filename (e.g. journal-post-02.jpg → journal-post-3.jpg).
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
  const heroId = await upsertMedia(payload, req, HERO);
  const inline1 = await upsertMedia(payload, req, INLINE_03);
  const inline2 = await upsertMedia(payload, req, INLINE_04);

  for (const seed of [HERO, INLINE_03, INLINE_04]) {
    await db.execute(sql`
      UPDATE "media"
      SET
        "width" = ${seed.width},
        "height" = ${seed.height},
        "filesize" = ${seed.filesize},
        "updated_at" = now()
      WHERE "filename" = ${seed.filename}
    `);
  }

  const existing = await payload.find({
    collection: "journal-posts",
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const doc = existing.docs[0] as { id: number } | undefined;
  if (!doc) return;

  await payload.update({
    collection: "journal-posts",
    id: doc.id,
    data: {
      title: TITLE,
      author: "Thryve & Co.",
      deck: DECK,
      heroImage: heroId,
      body: null,
      articleBlocks: buildBlocks(inline1, inline2),
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "media"
    SET
      "width" = 1280,
      "height" = 1600,
      "filesize" = 588900,
      "updated_at" = now()
    WHERE "filename" = 'journal-post-02.jpg'
  `);

  const existing = await payload.find({
    collection: "journal-posts",
    where: { slug: { equals: SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const doc = existing.docs[0] as { id: number } | undefined;
  if (!doc) return;

  await payload.update({
    collection: "journal-posts",
    id: doc.id,
    data: {
      title: TITLE_PREVIOUS,
      author: "Michelle Teschmaker",
      deck: null,
      articleBlocks: [],
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}
