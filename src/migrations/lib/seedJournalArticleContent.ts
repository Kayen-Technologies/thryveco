import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { JOURNAL_ARTICLE_DEFAULTS } from "@/components/journal/articleDefaults";

import {
  type JournalMediaSeed,
  upsertJournalMedia,
} from "./seedJournalPageMedia";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type JournalPostDoc = { id: number };

export const JOURNAL_ARTICLE_INLINE_MEDIA: JournalMediaSeed[] = [
  {
    filename: "journal-article-inline-01.jpg",
    alt: "Woman holding a Kinfolk magazine in front of her face",
    caption: "Figma journal article inline image 1",
  },
  {
    filename: "journal-article-inline-02.jpg",
    alt: "Paum brand card on a burgundy surface with holiday decor",
    caption: "Figma journal article inline image 2",
  },
];

const ARTICLE_SLUG = "your-aesthetic-is-your-most-powerful-business-tool";

function blocksFromDefaults(slug: string, inlineOneId: number, inlineTwoId: number) {
  const defaults = JOURNAL_ARTICLE_DEFAULTS[slug];
  if (!defaults) return [];

  const [intro, sectionOne, , sectionTwo, , sectionThree, closing] = defaults.blocks;

  return [
    intro?.type === "paragraphs"
      ? {
          blockType: "paragraphs" as const,
          items: intro.paragraphs.map((text) => ({ text })),
        }
      : null,
    sectionOne?.type === "headingGroup"
      ? {
          blockType: "headingGroup" as const,
          heading: sectionOne.heading,
          paragraphs: sectionOne.paragraphs.map((text) => ({ text })),
        }
      : null,
    {
      blockType: "image" as const,
      media: inlineOneId,
    },
    sectionTwo?.type === "headingGroup"
      ? {
          blockType: "headingGroup" as const,
          heading: sectionTwo.heading,
          paragraphs: sectionTwo.paragraphs.map((text) => ({ text })),
        }
      : null,
    {
      blockType: "image" as const,
      media: inlineTwoId,
    },
    sectionThree?.type === "headingGroup"
      ? {
          blockType: "headingGroup" as const,
          heading: sectionThree.heading,
          paragraphs: sectionThree.paragraphs.map((text) => ({ text })),
        }
      : null,
    closing?.type === "closingCta"
      ? {
          blockType: "closingCta" as const,
          lead: closing.lead,
          muted: closing.muted,
          end: closing.end,
          ctaLabel: closing.ctaLabel,
          ctaHref: closing.ctaHref,
        }
      : null,
  ].filter((block) => block !== null);
}

export async function seedJournalArticleContent({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}): Promise<void> {
  const mediaByFilename = new Map<string, number>();

  for (const seed of JOURNAL_ARTICLE_INLINE_MEDIA) {
    mediaByFilename.set(seed.filename, await upsertJournalMedia({ payload, req, seed }));
  }

  const existing = await payload.find({
    collection: "journal-posts",
    where: { slug: { equals: ARTICLE_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length === 0) return;

  const defaults = JOURNAL_ARTICLE_DEFAULTS[ARTICLE_SLUG];
  if (!defaults) return;

  const inlineOneId = mediaByFilename.get("journal-article-inline-01.jpg");
  const inlineTwoId = mediaByFilename.get("journal-article-inline-02.jpg");

  if (!inlineOneId || !inlineTwoId) {
    throw new Error("Missing inline journal article media IDs.");
  }

  await payload.update({
    collection: "journal-posts",
    id: (existing.docs[0] as JournalPostDoc).id,
    data: {
      author: defaults.authorLabel,
      deck: defaults.deck,
      articleBlocks: blocksFromDefaults(ARTICLE_SLUG, inlineOneId, inlineTwoId),
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function clearJournalArticleContent({
  payload,
  req,
}: {
  payload: Payload | MigrateDownArgs["payload"];
  req: Req | MigrateDownArgs["req"];
}): Promise<void> {
  const existing = await payload.find({
    collection: "journal-posts",
    where: { slug: { equals: ARTICLE_SLUG } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length > 0) {
    await payload.update({
      collection: "journal-posts",
      id: (existing.docs[0] as JournalPostDoc).id,
      data: {
        deck: null,
        articleBlocks: [],
        author: "Thryve & Co.",
      },
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });
  }

  for (const seed of JOURNAL_ARTICLE_INLINE_MEDIA) {
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
      id: (result.docs[0] as { id: number }).id,
      overrideAccess: true,
      req,
    });
  }
}
