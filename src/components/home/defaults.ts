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
      "We're a creative agency for brands that refuse to blend in. Aesthetic-forward, strategy-driven, and built for brands that want both.",
      "We help ambitious brands build an online presence that feels as intentional as the products and experiences they create. By blending strategy, creative direction, content creation and social media management, we shape brands that are memorable, culturally relevant and impossible to overlook.",
    ],
    ctaLabel: "Book a Discovery Call",
    ctaHref: "/contact",
    image: { src: "/assets/home/intro-portrait.jpg", alt: "" },
  },
  marquee: {
    items: [
      {
        word: "Social",
        image: {
          src: "/assets/home/marquee-social.jpg",
          alt: "Tablet and Positivity book on textured fabric",
        },
      },
      {
        word: "Cultured",
        image: {
          src: "/assets/home/marquee-cultured.jpg",
          alt: "Gold vessel and chain on burgundy surface",
        },
      },
      {
        word: "Curated",
        image: {
          src: "/assets/home/marquee-curated.jpg",
          alt: "Founder in burgundy suit by a window",
        },
      },
    ],
    // Legacy single-image fallback for items without an upload
    image: { src: "/assets/home/marquee-photo.jpg", alt: "" },
  },
  featured: {
    headline: "Every brand has a story. We make sure it’s one worth remembering.",
    body: "From strategy and content creation to full-scale campaigns, every project is thoughtfully crafted to help brands show up with confidence, clarity and unmistakable presence.",
    items: [
      {
        slug: "purple-square-interiors",
        href: "/works/purple-square-interiors",
        name: "Purple Square Interiors",
        category: "Interior Design Studio",
        tags: [
          "Brand Identity",
          "Content Strategy",
          "Digital Marketing",
          "Videography",
        ],
        image: {
          src: "/assets/home/work-purple-square.jpg",
          alt: "Purple Square Interiors styled shelf vignette",
        },
      },
      {
        slug: "naya-moments",
        href: "/works/naya-moments",
        name: "Naya Moments",
        category: "Events Stylist",
        tags: [
          "Brand Identity",
          "Photography",
          "Social Media Management",
          "Videography",
        ],
        image: {
          src: "/assets/home/work-naya-moments.jpg",
          alt: "Naya Moments skincare dialogue event set",
        },
      },
      {
        slug: "mya-art-workshop",
        href: "/works/mya-art-workshop",
        name: "Mya Art Workshop",
        category: "Art Studio",
        tags: [
          "Brand Positioning",
          "Content Strategy",
          "Social Media Management",
          "Videography",
        ],
        image: {
          src: "/assets/home/work-mya-art.jpg",
          alt: "Mya Art Workshop studio with easels",
        },
      },
    ],
  },
  quote: {
    quote: "Growth should look as good as it performs.",
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
    headline: "Your Next Brand Move Starts Here.",
    subtext:
      "Your brand deserves more than content that fills a feed. Let’s build a strategy, presence, and visual identity people actually remember.",
    ctaLabel: "Book My Discovery Call",
    ctaHref: "/contact",
    image: { src: "/assets/home/final-cta.jpg", alt: "Creative studio workspace" },
  },
} as const;

export type HomeMediaSrc = {
  src: string;
  alt: string;
};
