import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * Figma node 439:1244 — Opened Journal 3.
 * Aligns the Accra creative-scene article deck/blocks, refreshes the hero
 * photo, and upserts the two inline images so the muted closing CTA renders.
 */
const SLUG = "accra-creative-scene-having-a-moment";

const TITLE = "The Accra creative scene is having a moment and we're here for it.";

const DECK =
  "Something is shifting in Accra. The brands are bolder, the creatives are louder, and the work is undeniably world class. We've got front row seats and we wouldn't have it any other way.";

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
  filename: "journal-post-03.jpg",
  alt: "Creative studio with chalkboard wall, bicycle, and Edison bulbs",
  caption: "Figma journal post 3 / Opened Journal 3 hero",
  width: 1840,
  height: 1035,
  filesize: 358005,
};

const INLINE_05: MediaSeed = {
  filename: "journal-article-accra-01.jpg",
  alt: "Video editing workspace with Premiere Pro on a curved monitor",
  caption: "Figma journal article Accra inline 1",
  width: 1839,
  height: 1228,
  filesize: 314151,
};

const INLINE_06: MediaSeed = {
  filename: "journal-article-accra-02.jpg",
  alt: "Two creatives collaborating at a table with art supplies",
  caption: "Figma journal article Accra inline 2",
  width: 1840,
  height: 1227,
  filesize: 411054,
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
      "If you've been paying attention, you already know.",
      "Something is happening in Accra. You can feel it in the restaurants that look like they belong in a design magazine. In the fashion brands building loyal following without a single billboard. In the content creators producing work that stops people mid-scroll from London to Lagos to Los Angeles.",
      "Accra is building something. And it's beautiful.",
    ),
    headingGroup(
      "The creative renaissance nobody talks about enough.",
      "For a long time, the narrative around African brands and creative businesses was about catching up. About looking outward for inspiration, validation, and standards.",
      "That narrative is shifting. The creative professionals coming out of Accra right now are not looking outward for permission. They're setting their own standards, building their own aesthetics, and creating work that the rest of the world is starting to pay very close attention to.",
      "The photography is intentional. The brand identities are considered. The social media presence of the best local brands rivals anything you'd find in New York or London and in many cases surpasses it.",
    ),
    { blockType: "image", media: inline1 },
    headingGroup(
      "What's driving it.",
      "Access and ambition in equal measure.",
      "A generation of Ghanaian creatives who grew up consuming world class content and decided, consciously or not, that there was no reason they couldn't produce it too. Combined with tools, platforms, and a local market that is increasingly willing to invest in quality creative work.",
      "The result is a scene that is quietly, confidently, and unapologetically excellent.",
    ),
    { blockType: "image", media: inline2 },
    headingGroup(
      "Where Thryve fits in.",
      "We didn't build Thryve & Co. in spite of being based in Accra. We built it because of it. Because we believe the brands coming out of this city – the lifestyle labels, the product businesses, the experience-driven companies – deserve creative support that matches their ambition. That understands their market. That knows the difference between what works globally and what resonates locally.",
      "We are Accra-based and we are proud of it. And we are building something here that we hope adds to the momentum of everything already happening around us.",
    ),
    {
      blockType: "closingCta",
      lead: "The Accra creative scene is having a moment. ",
      muted: "We're here for all of it and ",
      end: "we're just getting started.",
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
  const inline1 = await upsertMedia(payload, req, INLINE_05);
  const inline2 = await upsertMedia(payload, req, INLINE_06);

  for (const seed of [HERO, INLINE_05, INLINE_06]) {
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
      "width" = 1600,
      "height" = 1066,
      "filesize" = 275556,
      "updated_at" = now()
    WHERE "filename" = 'journal-post-03.jpg'
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
