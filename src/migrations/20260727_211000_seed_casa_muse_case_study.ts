import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

import {
  clearCaseStudyContent,
  seedCaseStudyContent,
} from "./lib/seedCaseStudyContent";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await seedCaseStudyContent({ payload, req });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await clearCaseStudyContent({ payload, req });
}
