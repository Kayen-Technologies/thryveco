import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { seedJournalArticleContent } from "./seedJournalArticleContent";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type JournalPostDoc = {
  id: number;
  slug: string;
  articleContent?: {
    blocks?: LegacyJsonBlock[] | null;
  } | null;
};

type LegacyJsonBlock =
  | { type: "paragraphs"; paragraphs?: { text?: string | null }[] | null }
  | { type: "headingGroup"; heading?: string | null; paragraphs?: { text?: string | null }[] | null }
  | { type: "image"; media?: number | null }
  | {
      type: "closingCta";
      lead?: string | null;
      muted?: string | null;
      end?: string | null;
      ctaLabel?: string | null;
      ctaHref?: string | null;
    };

function mapLegacyBlock(block: LegacyJsonBlock) {
  if (block.type === "paragraphs") {
    return {
      blockType: "paragraphs" as const,
      items:
        block.paragraphs
          ?.map((row) => row.text?.trim())
          .filter((text): text is string => Boolean(text))
          .map((text) => ({ text })) ?? [],
    };
  }

  if (block.type === "headingGroup" && block.heading) {
    return {
      blockType: "headingGroup" as const,
      heading: block.heading,
      paragraphs:
        block.paragraphs
          ?.map((row) => row.text?.trim())
          .filter((text): text is string => Boolean(text))
          .map((text) => ({ text })) ?? [],
    };
  }

  if (block.type === "image" && block.media) {
    return {
      blockType: "image" as const,
      media: block.media,
    };
  }

  if (block.type === "closingCta") {
    return {
      blockType: "closingCta" as const,
      lead: block.lead ?? "",
      muted: block.muted ?? "",
      end: block.end ?? "",
      ctaLabel: block.ctaLabel ?? "Book a Discovery Call",
      ctaHref: block.ctaHref ?? "/contact",
    };
  }

  return null;
}

export async function migrateLegacyArticleContentToBlocks({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}): Promise<void> {
  const posts = await payload.find({
    collection: "journal-posts",
    limit: 100,
    depth: 0,
    overrideAccess: true,
    req,
  });

  for (const post of posts.docs as JournalPostDoc[]) {
    const legacy = post.articleContent;
    if (!legacy?.blocks?.length) continue;

    const articleBlocks = legacy.blocks
      .map((block) => mapLegacyBlock(block))
      .filter((block) => block !== null);

    if (articleBlocks.length === 0) continue;

    await payload.update({
      collection: "journal-posts",
      id: post.id,
      data: { articleBlocks },
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });
  }
}

export async function seedJournalArticleBlocks({
  payload,
  req,
}: {
  payload: Payload | MigrateDownArgs["payload"];
  req: Req | MigrateDownArgs["req"];
}): Promise<void> {
  await seedJournalArticleContent({ payload, req });
}
