import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

type ParagraphRow = { text?: string | null; id?: string | null };

type StoredArticleBlock =
  | { blockType: "paragraphs"; items?: ParagraphRow[] | null }
  | { blockType: "headingGroup"; heading?: string | null; paragraphs?: ParagraphRow[] | null }
  | { blockType: "image"; media?: number | null }
  | {
      blockType: "closingCta";
      lead?: string | null;
      muted?: string | null;
      end?: string | null;
      ctaLabel?: string | null;
      ctaHref?: string | null;
    };

type LexicalNode = Record<string, unknown>;

function createTextNode(text: string): LexicalNode {
  return {
    type: "text",
    format: 0,
    text,
    version: 1,
    mode: "normal",
    style: "",
    detail: 0,
  };
}

function createParagraphNode(text: string): LexicalNode {
  return {
    type: "paragraph",
    format: "",
    indent: 0,
    version: 1,
    children: [createTextNode(text)],
    textFormat: 0,
    direction: "ltr",
  };
}

function createHeadingNode(text: string, tag: "h2" | "h3" = "h2"): LexicalNode {
  return {
    type: "heading",
    tag,
    format: "",
    indent: 0,
    version: 1,
    children: [createTextNode(text)],
    direction: "ltr",
  };
}

function createUploadNode(mediaId: number): LexicalNode {
  return {
    type: "upload",
    format: "",
    version: 2,
    relationTo: "media",
    value: mediaId,
  };
}

function blocksToLexical(blocks: StoredArticleBlock[]): Record<string, unknown> | null {
  const children: LexicalNode[] = [];

  for (const block of blocks) {
    if (block.blockType === "paragraphs" && block.items?.length) {
      for (const item of block.items) {
        if (item.text?.trim()) {
          children.push(createParagraphNode(item.text.trim()));
        }
      }
    }

    if (block.blockType === "headingGroup") {
      if (block.heading?.trim()) {
        children.push(createHeadingNode(block.heading.trim()));
      }
      if (block.paragraphs?.length) {
        for (const p of block.paragraphs) {
          if (p.text?.trim()) {
            children.push(createParagraphNode(p.text.trim()));
          }
        }
      }
    }

    if (block.blockType === "image" && block.media) {
      children.push(createUploadNode(block.media));
    }

    if (block.blockType === "closingCta") {
      if (block.lead?.trim()) {
        children.push(createParagraphNode(block.lead.trim()));
      }
      if (block.muted?.trim()) {
        children.push(createParagraphNode(block.muted.trim()));
      }
      if (block.end?.trim()) {
        children.push(createParagraphNode(block.end.trim()));
      }
    }
  }

  if (children.length === 0) return null;

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children,
      direction: "ltr",
    },
  };
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const posts = await payload.find({
    collection: "journal-posts",
    limit: 100,
    depth: 0,
    overrideAccess: true,
    req,
  });

  for (const post of posts.docs) {
    const blocks = (post.articleBlocks ?? []) as StoredArticleBlock[];
    if (blocks.length === 0) continue;

    const lexicalBody = blocksToLexical(blocks);
    if (!lexicalBody) continue;

    await payload.update({
      collection: "journal-posts",
      id: post.id,
      data: {
        body: lexicalBody,
        articleBlocks: [],
      },
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });

    payload.logger.info(`Converted blocks to rich text for: ${post.slug}`);
  }
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  payload.logger.info("Down migration: blocks-to-richtext conversion is not reversible");
}
