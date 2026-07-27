import { MigrateDownArgs, MigrateUpArgs, sql } from "@payloadcms/db-postgres";

import {
  seedJournalArticleContent,
  clearJournalArticleContent,
} from "./lib/seedJournalArticleContent";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "journal_posts" ADD COLUMN IF NOT EXISTS "deck" varchar;
    ALTER TABLE "journal_posts" ADD COLUMN IF NOT EXISTS "article_content" jsonb;
    ALTER TABLE "_journal_posts_v" ADD COLUMN IF NOT EXISTS "version_deck" varchar;
    ALTER TABLE "_journal_posts_v" ADD COLUMN IF NOT EXISTS "version_article_content" jsonb;
  `);

  await seedJournalArticleContent({ payload, req });
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await clearJournalArticleContent({ payload, req });

  await db.execute(sql`
    ALTER TABLE "journal_posts" DROP COLUMN IF EXISTS "deck";
    ALTER TABLE "journal_posts" DROP COLUMN IF EXISTS "article_content";
    ALTER TABLE "_journal_posts_v" DROP COLUMN IF EXISTS "version_deck";
    ALTER TABLE "_journal_posts_v" DROP COLUMN IF EXISTS "version_article_content";
  `);
}
