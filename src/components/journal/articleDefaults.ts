import type { JournalMediaSrc } from "@/components/journal/defaults";

export type JournalArticleParagraphBlock = {
  type: "paragraphs";
  paragraphs: string[];
};

export type JournalArticleHeadingBlock = {
  type: "headingGroup";
  heading: string;
  paragraphs: string[];
};

export type JournalArticleImageBlock = {
  type: "image";
  image: JournalMediaSrc;
};

export type JournalArticleImageGridBlock = {
  type: "imageGrid";
  columns: "2" | "3" | "4";
  images: JournalMediaSrc[];
};

export type JournalArticleClosingCtaBlock = {
  type: "closingCta";
  lead: string;
  muted: string;
  end: string;
  ctaLabel: string;
  ctaHref: string;
};

export type JournalArticleBlock =
  | JournalArticleParagraphBlock
  | JournalArticleHeadingBlock
  | JournalArticleImageBlock
  | JournalArticleImageGridBlock
  | JournalArticleClosingCtaBlock;

export type JournalArticleContent = {
  deck: string;
  authorLabel: string;
  blocks: JournalArticleBlock[];
};

export const JOURNAL_ARTICLE_DEFAULTS: Record<string, JournalArticleContent> = {
  "your-aesthetic-is-your-most-powerful-business-tool": {
    deck:
      "The brands you can't stop watching aren't just lucky. There's intention behind every detail and it's doing more work for their business than they might even realise.",
    authorLabel: "Thryve & Co.",
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "Think about the last brand you followed without really knowing why. The one whose posts you save. Whose feed you go back to. Whose product you'd buy before you even needed it.",
          "Now ask yourself was it the product alone that pulled you in? Or was it something about the way it looked?",
          "Nine times out of ten, it's the aesthetic.",
        ],
      },
      {
        type: "headingGroup",
        heading: "Aesthetic is not decoration",
        paragraphs: [
          "There's a common misconception that investing in how your brand looks is a vanity exercise. That it's the last thing to think about after the product, the pricing, the logistics.",
          "But here's the truth your aesthetic is the first thing your audience sees before they read a single word. Before they know your price point. Before they decide whether to follow, click, or buy.",
          "It's your first impression. And in a world where someone decides whether to engage with your content in under three seconds that first impression is everything.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-inline-01.jpg",
          alt: "Woman holding a Kinfolk magazine in front of her face",
        },
      },
      {
        type: "headingGroup",
        heading: "What a strong aesthetic actually does for your brand",
        paragraphs: [
          "It builds recognition. When your visual identity is consistent the colours, the fonts, the tone, the feeling people start to recognise your content before they even see your name. That's not luck. That's strategy.",
          "It builds trust. A brand that looks put together signals that the business behind it is put together. Consciously or not, your audience is making that connection every single time they land on your page.",
          "It attracts the right people. Your aesthetic speaks before you do. The right visual direction will draw in exactly the kind of client or customer you want and quietly filter out the ones who aren't the right fit.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-inline-02.jpg",
          alt: "Paum brand card on a burgundy surface with holiday decor",
        },
      },
      {
        type: "headingGroup",
        heading: "So what does this mean for your brand?",
        paragraphs: [
          "It means your aesthetic deserves as much thought as your product. It means the colours you choose, the way you frame a photo, the fonts on your graphics none of it should be accidental.",
          "It means growth and beauty are not mutually exclusive. In fact, the most strategic thing you can do for your brand right now might just be making it look the part.",
        ],
      },
      {
        type: "closingCta",
        lead: "At Thryve & Co., this is exactly ",
        muted:
          "what we obsess over building brand presences that are as intentional as they are beautiful. If you're ready to make ",
        end: "your aesthetic work as hard as you do, you know where to find us.",
        ctaLabel: "Book a Discovery Call",
        ctaHref: "/contact",
      },
    ],
  },
};

export function articleContentForSlug(slug: string): JournalArticleContent | null {
  return JOURNAL_ARTICLE_DEFAULTS[slug] ?? null;
}
