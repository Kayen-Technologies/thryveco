import { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import {
  linkJournalPageContent,
  seedAllJournalMedia,
} from "./lib/seedJournalPageMedia";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const mediaByFilename = await seedAllJournalMedia({ payload, req });
  await linkJournalPageContent({ payload, req, mediaByFilename });
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // No-op: content refresh only.
}
