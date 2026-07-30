import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { upsertStudioMedia } from "./lib/seedStudioPageMedia";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await upsertStudioMedia({
    payload,
    req,
    seed: {
      filename: "studio-hero.jpg",
      alt: "Creative studio hands holding camera and tablet",
      caption: "Figma studio hero",
    },
  });
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: keep refreshed media in place.
}
