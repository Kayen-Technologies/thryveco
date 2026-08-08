import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Figma node 439:1109 — Opened Journal 1.
 * Rebuilds the first journal article as structured blocks (so the muted closing
 * CTA + button render) and refreshes the first inline image metadata.
 */
const SLUG = "your-aesthetic-is-your-most-powerful-business-tool";

const DECK =
  "The brands you can't stop watching aren't just lucky. There's intention behind every detail and it's doing more work for their business than they might even realise.";

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

async function mediaIdByFilename(
  payload: MigrateUpArgs["payload"],
  req: MigrateUpArgs["req"],
  filename: string,
): Promise<number | null> {
  const result = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });
  const doc = result.docs[0] as { id: number } | undefined;
  return doc?.id ?? null;
}

function buildBlocks(inline1: number, inline2: number): ArticleBlock[] {
  return [
    paragraphs(
      "Think about the last brand you followed without really knowing why. The one whose posts you save. Whose feed you go back to. Whose product you'd buy before you even needed it.",
      "Now ask yourself, was it the product alone that pulled you in? Or was it something about the way it looked?",
      "Nine times out of ten, it's the aesthetic.",
    ),
    headingGroup(
      "Aesthetic is not decoration",
      "There's a common misconception that investing in how your brand looks is a vanity exercise. That it's the last thing to think about after the product, the pricing, the logistics.",
      "But here's the truth. Your aesthetic is the first thing your audience sees before they read a single word. Before they know your price point. Before they decide whether to follow, click, or buy.",
      "It's your first impression. And in a world where someone decides whether to engage with your content in under three seconds, that first impression is everything.",
    ),
    { blockType: "image", media: inline1 },
    headingGroup(
      "What a strong aesthetic actually does for your brand",
      "It builds recognition. When your visual identity is consistent – the colours, the fonts, the tone, the feeling – people start to recognise your content before they even see your name. That's not luck. That's strategy.",
      "It builds trust. A brand that looks put together signals that the business behind it is put together. Consciously or not, your audience is making that connection every single time they land on your page.",
      "It attracts the right people. Your aesthetic speaks before you do. The right visual direction will draw in exactly the kind of client or customer you want and quietly filter out the ones who aren't the right fit.",
    ),
    { blockType: "image", media: inline2 },
    headingGroup(
      "So what does this mean for your brand?",
      "It means your aesthetic deserves as much thought as your product. It means the colours you choose, the way you frame a photo, the fonts on your graphics, none of it should be accidental.",
      "It means growth and beauty are not mutually exclusive. In fact, the most strategic thing you can do for your brand right now might just be making it look the part.",
    ),
    {
      blockType: "closingCta",
      lead: "At Thryve & Co., this is exactly ",
      muted:
        "what we obsess over building. Brand presences that are as intentional as they are beautiful. If you're ready to make ",
      end: "your aesthetic work as hard as you do, you know where to find us.",
      ctaLabel: "Book a Discovery Call",
      ctaHref: "/contact",
    },
  ];
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "media"
    SET
      "width" = 1066,
      "height" = 1600,
      "filesize" = 277979,
      "updated_at" = now()
    WHERE "filename" = 'journal-article-inline-01.jpg'
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

  const inline1 = await mediaIdByFilename(payload, req, "journal-article-inline-01.jpg");
  const inline2 = await mediaIdByFilename(payload, req, "journal-article-inline-02.jpg");
  if (!inline1 || !inline2) {
    throw new Error(
      `Missing journal inline media (01=${inline1}, 02=${inline2}). Expected public/media/journal-article-inline-0{1,2}.jpg`,
    );
  }

  await payload.update({
    collection: "journal-posts",
    id: doc.id,
    data: {
      deck: DECK,
      // Prefer structured blocks so the muted closing CTA + button render.
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
      "width" = 1226,
      "height" = 1839,
      "filesize" = 182939,
      "updated_at" = now()
    WHERE "filename" = 'journal-article-inline-01.jpg'
  `);

  // Down clears structured blocks; the page falls back to articleDefaults.
  // The previous Lexical body is not restored (it was lossy relative to Figma).
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
      deck: DECK,
      articleBlocks: [],
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}
