import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

/**
 * work-04.jpg is the LUNE Luxury Fragrance photo (woman with perfume bottle, dark amber bg).
 * The initial seed incorrectly labelled this slot as "VERA Bridal".
 * This migration corrects the slug, title, client, tagline, and tags to match
 * the Figma design at node 78:109.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const existing = await payload.find({
    collection: "works",
    where: { slug: { equals: "vera-bridal" } },
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
      slug: "lune",
      title: "Lune",
      client: "Lune",
      tagline: "Luxury Fragrance",
      tags: [
        { tag: "Creative Direction" },
        { tag: "Photography" },
        { tag: "Social Media" },
        { tag: "Content Strategy" },
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
    where: { slug: { equals: "lune" } },
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
      slug: "vera-bridal",
      title: "VERA Bridal",
      client: "VERA Bridal",
      tagline: "Bridal Fashion",
      tags: [
        { tag: "Brand Identity" },
        { tag: "Creative Direction" },
        { tag: "Social Media" },
        { tag: "Campaign Creative" },
      ],
      _status: "published",
    },
    draft: false,
    overrideAccess: true,
    req,
    depth: 0,
  });
}
