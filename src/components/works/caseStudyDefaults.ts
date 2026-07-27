import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type CaseStudyMediaSrc = {
  src: string;
  alt: string;
};

export type CaseStudyContent = {
  seriesLabel: string;
  brandBody: string;
  brandImages: CaseStudyMediaSrc[];
  challengeBody: string;
  approachParagraphs: string[];
  deliverables: string[];
  results: string[];
  quote: string;
  attribution: string;
  heroImage: CaseStudyMediaSrc;
  galleryImages: CaseStudyMediaSrc[];
};

function paragraphLexical(text: string): SerializedEditorState {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: [
        {
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          direction: "ltr",
          children: [
            {
              type: "text",
              format: 0,
              text,
              version: 1,
              mode: "normal",
              style: "",
              detail: 0,
            },
          ],
        },
      ],
    },
  } as unknown as SerializedEditorState;
}

function paragraphsLexical(paragraphs: string[]): SerializedEditorState {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        children: [
          {
            type: "text",
            format: 0,
            text,
            version: 1,
            mode: "normal",
            style: "",
            detail: 0,
          },
        ],
      })),
    },
  } as unknown as SerializedEditorState;
}

export const CASE_STUDY_DEFAULTS: Record<string, CaseStudyContent> = {
  "casa-muse": {
    seriesLabel: "The Thryve Edit",
    brandBody:
      "Casa Muse is an interior design studio built around intentional spaces and timeless materials. With a growing portfolio of residential and commercial projects, Casa Muse has become known for its warm minimalism, editorial photography, and a visual identity that feels as considered as the rooms they design.",
    brandImages: [
      {
        src: "/assets/works/case-study/brand-01.jpg",
        alt: "Interior styling detail for Casa Muse",
      },
      {
        src: "/assets/works/case-study/brand-02.jpg",
        alt: "Casa Muse brand materials on a styled surface",
      },
    ],
    challengeBody:
      "As Casa Muse expanded into new markets, the challenge shifted from showcasing individual projects to maintaining a cohesive brand presence across every campaign and social touchpoint. The goal was to keep every launch feeling fresh while preserving the warmth and consistency that made the studio instantly recognizable.",
    approachParagraphs: [
      "Rather than reinventing the brand with every campaign, we focused on strengthening what already made Casa Muse distinctive. Every creative decision was guided by consistency, ensuring each visual felt unmistakably Casa Muse while allowing room for storytelling and project education.",
      "We developed a content direction that balanced polished campaign imagery with authentic lifestyle moments, helping the studio feel aspirational without losing its accessibility.",
      "The result was a content system that could scale across launches, social media, and digital campaigns while maintaining a unified visual language.",
    ],
    deliverables: [
      "Brand Content Strategy",
      "Creative Direction",
      "Social Media Content",
      "Product Photography Direction",
    ],
    results: [
      "Increased average engagement across campaign content by 42%",
      "Generated over 4.8 million campaign impressions during the launch period",
      "Strengthened visual consistency across all social platforms",
      "Improved audience engagement through a more cohesive content strategy",
    ],
    quote:
      "Working with Thryve & Co. gave us a stronger creative system without compromising the simplicity that defines Casa Muse. Every campaign felt intentional, cohesive, and unmistakably us.",
    attribution: "Jane D., Founder of Casa Muse",
    heroImage: {
      src: "/assets/works/case-study/hero.jpg",
      alt: "Casa Muse interior design hero image",
    },
    galleryImages: [
      { src: "/assets/works/case-study/gallery-01.jpg", alt: "Casa Muse project gallery image 1" },
      { src: "/assets/works/case-study/gallery-02.jpg", alt: "Casa Muse project gallery image 2" },
      { src: "/assets/works/case-study/gallery-03.jpg", alt: "Casa Muse project gallery image 3" },
      { src: "/assets/works/case-study/gallery-04.jpg", alt: "Casa Muse project gallery image 4" },
    ],
  },
  sole: {
    seriesLabel: "The Thryve Edit",
    brandBody:
      "Solé is a skincare brand rooted in simplicity, self-care rituals, and clean ingredients. Built for modern consumers who value transparency and results, Solé needed a brand presence that felt as fresh and honest as their formulations — approachable yet elevated, minimal yet memorable.",
    brandImages: [],
    challengeBody:
      "Solé was entering a crowded skincare market where every brand claims to be clean and effective. The challenge was to carve out a distinct visual identity and voice that could cut through the noise while building genuine trust with an audience increasingly skeptical of beauty marketing.",
    approachParagraphs: [
      "We developed a visual language centered on light, texture, and skin — celebrating the product's effect rather than just its packaging. Every campaign asset was designed to feel tactile and intimate.",
      "On social, we shifted from product-first content to routine-first storytelling, showing Solé as part of a lifestyle rather than just a purchase.",
      "The result was a cohesive brand system that scaled from packaging to social to retail, all while maintaining the soft, confident tone that defined Solé.",
    ],
    deliverables: [
      "Brand Identity",
      "Product Photography",
      "Social Media",
      "Campaign Creative",
    ],
    results: [
      "Grew social following by 280% in the first six months",
      "Achieved sell-out on hero SKU within 48 hours of launch",
      "Increased website conversion rate by 35%",
      "Secured features in Vogue, Elle, and Byrdie",
    ],
    quote:
      "Thryve understood that skincare is personal. They helped us build a brand that feels like a friend, not a corporation.",
    attribution: "Maya K., Founder of Solé",
    heroImage: {
      src: "/assets/works/work-sole.jpg",
      alt: "Solé skincare product photography",
    },
    galleryImages: [],
  },
  aure: {
    seriesLabel: "The Thryve Edit",
    brandBody:
      "Aure is a fine jewellery house specializing in handcrafted gold pieces inspired by West African artistry and contemporary design. Each piece tells a story of heritage, craftsmanship, and modern elegance — and the brand needed a visual identity to match.",
    brandImages: [],
    challengeBody:
      "Luxury jewellery marketing often feels cold and distant. Aure wanted to feel warm, personal, and culturally rooted without sacrificing the elevated perception that fine jewellery demands. The challenge was balancing heritage storytelling with aspirational positioning.",
    approachParagraphs: [
      "We built a visual system around warmth — golden tones, natural textures, and intimate close-ups that celebrated both the craft and the wearer.",
      "Content strategy focused on the stories behind each collection, connecting pieces to their cultural inspirations and the artisans who create them.",
      "The result was a brand that feels like an heirloom — timeless, meaningful, and unmistakably Aure.",
    ],
    deliverables: [
      "Brand Positioning",
      "Content Strategy",
      "Digital Marketing",
      "Photography Direction",
    ],
    results: [
      "Doubled average order value within the first quarter",
      "Achieved 65% increase in website traffic from social",
      "Built a waitlist of 2,000+ for limited edition collections",
      "Expanded retail presence to three new markets",
    ],
    quote:
      "They captured the soul of Aure. Our customers don't just buy jewellery — they feel connected to something meaningful.",
    attribution: "Nana A., Creative Director of Aure",
    heroImage: {
      src: "/assets/works/work-aure.jpg",
      alt: "Aure fine jewellery collection",
    },
    galleryImages: [],
  },
  lune: {
    seriesLabel: "The Thryve Edit",
    brandBody:
      "Lune is a luxury fragrance house creating scents that evoke memory, emotion, and place. With a focus on rare ingredients and artisanal production, Lune needed a brand presence as layered and evocative as their fragrances.",
    brandImages: [],
    challengeBody:
      "Fragrance is invisible — the challenge was to make scent feel tangible through visuals and words. Lune needed content that could transport audiences into the world of each fragrance, building desire without the ability to smell.",
    approachParagraphs: [
      "We developed a sensory-first content strategy, using rich imagery, evocative copywriting, and atmospheric video to create an immersive brand experience.",
      "Each fragrance was given its own visual world — a palette, a mood, a story — allowing the collection to feel cohesive while each scent retained its individuality.",
      "Social content focused on moments and memories, inviting audiences to imagine where each scent might take them.",
    ],
    deliverables: [
      "Creative Direction",
      "Photography",
      "Social Media",
      "Content Strategy",
    ],
    results: [
      "Achieved 4x return on ad spend for launch campaign",
      "Built Instagram following to 50K in under a year",
      "Generated 1.2M video views on launch content",
      "Secured stockist partnerships with luxury retailers",
    ],
    quote:
      "Thryve made our fragrances feel like destinations. Every piece of content invites you somewhere beautiful.",
    attribution: "Kofi M., Founder of Lune",
    heroImage: {
      src: "/assets/works/work-lune.jpg",
      alt: "Lune luxury fragrance presentation",
    },
    galleryImages: [],
  },
};

export function caseStudyContentForSlug(slug: string): CaseStudyContent | null {
  return CASE_STUDY_DEFAULTS[slug] ?? null;
}

export function defaultBrandLexical(slug: string): SerializedEditorState | null {
  const content = caseStudyContentForSlug(slug);
  return content ? paragraphLexical(content.brandBody) : null;
}

export function defaultChallengeLexical(slug: string): SerializedEditorState | null {
  const content = caseStudyContentForSlug(slug);
  return content ? paragraphLexical(content.challengeBody) : null;
}

export function defaultApproachLexical(slug: string): SerializedEditorState | null {
  const content = caseStudyContentForSlug(slug);
  return content ? paragraphsLexical(content.approachParagraphs) : null;
}

export { paragraphLexical, paragraphsLexical };
