import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

import {
  migrateLegacyArticleContentToBlocks,
  seedJournalArticleBlocks,
} from "./lib/migrateJournalArticleBlocks";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "journal_posts" ADD COLUMN IF NOT EXISTS "article_blocks" jsonb;
    ALTER TABLE "_journal_posts_v" ADD COLUMN IF NOT EXISTS "version_article_blocks" jsonb;
  `);

  await migrateLegacyArticleContentToBlocks({ payload, req });
  await seedJournalArticleBlocks({ payload, req });
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "journal_posts" DROP COLUMN IF EXISTS "article_blocks";
    ALTER TABLE "_journal_posts_v" DROP COLUMN IF EXISTS "version_article_blocks";
  `);
}
