export type AboutMediaSrc = {
  src: string;
  alt: string;
};

export const ABOUT_DEFAULTS = {
  hero: {
    headline: "We're not here to fit in",
    tagline: "We never were",
    image: { src: "/assets/about/about-hero.jpg", alt: "Thryve & Co about hero" },
  },
  founderSection: {
    headline: "Meet the Founder",
    name: "Michelle Teschmaker",
  },
  founderStory: {
    headlineLead: "It started, like ",
    headlineMuted: "most good things do, with a camera and a ",
    headlineEnd: "lot of curiosity.",
    paragraphOne:
      "Before Thryve, Michelle was a digital creator learning the language of content, aesthetics and storytelling one post at a time. She had an eye for what looked good and an instinct for what felt right. That combination led her into social media management, where she discovered something she hadn't expected: a love for strategy. For the thinking behind the making. For the way a well-built brand presence could change how a business was perceived overnight.",
    paragraphTwo:
      "Five years, multiple clients, and countless content pieces later, it became clear that what she was building wasn't just a freelance career. It was something bigger. Something with a name, a vision, and a standard.",
    storyImage: {
      src: "/assets/about/about-story-portrait.jpg",
      alt: "Michelle Teschmaker with camera",
    },
    collage: [
      { src: "/assets/about/about-founder-collage-01.jpg", alt: "Michelle Teschmaker portrait" },
      { src: "/assets/about/about-founder-collage-02.jpg", alt: "Brand collateral detail" },
      { src: "/assets/about/about-founder-collage-03.jpg", alt: "Michelle Teschmaker portrait" },
    ],
  },
  founderQuote: {
    quote:
      "I've always been fascinated by the creative process — the idea, the execution, the way something beautiful comes together. That giddiness I feel when I come across something truly aesthetic and intentional? That's what I want people to feel when they encounter the brands I work with. I don't just want my clients to post — I want them to have a presence that has class, intention, and an aesthetic that's undeniably theirs.",
    attribution: "Michelle Teschmaker, Founder & Creative Director",
  },
  whatThryve: {
    intro:
      "Thriving isn’t passive. It’s putting yourself out there, taking up space, and doing it on your own terms. And the & Co.? That’s the part that says we’re always doing more. More than just thriving. More ideas, more possibilities, more of what your brand deserves.",
    agencyCopy:
      "We call ourselves a Creative Agency because that’s exactly what we are. A team of people whose job is to make your brand impossible to ignore. A creative partner with a point of view, in your corner, invested in what you’re building.",
    aspirationCopy:
      "We aspire to be the agency that changes how lifestyle, wellness and product brands show up. The name people mention when they talk about brands that look different. The agency behind the brands you can’t stop watching.",
    image: {
      src: "/assets/about/about-what-thryve.jpg",
      alt: "Michelle reviewing brand work on a tablet",
    },
    underlineSrc: "/assets/about/thryve-underline.svg",
  },
  cta: {
    headline: "Your Next Brand Move Starts Here.",
    subtext:
      "Your brand deserves more than content that fills a feed. Let’s build a strategy, presence, and visual identity people actually remember.",
    ctaLabel: "Book a Discovery Call",
    ctaHref: "/contact",
    image: { src: "/assets/about/about-cta.jpg", alt: "Creative studio lifestyle scene" },
  },
} as const;
