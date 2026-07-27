import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { linkHomepageMedia, seedAllHomepageMedia } from "./lib/seedHomepageMedia";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const mediaByFilename = await seedAllHomepageMedia({ payload, req });
  await linkHomepageMedia({ payload, req, mediaByFilename });
}

export async function down(): Promise<void> {
  // Relink migration is superseded by 20260726_120000_homepage_image_fields down.
}
