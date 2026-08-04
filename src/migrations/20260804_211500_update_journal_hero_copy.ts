import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { JOURNAL_DEFAULTS } from "@/components/journal/defaults";

/** Figma node 170:47 — journal hero tagline colon after "care about". */
const PREVIOUS_TAGLINE =
  "We write about the things we care about aesthetics, strategy, social media, and everything happening in the creative world around us. Pull up a seat.";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const page = await payload.findGlobal({
    slug: "journal-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const hero = (page as { hero?: Record<string, unknown> | null }).hero ?? {};

  await payload.updateGlobal({
    slug: "journal-page",
    data: {
      hero: {
        ...hero,
        headline: JOURNAL_DEFAULTS.hero.headline,
        tagline: JOURNAL_DEFAULTS.hero.tagline,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const page = await payload.findGlobal({
    slug: "journal-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const hero = (page as { hero?: Record<string, unknown> | null }).hero ?? {};

  await payload.updateGlobal({
    slug: "journal-page",
    data: {
      hero: {
        ...hero,
        headline: JOURNAL_DEFAULTS.hero.headline,
        tagline: PREVIOUS_TAGLINE,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}
