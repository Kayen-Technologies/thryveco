import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { STUDIO_DEFAULTS } from "@/components/studio/defaults";
import { upsertStudioMedia } from "./lib/seedStudioPageMedia";

/**
 * Refresh Studio hero image from Figma 165:83 and align tagline punctuation.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const mediaId = await upsertStudioMedia({
    payload,
    req,
    seed: {
      filename: "studio-hero.jpg",
      alt: STUDIO_DEFAULTS.hero.image.alt,
      caption: "Figma studio hero 165:83",
    },
  });

  const page = await payload.findGlobal({
    slug: "studio-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const hero = (page as { hero?: Record<string, unknown> | null }).hero ?? {};

  await payload.updateGlobal({
    slug: "studio-page",
    data: {
      hero: {
        ...hero,
        headline: STUDIO_DEFAULTS.hero.headline,
        tagline: STUDIO_DEFAULTS.hero.tagline,
        image: mediaId,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Asset/copy refresh — no destructive rollback.
}
