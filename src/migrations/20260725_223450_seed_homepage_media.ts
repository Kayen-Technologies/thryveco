import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import {
  clearHomepageMediaLinks,
  linkHomepageMedia,
  seedAllHomepageMedia,
} from "./lib/seedHomepageMedia";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const mediaByFilename = await seedAllHomepageMedia({ payload, req });
  await linkHomepageMedia({ payload, req, mediaByFilename });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await clearHomepageMediaLinks({ payload, req });
}
