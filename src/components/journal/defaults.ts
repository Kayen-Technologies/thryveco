export type JournalMediaSrc = {
  src: string;
  alt: string;
};

export const JOURNAL_DEFAULTS = {
  hero: {
    headline: "Thoughts, perspective & a little creative obsession.",
    tagline:
      "We write about the things we care about aesthetics, strategy, social media, and everything happening in the creative world around us. Pull up a seat.",
    image: {
      src: "/assets/journal/journal-hero-backdrop.jpg",
      alt: "Creative workspace with notebook and candle",
    },
  },
  entriesSection: {
    title: "Journal Entry",
  },
  cta: {
    headline: "Ready to build a brand people remember?",
    subtext: "Beautiful brands start here",
    ctaLabel: "Book A Discovery Call",
    ctaHref: "/contact",
    image: { src: "/assets/home/final-cta.jpg", alt: "Creative studio workspace" },
  },
  posts: [
    {
      slug: "your-aesthetic-is-your-most-powerful-business-tool",
      title: "Your aesthetic isn't just pretty it's your most powerful business tool.",
      category: "Branding",
      readTime: 4,
      excerpt:
        "The brands you can't stop watching aren't just lucky. There's intention behind every colour, every caption, every carefully placed detail. Here's why your aesthetic might be the most underrated part of your business.",
      image: {
        src: "/assets/journal/journal-post-01.jpg",
        alt: "Person working on a rose-gold laptop beside a houseplant",
      },
    },
    {
      slug: "posting-every-day-wont-save-your-brand",
      title: "Posting every day alone won't save your brand but this will.",
      category: "Social Media",
      readTime: 3,
      excerpt:
        "We get it. You've heard 'stay consistent' so many times it's practically a mantra. But there's a difference between showing up and showing up with something to say. Here's what actually moves the needle.",
      image: {
        src: "/assets/journal/journal-post-02.jpg",
        alt: "Hand holding a smartphone in front of city billboards",
      },
    },
    {
      slug: "accra-creative-scene-having-a-moment",
      title: "The Accra creative scene is having a moment and we're here for it.",
      category: "Culture",
      readTime: 5,
      excerpt:
        "Something is shifting in Accra. The brands are bolder, the creatives are louder, and the work is undeniably world class. We've got front row seats — and we wouldn't have it any other way.",
      image: {
        src: "/assets/journal/journal-post-03.jpg",
        alt: "Group of creative women smiling together",
      },
    },
    {
      slug: "why-the-best-brands-never-leave-creativity-to-chance",
      title: "Why the best brands never leave creativity to chance.",
      category: "Creative Direction",
      readTime: 3,
      excerpt:
        "Creative direction is more than making things look good. It's about creating a consistent visual language that shapes how people recognize, remember, and connect with your brand.",
      image: {
        src: "/assets/journal/journal-post-04.jpg",
        alt: "Art books, mug, and sculptural candle on a table",
      },
    },
  ],
} as const;
