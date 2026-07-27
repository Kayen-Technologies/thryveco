import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

type SeedWork = {
  slug: string;
  title: string;
  client: string;
  tagline: string;
  tags: string[];
  sortOrder: number;
};

const SEEDED_WORKS: SeedWork[] = [
  {
    slug: "casa-muse",
    title: "Casa Muse",
    client: "Casa muse",
    tagline: "Interior Design Studio",
    tags: ["Brand Identity", "Content Strategy", "Digital Marketing", "Photography"],
    sortOrder: 1,
  },
  {
    slug: "sole",
    title: "SOLE",
    client: "SOLE",
    tagline: "Skincare",
    tags: ["Brand Identity", "Product Photography", "Social Media", "Campaign Creative"],
    sortOrder: 2,
  },
  {
    slug: "melo-cafe",
    title: "MELO Cafe",
    client: "MELO Cafe",
    tagline: "Cafe",
    tags: ["Brand Identity", "Photography", "Content Strategy", "Social Media"],
    sortOrder: 3,
  },
  {
    slug: "vera-bridal",
    title: "VERA Bridal",
    client: "VERA Bridal",
    tagline: "Bridal Fashion",
    tags: ["Brand Identity", "Creative Direction", "Social Media", "Campaign Creative"],
    sortOrder: 4,
  },
];

type WorkDoc = { id: number };

async function upsertWork({
  payload,
  req,
  work,
}: {
  payload: MigrateUpArgs["payload"];
  req: MigrateUpArgs["req"];
  work: SeedWork;
}): Promise<number> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: work.slug } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  const data = {
    title: work.title,
    slug: work.slug,
    client: work.client,
    tagline: work.tagline,
    tags: work.tags.map((tag) => ({ tag })),
    sortOrder: work.sortOrder,
    publishedAt: new Date().toISOString(),
    _status: "published" as const,
  };

  if (existing.docs.length > 0) {
    const updated = await payload.update({
      collection: "works",
      id: (existing.docs[0] as WorkDoc).id,
      data,
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });
    return (updated as WorkDoc).id;
  }

  const created = await payload.create({
    collection: "works",
    data,
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
  return (created as WorkDoc).id;
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const workIDs: number[] = [];

  for (const work of SEEDED_WORKS) {
    workIDs.push(await upsertWork({ payload, req, work }));
  }

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      hero: {
        headline: "Your Brand's New Creative Friend",
        headlineEmphasis: "Creative Friend",
        tagline: "",
        ctaLabel: "Book a Call",
        ctaHref: "/contact",
      },
      intro: {
        headline: "Growth should look as good as it performs.",
        body: [
          "We're a creative agency for brands that refuse to blend in — aesthetic-forward, strategy-driven, and built for brands that want both.",
          "We help ambitious brands build an online presence that feels as intentional as the products and experiences they create. By blending strategy, creative direction, content creation and social media management, we shape brands that are memorable, culturally relevant and impossible to overlook.",
        ].join("\n\n"),
        ctaLabel: "Book a Discovery Call",
        ctaHref: "/contact",
      },
      marqueeWords: [
        { word: "Cultured" },
        { word: "Intentional" },
        { word: "Creative" },
        { word: "Bold" },
      ],
      story: {
        headline: "Every brand has a story. We make sure it’s one worth remembering.",
        body: "From strategy and content creation to full-scale campaigns, every project is thoughtfully crafted to help brands show up with confidence, clarity and unmistakable presence.",
      },
      featuredWork: {
        headline: "Every brand has a story. We make sure it’s one worth remembering.",
        works: workIDs,
      },
      quoteBand: {
        quote: "Growth should look as good as it performs.",
        attribution: "Thryve & Co Creative Agency",
      },
      testimonials: [
        {
          name: "Dianne Russell",
          role: "Founder, SOLE Skincare",
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
          role: "Founder, MELO Cafe",
          quote:
            "What stands out most is the consistency. Week after week, they create content that feels fresher, calmer, and beautifully cared for.",
        },
        {
          name: "Leslie Alexander",
          role: "Founder, ELAN Lifestyle",
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
      finalCta: {
        headline: "Ready to build a brand people remember?",
        subtext: "Beautiful brands start here",
        ctaLabel: "Book A Discovery Call",
        ctaHref: "/contact",
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  for (const work of SEEDED_WORKS) {
    const existing = await payload.find({
      collection: "works",
      where: { slug: { equals: work.slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    if (existing.docs.length === 0) continue;

    const doc = existing.docs[0] as { id: number; title?: string | null; client?: string | null };
    const titleMatches = doc.title?.toLowerCase() === work.title.toLowerCase();
    const clientMatches = doc.client?.toLowerCase() === work.client.toLowerCase();

    if (titleMatches && clientMatches) {
      await payload.delete({
        collection: "works",
        id: doc.id,
        overrideAccess: true,
        req,
      });
    }
  }

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      featuredWork: {
        works: [],
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

