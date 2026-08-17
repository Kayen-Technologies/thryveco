export type WorksMediaSrc = {
  src: string;
  alt: string;
};

export const WORKS_DEFAULTS = {
  hero: {
    headline: "Good brands are built. Great brands are Thryved.",
    subheadline:
      "A collection of brands we've helped find their voice, their aesthetic, and their people.",
    heroImage: {
      src: "/assets/works/hero-backdrop.jpg",
      alt: "Decorative interior design backdrop",
    },
  },
  portfolio: {
    title: "Brands We've Built",
  },
  cta: {
    headline: "Your Next Brand Move Starts Here.",
    subtext:
      "Your brand deserves more than content that fills a feed. Let’s build a strategy, presence, and visual identity people actually remember.",
    ctaLabel: "Book a Discovery Call",
    ctaHref: "/contact",
    image: {
      src: "/assets/home/final-cta.jpg",
      alt: "Creative studio workspace",
    },
  },
  works: [
    {
      slug: "purple-square-interiors",
      client: "Purple Square Interiors",
      industry: "Interior Design Studio",
      tags: ["Brand Identity", "Content Strategy", "Digital Marketing", "Videography"],
      coverImage: {
        src: "/assets/home/work-purple-square.jpg",
        alt: "Purple Square Interiors styled shelf vignette",
      },
    },
    {
      slug: "naya-moments",
      client: "Naya Moments",
      industry: "Events Stylist",
      tags: ["Brand Identity", "Photography", "Social Media Management", "Videography"],
      coverImage: {
        src: "/assets/home/work-naya-moments.jpg",
        alt: "Naya Moments event styling showcase",
      },
    },
    {
      slug: "mya-art-workshop",
      client: "Mya Art Workshop",
      industry: "Art Studio",
      tags: ["Brand Positioning", "Content Strategy", "Social Media Management", "Videography"],
      coverImage: {
        src: "/assets/home/work-mya-art.jpg",
        alt: "Mya Art Workshop studio showcase",
      },
    },
  ],
} as const;
