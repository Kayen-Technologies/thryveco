import path from "node:path";

import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import type { JournalMediaSrc } from "@/components/journal/defaults";
import {
  JOURNAL_ARTICLE_DEFAULTS,
  type JournalArticleBlock,
} from "@/components/journal/articleDefaults";

import { upsertSeedMedia } from "./lib/upsertSeedMedia";

/**
 * Production lost the first inline image of the creativity article. The original
 * seed pre-copied each asset into `public/media` before creating the upload, so
 * Payload deduped `journal-article-creativity-1.jpg` onto the `-2` name; the next
 * upsert then saw a size mismatch and deleted the row that had just been created.
 * Rebuild the blocks from the defaults so both inline images resolve again.
 */
const SLUG = "why-the-best-brands-never-leave-creativity-to-chance";

const CAPTIONS: Record<string, string> = {
  "journal-article-creativity-1.jpg": "Figma journal article creativity inline 1",
  "journal-article-creativity-2.jpg": "Figma journal article creativity inline 2",
};

type ArticleBlock =
  | { blockType: "paragraphs"; items: { text: string }[] }
  | { blockType: "headingGroup"; heading: string; paragraphs: { text: string }[] }
  | { blockType: "image"; media: number }
  | { blockType: "imageGrid"; columns: "2" | "3" | "4"; images: { media: number }[] }
  | {
      blockType: "closingCta";
      lead: string;
      muted: string;
      end: string;
      ctaLabel: string;
      ctaHref: string;
    };

function mediaIdForImage(
  payload: MigrateUpArgs["payload"],
  req: MigrateUpArgs["req"],
  image: JournalMediaSrc,
): Promise<number> {
  const filename = path.basename(image.src);

  return upsertSeedMedia({
    payload,
    req,
    filePath: path.resolve(process.cwd(), "public", image.src.replace(/^\//, "")),
    filename,
    alt: image.alt,
    caption: CAPTIONS[filename],
  });
}

async function toPayloadBlocks(
  payload: MigrateUpArgs["payload"],
  req: MigrateUpArgs["req"],
  blocks: JournalArticleBlock[],
): Promise<ArticleBlock[]> {
  const result: ArticleBlock[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case "paragraphs":
        result.push({
          blockType: "paragraphs",
          items: block.paragraphs.map((text) => ({ text })),
        });
        break;
      case "headingGroup":
        result.push({
          blockType: "headingGroup",
          heading: block.heading,
          paragraphs: block.paragraphs.map((text) => ({ text })),
        });
        break;
      case "image":
        result.push({
          blockType: "image",
          media: await mediaIdForImage(payload, req, block.image),
        });
        break;
      case "imageGrid": {
        const images: { media: number }[] = [];
        for (const image of block.images) {
          images.push({ media: await mediaIdForImage(payload, req, image) });
        }
        result.push({ blockType: "imageGrid", columns: block.columns, images });
        break;
      }
      case "closingCta":
        result.push({
          blockType: "closingCta",
          lead: block.lead,
          muted: block.muted,
          end: block.end,
          ctaLabel: block.ctaLabel,
          ctaHref: block.ctaHref,
        });
        break;
    }
  }

  return result;
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const content = JOURNAL_ARTICLE_DEFAULTS[SLUG];
  if (!content) {
    throw new Error(`Missing JOURNAL_ARTICLE_DEFAULTS for ${SLUG}`);
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
  if (!doc) {
    payload.logger.warn(`Journal post not found: ${SLUG}`);
    return;
  }

  const articleBlocks = await toPayloadBlocks(payload, req, content.blocks);

  await payload.update({
    collection: "journal-posts",
    id: doc.id,
    data: {
      body: null,
      articleBlocks,
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });

  payload.logger.info(`Restored inline images for: ${SLUG}`);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // The prior state referenced a media row that no longer exists, so rolling
  // back would only re-break the article. Leave the repaired blocks in place.
}
