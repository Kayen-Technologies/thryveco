import {
  articleContentForSlug,
  type JournalArticleBlock,
  type JournalArticleContent,
} from "@/components/journal/articleDefaults";
import type { JournalMediaSrc } from "@/components/journal/defaults";
import { getMediaUrl } from "@/lib/cms/media";
import type { JournalPost, Media } from "@/payload-types";

type ParagraphRow = { text?: string | null; id?: string | null };

type ImageRow = { media?: number | Media | null; id?: string | null };

type StoredArticleBlock =
  | {
      blockType: "paragraphs";
      items?: ParagraphRow[] | null;
    }
  | {
      blockType: "headingGroup";
      heading?: string | null;
      paragraphs?: ParagraphRow[] | null;
    }
  | {
      blockType: "image";
      media?: number | Media | null;
    }
  | {
      blockType: "imageGrid";
      columns?: "2" | "3" | "4" | null;
      images?: ImageRow[] | null;
    }
  | {
      blockType: "closingCta";
      lead?: string | null;
      muted?: string | null;
      end?: string | null;
      ctaLabel?: string | null;
      ctaHref?: string | null;
    };

type LegacyJsonBlock =
  | { type: "paragraphs"; paragraphs?: ParagraphRow[] | null }
  | { type: "headingGroup"; heading?: string | null; paragraphs?: ParagraphRow[] | null }
  | { type: "image"; media?: number | Media | null }
  | {
      type: "closingCta";
      lead?: string | null;
      muted?: string | null;
      end?: string | null;
      ctaLabel?: string | null;
      ctaHref?: string | null;
    };

type LegacyArticleContent = {
  blocks?: LegacyJsonBlock[] | null;
};

function mapParagraphs(items?: ParagraphRow[] | null): string[] {
  return items?.map((item) => item.text?.trim()).filter((text): text is string => Boolean(text)) ?? [];
}

function mapImageBlock(
  media: number | Media | null | undefined,
  fallback?: JournalMediaSrc,
): JournalArticleBlock | null {
  const src = getMediaUrl(media);

  if (src && media && typeof media !== "number") {
    return {
      type: "image",
      image: { src, alt: media.alt },
    };
  }

  if (fallback) {
    return { type: "image", image: fallback };
  }

  return null;
}

function mapPayloadBlocks(
  blocks: StoredArticleBlock[],
  slug: string,
): JournalArticleBlock[] {
  const fallback = articleContentForSlug(slug);
  const fallbackImages =
    fallback?.blocks.filter(
      (block): block is Extract<JournalArticleBlock, { type: "image" }> => block.type === "image",
    ) ?? [];

  let imageIndex = 0;

  return blocks
    .map((block) => {
      if (block.blockType === "paragraphs") {
        const paragraphs = mapParagraphs(block.items);
        return paragraphs.length > 0 ? ({ type: "paragraphs", paragraphs } as const) : null;
      }

      if (block.blockType === "headingGroup" && block.heading) {
        const paragraphs = mapParagraphs(block.paragraphs);
        return { type: "headingGroup", heading: block.heading, paragraphs } as const;
      }

      if (block.blockType === "image") {
        const mapped = mapImageBlock(block.media, fallbackImages[imageIndex]?.image);
        imageIndex += 1;
        return mapped;
      }

      if (block.blockType === "imageGrid" && block.images?.length) {
        const images: JournalMediaSrc[] = block.images
          .map((row) => {
            const src = getMediaUrl(row.media);
            if (src && row.media && typeof row.media !== "number") {
              return { src, alt: row.media.alt };
            }
            return null;
          })
          .filter((img): img is JournalMediaSrc => img !== null);

        if (images.length > 0) {
          return {
            type: "imageGrid",
            columns: block.columns ?? "2",
            images,
          } as const;
        }
        return null;
      }

      if (block.blockType === "closingCta") {
        return {
          type: "closingCta",
          lead: block.lead ?? "",
          muted: block.muted ?? "",
          end: block.end ?? "",
          ctaLabel: block.ctaLabel ?? "Book a Discovery Call",
          ctaHref: block.ctaHref ?? "/contact",
        } as const;
      }

      return null;
    })
    .filter((block): block is JournalArticleBlock => block !== null);
}

function mapLegacyJsonBlocks(
  blocks: LegacyJsonBlock[],
  slug: string,
): JournalArticleBlock[] {
  const fallback = articleContentForSlug(slug);
  const fallbackImages =
    fallback?.blocks.filter(
      (block): block is Extract<JournalArticleBlock, { type: "image" }> => block.type === "image",
    ) ?? [];

  let imageIndex = 0;

  return blocks
    .map((block) => {
      if (block.type === "paragraphs") {
        const paragraphs = mapParagraphs(block.paragraphs);
        return paragraphs.length > 0 ? ({ type: "paragraphs", paragraphs } as const) : null;
      }

      if (block.type === "headingGroup" && block.heading) {
        const paragraphs = mapParagraphs(block.paragraphs);
        return { type: "headingGroup", heading: block.heading, paragraphs } as const;
      }

      if (block.type === "image") {
        const mapped = mapImageBlock(block.media, fallbackImages[imageIndex]?.image);
        imageIndex += 1;
        return mapped;
      }

      if (block.type === "closingCta") {
        return {
          type: "closingCta",
          lead: block.lead ?? "",
          muted: block.muted ?? "",
          end: block.end ?? "",
          ctaLabel: block.ctaLabel ?? "Book a Discovery Call",
          ctaHref: block.ctaHref ?? "/contact",
        } as const;
      }

      return null;
    })
    .filter((block): block is JournalArticleBlock => block !== null);
}

export function resolveJournalArticleContent(
  post: JournalPost,
): JournalArticleContent | null {
  const fallback = articleContentForSlug(post.slug);
  const payloadBlocks = (post.articleBlocks ?? []) as StoredArticleBlock[];
  const legacyContent = (post as JournalPost & { articleContent?: LegacyArticleContent })
    .articleContent;

  let blocks: JournalArticleBlock[] = [];

  if (payloadBlocks.length > 0) {
    blocks = mapPayloadBlocks(payloadBlocks, post.slug);
  } else if (legacyContent?.blocks?.length) {
    blocks = mapLegacyJsonBlocks(legacyContent.blocks, post.slug);
  } else if (fallback) {
    blocks = fallback.blocks;
  }

  if (blocks.length === 0 && !post.deck && !post.excerpt && !fallback) {
    return null;
  }

  return {
    deck: post.deck ?? fallback?.deck ?? post.excerpt ?? "",
    authorLabel: post.author ?? fallback?.authorLabel ?? "Thryve & Co.",
    blocks,
  };
}
