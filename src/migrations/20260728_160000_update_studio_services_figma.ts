import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import { linkStudioPageContent, seedAllStudioMedia } from "./lib/seedStudioPageMedia";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const mediaByFilename = await seedAllStudioMedia({ payload, req });
  await linkStudioPageContent({ payload, req, mediaByFilename });
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: keep updated studio services content in place.
}
