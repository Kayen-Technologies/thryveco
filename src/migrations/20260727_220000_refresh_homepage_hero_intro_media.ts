import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import {
  linkHomepageMedia,
  upsertHomepageMedia,
} from "./lib/seedHomepageMedia";

const REFRESH_MEDIA = [
  {
    filename: "hero.jpg",
    alt: "Thryve & Co home hero background",
    caption: "Figma homepage hero",
  },
  {
    filename: "intro-portrait.jpg",
    alt: "Thryve & Co intro portrait",
    caption: "Figma homepage intro portrait",
  },
] as const;

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const mediaByFilename = new Map<string, number>();

  for (const seed of REFRESH_MEDIA) {
    mediaByFilename.set(
      seed.filename,
      await upsertHomepageMedia({ payload, req, seed }),
    );
  }

  await linkHomepageMedia({ payload, req, mediaByFilename });
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No rollback — media refresh is idempotent.
}
