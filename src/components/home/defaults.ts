// Structural Figma fallbacks until CMS populated / schema extended.
export const HOME_DEFAULTS = {
  hero: {
    headline: "Your Brand's New Creative Friend",
    emphasis: "Creative Friend",
    image: {
      src: "/assets/home/hero.jpg",
      alt: "Founder reviewing work on a tablet",
    },
    videoSrc: "/assets/home/hero.mp4",
  },
  intro: {
    headline: "Growth should look as good as it performs.",
    body: [
      "We're a creative agency for brands that refuse to blend in — aesthetic-forward, strategy-driven, and built for brands that want both.",
      "We help ambitious brands build an online presence that feels as intentional as the products and experiences they create. By blending strategy, creative direction, content creation and social media management, we shape brands that are memorable, culturally relevant and impossible to overlook.",
    ],
    ctaLabel: "Book a Discovery Call",
    ctaHref: "/contact",
    image: { src: "/assets/home/intro-portrait.jpg", alt: "" },
  },
  marquee: {
    primaryWord: "Cultured",
    secondaryWord: "Intentional",
    image: { src: "/assets/home/marquee-photo.jpg", alt: "" },
    maskSrc: "/assets/home/marquee-mask.svg",
  },
  featured: {
    headline: "Every brand has a story. We make sure it’s one worth remembering.",
    body: "From strategy and content creation to full-scale campaigns, every project is thoughtfully crafted to help brands show up with confidence, clarity and unmistakable presence.",
    items: [
      {
        slug: "casa-muse",
        href: "/works/casa-muse",
        name: "Casa muse",
        category: "Interior Design Studio",
        tags: ["Brand Identity", "Content Strategy", "Digital Marketing", "Photography"],
        image: { src: "/assets/home/work-01.jpg", alt: "Casa Muse interior case study hero" },
      },
      {
        slug: "sole",
        href: "/works",
        name: "SÓLÉ",
        category: "Skincare",
        tags: ["Brand Identity", "Product Photography", "Social Media", "Campaign Creative"],
        image: { src: "/assets/home/work-02.jpg", alt: "Sole skincare case study hero" },
      },
      {
        slug: "aure",
        href: "/works",
        name: "Aure",
        category: "Fine Jewellery",
        tags: ["Brand Positioning", "Content Strategy", "Digital Marketing", "Photography"],
        image: { src: "/assets/home/work-03.jpg", alt: "Aure fine jewellery case study hero" },
      },
      {
        slug: "lune",
        href: "/works",
        name: "Lune",
        category: "Luxury Fragrance",
        tags: ["Creative Direction", "Photography", "Social Media", "Content Strategy"],
        image: { src: "/assets/home/work-04.jpg", alt: "Lune luxury fragrance case study hero" },
      },
    ],
  },
  quote: {
    quote: "Beautiful brands aren't an accident. They're built, on purpose, one detail at a time.",
    attribution: "Thryve & Co Creative Agency",
  },
  testimonials: {
    headline: "Loved by brands that believe details make the difference.",
    body: "From startups finding their voice to established brands refining their presence, here’s what it’s like to work with Thryve & Co.",
    items: [
      {
        name: "Dianne Russell",
        role: "Founder, SÓLÉ Skincare",
        quote:
          "Thryve gave our brand the clarity and confidence we’d been searching for. Every detail felt intentional, and our online presence reflected the quality of our business.",
      },
      {
        name: "Nathan Kovssan",
        role: "Founder, CASA MUSE",
        quote:
          "Thryve transformed our ideas into a brand that feels cohesive, memorable, and beautifully aligned with our vision.",
      },
      {
        name: "Esther Howard",
        role: "Founder, MÉLO Café",
        quote:
          "What stands out most is the consistency. Week after week, they create content that feels fresher, calmer, and beautifully cared for.",
      },
      {
        name: "Leslie Alexander",
        role: "Founder, ÉLAN Lifestyle",
        quote:
          "Working with Thryve felt like finding a creative partner who truly understood our vision. Every piece of content felt elevated, thoughtful and unmistakably us.",
      },
      {
        name: "Grace Movender",
        role: "Founder, VERA Bridal",
        quote:
          "From the first consultation to the final review, every interaction reflected thoughtfulness, precision, and a genuine commitment to excellence.",
      },
    ],
  },
  finalCta: {
    headline: "Ready to build a brand people remember?",
    subtext: "Beautiful brands start here",
    ctaLabel: "Book A Discovery Call",
    ctaHref: "/contact",
    image: { src: "/assets/home/final-cta.jpg", alt: "Creative studio workspace" },
  },
} as const;

export const DEFAULT_FINAL_CTA_CLOSING_LINE = "Beautiful brands start here";

export type HomeMediaSrc = {
  src: string;
  alt: string;
};
