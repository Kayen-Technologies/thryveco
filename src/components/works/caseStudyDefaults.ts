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
  /** Figma: 463:1748 Purple Square Interiors */
  "purple-square-interiors": {
    seriesLabel: "The Thryve Edit",
    brandBody:
      "Purple Square Interiors is a luxury interior design studio where aesthetics are not just a preference, they are a standard. Known for spaces that are as intentional as they are beautiful, PSI brings a refined creative vision to every project, crafting interiors that feel considered, elevated, and deeply personal.",
    brandImages: [
      {
        src: "/assets/works/case-study/psi-brand-01.jpg",
        alt: "Purple Square Interiors dining room with wood table and wall art",
      },
      {
        src: "/assets/works/case-study/psi-brand-02.jpg",
        alt: "Purple Square Interiors bedroom with tufted headboard and bedside lamp",
      },
    ],
    challengeBody:
      "While the work spoke for itself, the content didn’t always tell the full story. PSI’s online presence lacked the storytelling and personality-driven elements needed to truly connect with an audience, leaving the brand underleveraged on social media despite the quality behind it.",
    approachParagraphs: [
      "We shifted the focus from simply showcasing spaces to telling the story behind them. Through intentional storytelling, founder-led content, and a more personal look into the PSI world, we gave the brand a voice that matched the depth of its work and gave audiences a reason to stay.",
    ],
    deliverables: [
      "Brand Identity",
      "Content Strategy",
      "Digital Marketing",
      "Videography",
    ],
    results: [
      "A single project reveal reel hit 86K views, contributing to a 13% growth in community and a presence people talk about on and offline.",
      "Revived PSI’s TikTok presence and established consistent activity across platforms.",
      "Built an engaged community that extended beyond the screen.",
      "Content consistently drove high saves, shares and comments across posts.",
    ],
    quote:
      "Michelle transformed our online presence with strategy and creativity. Our brand became clearer, engagement grew, and every post felt intentional.",
    attribution: "Alisa - Creative Lead, Purple Square Interiors",
    heroImage: {
      src: "/assets/works/case-study/psi-hero.jpg",
      alt: "Styled shelf with ceramic vase, dried botanicals, and candle for Purple Square Interiors",
    },
    galleryImages: [
      {
        src: "/assets/works/case-study/psi-gallery-01.jpg",
        alt: "Brown lounge chair with white pillows and ceramic urn",
      },
      {
        src: "/assets/works/case-study/psi-gallery-02.jpg",
        alt: "Empty renovated room before furniture installation",
      },
      {
        src: "/assets/works/case-study/psi-gallery-03.jpg",
        alt: "Founder reviewing materials in a furniture showroom",
      },
      {
        src: "/assets/works/case-study/psi-gallery-04.jpg",
        alt: "Finished living room with ivory sofas and geometric coffee tables",
      },
    ],
  },
  /** Figma: 463:1648 Naya Moments */
  "naya-moments": {
    seriesLabel: "The Thryve Edit",
    brandBody:
      "Naya Moments is an event styling and planning brand rooted in a minimalist, chic aesthetic. With a quiet mastery of tablescapes at the core of what she does, Naya Moments turns even the simplest setup into a moment worth remembering.",
    brandImages: [
      {
        src: "/assets/works/case-study/naya-brand-01.jpg",
        alt: "Outdoor welcome baby tablescape with blush napkins, gold cutlery and scalloped table lamps",
      },
      {
        src: "/assets/works/case-study/naya-brand-02.jpg",
        alt: "Garden reception table set beneath a suspended coral and pink floral installation",
      },
    ],
    challengeBody:
      "When Naya Moments came on board, the brand had little to no social media presence. The work was there. The eye, the skill, the aesthetic, but the world didn’t know it yet. The challenge was clear: build a presence from the ground up, introduce Naya Moments to the right audience, and translate that visibility into real interest and bookings.",
    approachParagraphs: [
      "The approach was rooted in letting the work speak, but giving it the right stage to do so. We brought Naya Moments to life online through before and after visuals that captured the full transformation of every setup, paired with content that highlighted the distinct vibe and intentionality behind each event.",
      "To go beyond the pretty pictures, we wove in short form video and behind the scenes content: week in the life clips that gave followers a real look at her process, her personality, and the eye behind every detail. The result was a presence that felt as considered as the brand itself, and an audience that converted into clients.",
    ],
    deliverables: [
      "Brand Identity",
      "Photography",
      "Social Media Management",
      "Videography",
    ],
    results: [
      "Grew Instagram by 88% and TikTok by 86% in six months.",
      "Built a consistent, engaging presence from zero social media activity.",
      "Expanded brand reach and introduced Naya Moments to new audiences.",
      "Increased visibility translated into new clients and bookings.",
    ],
    quote:
      "Working with Thryve has honestly been such a great experience. They’re patient, supportive, and so intentional with helping bring our vision to life.",
    attribution: "Naya - Founder, Naya Moments",
    heroImage: {
      src: "/assets/works/case-study/naya-hero.jpg",
      alt: "The Skincare Dialogue event styled by Naya Moments with an arched backdrop and white armchairs",
    },
    galleryImages: [
      {
        src: "/assets/works/case-study/naya-gallery-01.jpg",
        alt: "Green and pink tablescape layered with florals, grapes and crystal glassware",
      },
      {
        src: "/assets/works/case-study/naya-gallery-02.jpg",
        alt: "Essakobea event entrance with charcoal plinths, white florals and a champagne tower",
      },
      {
        src: "/assets/works/case-study/naya-gallery-03.jpg",
        alt: "Candlelit walkway lined with red heart balloons for a Valentine’s setup",
      },
      {
        src: "/assets/works/case-study/naya-gallery-04.jpg",
        alt: "Bridal shower wellness setup with yoga mats, arched mirrors and pastel florals",
      },
    ],
  },
  /** Figma: 463:1847 Mya Art Workshop */
  "mya-art-workshop": {
    seriesLabel: "The Thryve Edit",
    brandBody:
      "Mya Art Workshop is an art studio curating hands-on creative experiences for kids and adults across Accra and Dubai. From sip and paint sessions to guided art workshops, Mya creates spaces where creativity feels accessible, intentional, and genuinely fun for every age and every level.",
    brandImages: [
      {
        src: "/assets/works/case-study/mya-brand-01.jpg",
        alt: "Hands dipping a paintbrush into orange paint on a white palette",
      },
      {
        src: "/assets/works/case-study/mya-brand-02.jpg",
        alt: "Artist sketching a vase in graphite on a white canvas",
      },
    ],
    challengeBody:
      "Despite a strong offering, Mya Art Workshop needed to reposition itself in the Ghanaian market to attract a more diverse, local crowd. The content wasn’t yet speaking to the right audience, and visibility in Ghana was being overshadowed by reach in the Dubai market making it harder to build the local community the brand deserved.",
    approachParagraphs: [
      "We moved away from simple workshop recaps and into content that felt relevant, experience-driven, and shareable. Trending audios, engaging short form formats, attendee features, and finished artwork showcases shifted the focus from the event to the experience.",
      "We also ran geo-targeted ads to ensure Ghanaian content was reaching Ghanaian audiences, and transitioned the username from Sip and Paint to Mya Art Workshop, building a stronger, more recognisable brand identity from the ground up.",
    ],
    deliverables: [
      "Brand Positioning",
      "Content Strategy",
      "Social Media Management",
      "Videography",
    ],
    results: [
      "Three months of rebranding and strategic content drove a 312% jump in profile activity.",
      "Geo-targeted ads successfully redirected visibility to the Ghanaian market, reaching the right audience.",
      "Content reached 849 accounts with a 1,276% increase in engagement from non-followers bringing in a largely new audience.",
      "Added 219 new fans to the community, with growth driven predominantly by new audiences discovering the brand.",
    ],
    quote:
      "Michelle is incredibly hands-on and creative. She understood my vision quickly and consistently delivered visuals that brought it to life.",
    attribution: "Yasmeen - Founder, Mya Art Workshop",
    heroImage: {
      src: "/assets/works/case-study/mya-hero.jpg",
      alt: "Sunlit art studio with wooden easels, colorful abstract paintings, and an ART wood cutout",
    },
    galleryImages: [
      {
        src: "/assets/works/case-study/mya-gallery-01.jpg",
        alt: "Hands wiping a teal paintbrush on denim fabric beside a warm-toned painting",
      },
      {
        src: "/assets/works/case-study/mya-gallery-02.jpg",
        alt: "Coastal beach scene with a yellow hey! text overlay",
      },
      {
        src: "/assets/works/case-study/mya-gallery-03.jpg",
        alt: "Workshop attendee in orange headscarf holding a framed mosaic heart artwork",
      },
      {
        src: "/assets/works/case-study/mya-gallery-04.jpg",
        alt: "Yellow cup of paintbrushes beside a pink book and painted wooden palette",
      },
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
