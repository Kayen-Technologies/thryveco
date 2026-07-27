import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

/**
 * work-03.jpg is the AURE Fine Jewellery photo (diamond bracelets on dark wood).
 * The initial seed incorrectly labelled this slot as "MELO Cafe".
 * This migration corrects the slug, title, client, tagline, and tags to match
 * the Figma design at node 78:100.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: "melo-cafe" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length === 0) return;

  await payload.update({
    collection: "works",
    id: (existing.docs[0] as { id: number }).id,
    data: {
      slug: "aure",
      title: "Aure",
      client: "Aure",
      tagline: "Fine Jewellery",
      tags: [
        { tag: "Brand Positioning" },
        { tag: "Content Strategy" },
        { tag: "Digital Marketing" },
        { tag: "Photography" },
      ],
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: "aure" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });

  if (existing.docs.length === 0) return;

  await payload.update({
    collection: "works",
    id: (existing.docs[0] as { id: number }).id,
    data: {
      slug: "melo-cafe",
      title: "MELO Cafe",
      client: "MELO Cafe",
      tagline: "Cafe",
      tags: [
        { tag: "Brand Identity" },
        { tag: "Photography" },
        { tag: "Content Strategy" },
        { tag: "Social Media" },
      ],
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}
