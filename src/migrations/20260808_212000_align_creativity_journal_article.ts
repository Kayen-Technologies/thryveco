import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * Figma node 439:1312 — Opened Journal 4.
 * Aligns the creativity article meta/deck/blocks, refreshes the hero photo,
 * and upserts the two inline images so the muted closing CTA renders.
 */
const SLUG = "why-the-best-brands-never-leave-creativity-to-chance";

const TITLE = "Why the best brands never leave creativity to chance.";

const DECK =
  "Talent helps. But it's not what separates the brands that last from the ones that fade. Intention is.";

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

type MediaSeed = {
  filename: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  filesize: number;
};

const HERO: MediaSeed = {
  filename: "journal-post-04.jpg",
  alt: "Hands sketching UI wireframes and flowcharts on paper",
  caption: "Figma journal post 4 / Opened Journal 4 hero",
  width: 1839,
  height: 1226,
  filesize: 423847,
};

const INLINE_01: MediaSeed = {
  filename: "journal-article-creativity-1.jpg",
  alt: "Empty black chair in a photo studio with softbox lighting",
  caption: "Figma journal article creativity inline 1",
  width: 1840,
  height: 1227,
  filesize: 262348,
};

const INLINE_02: MediaSeed = {
  filename: "journal-article-creativity-2.jpg",
  alt: "Camera viewfinder filming two people on a cream sofa",
  caption: "Figma journal article creativity inline 2",
  width: 1840,
  height: 1226,
  filesize: 250304,
};

function assetPath(filename: string): string {
  return path.resolve(process.cwd(), "public", "assets", "journal", filename);
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
      "There's a version of creativity that feels magical, like it just happens. A brilliant idea, a perfect shot, a caption that stops the scroll, all conjured out of thin air by someone with \"an eye.\"",
      "It's a nice story. It's also mostly untrue.",
    ),
    headingGroup(
      "The myth of the happy accident.",
      "Every brand you admire, the ones whose feed you actually stop for, whose visuals feel unmistakably theirs, didn't get there by accident. Behind every \"effortless\" post is a decision. Often several. What to shoot, how to shoot it, what story it's telling, why it matters to the person seeing it.",
      "Creativity that looks spontaneous is almost never spontaneous. It's rehearsed, planned, and refined until it looks like it wasn't.",
    ),
    { blockType: "image", media: inline1 },
    headingGroup(
      "What \"leaving it to chance\" actually looks like.",
      "It looks like posting whatever feels right in the moment, with no real thread connecting one piece of content to the next. It looks like a shoot with no shot list, no mood board, no clear idea of what story is being told before the camera comes out. It looks like a brand that's active, but not cohesive. Busy, but not building anything.",
      "None of that is a talent problem. It's a planning problem.",
    ),
    { blockType: "image", media: inline2 },
    headingGroup(
      "Why this matters more than raw talent.",
      "Talent gets you one good post. Intention gets you a body of work that means something. Content that builds on itself, a feed that tells a story over time, a brand that people recognise before they even read the name.",
      "That's the real difference between brands that spark for a moment and brands that last. Not who has the better camera. Who has the better process.",
    ),
    {
      blockType: "closingCta",
      lead: "At Thryve & Co., nothing we make is left to chance. ",
      muted:
        "Every shoot, every strategy, every piece of content starts with a reason before it becomes a result. ",
      end: "If you're ready to stop guessing and start building something intentional, you know where to find us.",
      ctaLabel: "Book a Discovery Call",
      ctaHref: "/contact",
    },
  ];
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
    filePath: assetPath(seed.filename),
    filename: seed.filename,
    alt: seed.alt,
    caption: seed.caption,
  });
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const heroId = await upsertMedia(payload, req, HERO);
  const inline1 = await upsertMedia(payload, req, INLINE_01);
  const inline2 = await upsertMedia(payload, req, INLINE_02);

  for (const seed of [HERO, INLINE_01, INLINE_02]) {
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
      category: "Strategy",
      readTime: 4,
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
      "width" = 1600,
      "height" = 1066,
      "filesize" = 276211,
      "updated_at" = now()
    WHERE "filename" = 'journal-post-04.jpg'
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
      title: TITLE,
      category: "Creative Direction",
      readTime: 3,
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
