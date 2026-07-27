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
    topLine: "READY TO BUILD A BRAND",
    topLineAccent: "PEOPLE REMEMBER?",
    bottomLine: "BEAUTIFUL BRANDS",
    bottomLineAccent: "START HERE",
    ctaLabel: "Book A Discovery Call",
    ctaHref: "/contact",
    backgroundImage: {
      src: "/assets/works/cta-bg.jpg",
      alt: "Creative work in progress",
    },
  },
  works: [
    {
      slug: "casa-muse",
      client: "CASA MUSE",
      industry: "Interior Design Studio",
      tags: ["Brand Identity", "Content Strategy", "Digital Marketing", "Photography"],
      coverImage: {
        src: "/assets/works/work-casa-muse.jpg",
        alt: "Casa Muse interior design showcase",
      },
    },
    {
      slug: "sole",
      client: "SÓLÉ",
      industry: "Skincare",
      tags: ["Brand Identity", "Product Photography", "Social Media", "Campaign Creative"],
      coverImage: {
        src: "/assets/works/work-sole.jpg",
        alt: "Solé skincare products",
      },
    },
    {
      slug: "aure",
      client: "AURE",
      industry: "Fine Jewellery",
      tags: ["Brand Positioning", "Content Strategy", "Digital Marketing", "Photography"],
      coverImage: {
        src: "/assets/works/work-aure.jpg",
        alt: "Aure fine jewellery collection",
      },
    },
    {
      slug: "lune",
      client: "LUNE",
      industry: "Luxury Fragrance",
      tags: ["Creative Direction", "Photography", "Social Media", "Content Strategy"],
      coverImage: {
        src: "/assets/works/work-lune.jpg",
        alt: "Lune luxury fragrance presentation",
      },
    },
  ],
} as const;
