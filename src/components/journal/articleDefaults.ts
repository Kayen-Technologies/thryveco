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

/** Figma: 439:1109 OJ1; 439:1177 OJ2; 439:1244 OJ3; 439:1312 OJ4 */
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
          "Now ask yourself, was it the product alone that pulled you in? Or was it something about the way it looked?",
          "Nine times out of ten, it's the aesthetic.",
        ],
      },
      {
        type: "headingGroup",
        heading: "Aesthetic is not decoration",
        paragraphs: [
          "There's a common misconception that investing in how your brand looks is a vanity exercise. That it's the last thing to think about after the product, the pricing, the logistics.",
          "But here's the truth. Your aesthetic is the first thing your audience sees before they read a single word. Before they know your price point. Before they decide whether to follow, click, or buy.",
          "It's your first impression. And in a world where someone decides whether to engage with your content in under three seconds, that first impression is everything.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-inline-01.jpg",
          alt: "Straw hat, spritz, and peaches on a sunlit table",
        },
      },
      {
        type: "headingGroup",
        heading: "What a strong aesthetic actually does for your brand",
        paragraphs: [
          "It builds recognition. When your visual identity is consistent – the colours, the fonts, the tone, the feeling – people start to recognise your content before they even see your name. That's not luck. That's strategy.",
          "It builds trust. A brand that looks put together signals that the business behind it is put together. Consciously or not, your audience is making that connection every single time they land on your page.",
          "It attracts the right people. Your aesthetic speaks before you do. The right visual direction will draw in exactly the kind of client or customer you want and quietly filter out the ones who aren't the right fit.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-inline-02.jpg",
          alt: "Gift boxes and a Psalms book on a burgundy surface",
        },
      },
      {
        type: "headingGroup",
        heading: "So what does this mean for your brand?",
        paragraphs: [
          "It means your aesthetic deserves as much thought as your product. It means the colours you choose, the way you frame a photo, the fonts on your graphics, none of it should be accidental.",
          "It means growth and beauty are not mutually exclusive. In fact, the most strategic thing you can do for your brand right now might just be making it look the part.",
        ],
      },
      {
        type: "closingCta",
        lead: "At Thryve & Co., this is exactly ",
        muted:
          "what we obsess over building. Brand presences that are as intentional as they are beautiful. If you're ready to make ",
        end: "your aesthetic work as hard as you do, you know where to find us.",
        ctaLabel: "Book a Discovery Call",
        ctaHref: "/contact",
      },
    ],
  },
  "posting-every-day-wont-save-your-brand": {
    deck:
      "You've heard 'stay consistent' so many times it's practically a mantra. But there's a difference between showing up and showing up with something to say.",
    authorLabel: "Thryve & Co.",
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "Let's talk about something nobody really wants to admit. You can post every single day and still see absolutely no growth. No new followers. No inquiries. No engagement worth celebrating. Just content going out into the void and coming back with nothing.",
          "Sound familiar?",
          "Here's the thing: posting frequency is not your problem. Posting without purpose is.",
        ],
      },
      {
        type: "headingGroup",
        heading: "The myth of daily posting.",
        paragraphs: [
          "Somewhere along the line, the algorithm conversation got twisted into this idea that more content equals more reach equals more growth. And while consistency matters (it genuinely does), volume without intention is just noise.",
          "Your audience isn't sitting around waiting for your next post. They're scrolling through hundreds of pieces of content every single day. The brands that cut through aren't the ones posting the most. They're the ones posting with the clearest point of view.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-inline-03.jpg",
          alt: "Camera on a tripod filming a sunset",
        },
      },
      {
        type: "headingGroup",
        heading: "What actually moves the needle.",
        paragraphs: [
          "Not a content calendar filled with random post ideas. Not a recycled trend that has nothing to do with your brand. A genuine, intentional strategy that answers three questions before a single piece of content is created:",
          "Who are we talking to?",
          "What do we want them to feel?",
          "What do we want them to do next?",
          "When every post has a clear answer to those three questions, that's when things start to shift. That's when your content stops being background noise and starts being something people actually stop for.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-inline-04.jpg",
          alt: "Hands planning brand work over a desk with sticky notes and a laptop",
        },
      },
      {
        type: "headingGroup",
        heading: "Quality over quantity. Every time.",
        paragraphs: [
          "Three intentional, well-crafted posts a week will always outperform seven rushed, directionless ones. Always. Because your audience can feel the difference between content that was made for them and content that was made just to fill a slot in a calendar.",
          "The brands winning on social right now aren't posting more. They're thinking more. Planning more. Caring more about what goes out under their name.",
        ],
      },
      {
        type: "closingCta",
        lead: "That's the standard we hold at Thryve & Co. ",
        muted:
          "and the one we bring to every brand we work with. If you're tired of posting into the void",
        end: " and ready to build a presence that actually performs, let's talk.",
        ctaLabel: "Book a Discovery Call",
        ctaHref: "/contact",
      },
    ],
  },
  "accra-creative-scene-having-a-moment": {
    deck:
      "Something is shifting in Accra. The brands are bolder, the creatives are louder, and the work is undeniably world class. We've got front row seats and we wouldn't have it any other way.",
    authorLabel: "Thryve & Co.",
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "If you've been paying attention, you already know.",
          "Something is happening in Accra. You can feel it in the restaurants that look like they belong in a design magazine. In the fashion brands building loyal following without a single billboard. In the content creators producing work that stops people mid-scroll from London to Lagos to Los Angeles.",
          "Accra is building something. And it's beautiful.",
        ],
      },
      {
        type: "headingGroup",
        heading: "The creative renaissance nobody talks about enough.",
        paragraphs: [
          "For a long time, the narrative around African brands and creative businesses was about catching up. About looking outward for inspiration, validation, and standards.",
          "That narrative is shifting. The creative professionals coming out of Accra right now are not looking outward for permission. They're setting their own standards, building their own aesthetics, and creating work that the rest of the world is starting to pay very close attention to.",
          "The photography is intentional. The brand identities are considered. The social media presence of the best local brands rivals anything you'd find in New York or London and in many cases surpasses it.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-accra-01.jpg",
          alt: "Video editing workspace with Premiere Pro on a curved monitor",
        },
      },
      {
        type: "headingGroup",
        heading: "What's driving it.",
        paragraphs: [
          "Access and ambition in equal measure.",
          "A generation of Ghanaian creatives who grew up consuming world class content and decided, consciously or not, that there was no reason they couldn't produce it too. Combined with tools, platforms, and a local market that is increasingly willing to invest in quality creative work.",
          "The result is a scene that is quietly, confidently, and unapologetically excellent.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-accra-02.jpg",
          alt: "Two creatives collaborating at a table with art supplies",
        },
      },
      {
        type: "headingGroup",
        heading: "Where Thryve fits in.",
        paragraphs: [
          "We didn't build Thryve & Co. in spite of being based in Accra. We built it because of it. Because we believe the brands coming out of this city – the lifestyle labels, the product businesses, the experience-driven companies – deserve creative support that matches their ambition. That understands their market. That knows the difference between what works globally and what resonates locally.",
          "We are Accra-based and we are proud of it. And we are building something here that we hope adds to the momentum of everything already happening around us.",
        ],
      },
      {
        type: "closingCta",
        lead: "The Accra creative scene is having a moment. ",
        muted: "We're here for all of it and ",
        end: "we're just getting started.",
        ctaLabel: "Book a Discovery Call",
        ctaHref: "/contact",
      },
    ],
  },
  "why-the-best-brands-never-leave-creativity-to-chance": {
    deck:
      "Talent helps. But it's not what separates the brands that last from the ones that fade. Intention is.",
    authorLabel: "Thryve & Co.",
    blocks: [
      {
        type: "paragraphs",
        paragraphs: [
          "There's a version of creativity that feels magical, like it just happens. A brilliant idea, a perfect shot, a caption that stops the scroll, all conjured out of thin air by someone with \"an eye.\"",
          "It's a nice story. It's also mostly untrue.",
        ],
      },
      {
        type: "headingGroup",
        heading: "The myth of the happy accident.",
        paragraphs: [
          "Every brand you admire, the ones whose feed you actually stop for, whose visuals feel unmistakably theirs, didn't get there by accident. Behind every \"effortless\" post is a decision. Often several. What to shoot, how to shoot it, what story it's telling, why it matters to the person seeing it.",
          "Creativity that looks spontaneous is almost never spontaneous. It's rehearsed, planned, and refined until it looks like it wasn't.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-creativity-1.jpg",
          alt: "Empty black chair in a photo studio with softbox lighting",
        },
      },
      {
        type: "headingGroup",
        heading: "What \"leaving it to chance\" actually looks like.",
        paragraphs: [
          "It looks like posting whatever feels right in the moment, with no real thread connecting one piece of content to the next. It looks like a shoot with no shot list, no mood board, no clear idea of what story is being told before the camera comes out. It looks like a brand that's active, but not cohesive. Busy, but not building anything.",
          "None of that is a talent problem. It's a planning problem.",
        ],
      },
      {
        type: "image",
        image: {
          src: "/assets/journal/journal-article-creativity-2.jpg",
          alt: "Camera viewfinder filming two people on a cream sofa",
        },
      },
      {
        type: "headingGroup",
        heading: "Why this matters more than raw talent.",
        paragraphs: [
          "Talent gets you one good post. Intention gets you a body of work that means something. Content that builds on itself, a feed that tells a story over time, a brand that people recognise before they even read the name.",
          "That's the real difference between brands that spark for a moment and brands that last. Not who has the better camera. Who has the better process.",
        ],
      },
      {
        type: "closingCta",
        lead: "At Thryve & Co., nothing we make is left to chance. ",
        muted:
          "Every shoot, every strategy, every piece of content starts with a reason before it becomes a result. ",
        end: "If you're ready to stop guessing and start building something intentional, you know where to find us.",
        ctaLabel: "Book a Discovery Call",
        ctaHref: "/contact",
      },
    ],
  },
};

export function articleContentForSlug(slug: string): JournalArticleContent | null {
  return JOURNAL_ARTICLE_DEFAULTS[slug] ?? null;
}
