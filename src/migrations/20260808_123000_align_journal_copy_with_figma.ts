import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Figma node 439:1043 — journal listing copy, verbatim.
 * Posts go through the Local API because `journalPosts` has drafts enabled and
 * raw SQL would leave the `_journal_posts_v` rows stale.
 */
const HERO_TAGLINE =
  "We write about the things we care about aesthetics, strategy, social media, and everything happening in the creative world around us. Pull up a seat.";
const PREVIOUS_HERO_TAGLINE =
  "We write about the things we care about: aesthetics, strategy, social media, and everything happening in the creative world around us. Pull up a seat.";

const EXCERPTS: Record<string, { next: string; previous: string }> = {
  "accra-creative-scene-having-a-moment": {
    next: "Something is shifting in Accra. The brands are bolder, the creatives are louder, and the work is undeniably world class. We've got front row seats and we wouldn't have it any other way.",
    previous:
      "Something is shifting in Accra. The brands are bolder, the creatives are louder, and the work is undeniably world class. We've got front row seats — and we wouldn't have it any other way.",
  },
  "why-the-best-brands-never-leave-creativity-to-chance": {
    next: "Creative direction is more than making things look good. It’s about creating a consistent visual language that shapes how people recognize, remember, and connect with your brand.",
    previous:
      "Creative direction is more than making things look good. It's about creating a consistent visual language that shapes how people recognize, remember, and connect with your brand.",
  },
};

async function applyExcerpts(
  { payload, req }: Pick<MigrateUpArgs, "payload" | "req">,
  key: "next" | "previous",
): Promise<void> {
  for (const [slug, excerpt] of Object.entries(EXCERPTS)) {
    const existing = await payload.find({
      collection: "journal-posts",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    });

    const doc = existing.docs[0] as { id: number } | undefined;
    if (!doc) continue;

    await payload.update({
      collection: "journal-posts",
      id: doc.id,
      data: { excerpt: excerpt[key], _status: "published" },
      draft: false,
      overrideAccess: true,
      req,
      depth: 0,
    });
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "journal_page"
    SET "hero_tagline" = ${HERO_TAGLINE}
  `);

  await applyExcerpts({ payload, req }, "next");
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "journal_page"
    SET "hero_tagline" = ${PREVIOUS_HERO_TAGLINE}
  `);

  await applyExcerpts({ payload, req }, "previous");
}
