import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres/drizzle";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "works_page"
    ADD COLUMN IF NOT EXISTS "hero_subheadline" varchar,
    ADD COLUMN IF NOT EXISTS "hero_hero_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS "portfolio_title" varchar,
    ADD COLUMN IF NOT EXISTS "cta_top_line" varchar,
    ADD COLUMN IF NOT EXISTS "cta_top_line_accent" varchar,
    ADD COLUMN IF NOT EXISTS "cta_bottom_line" varchar,
    ADD COLUMN IF NOT EXISTS "cta_bottom_line_accent" varchar,
    ADD COLUMN IF NOT EXISTS "cta_background_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL;
  `);

  await db.execute(sql`
    ALTER TABLE "works"
    ADD COLUMN IF NOT EXISTS "industry" varchar;
  `);

  await db.execute(sql`
    ALTER TABLE "_works_v"
    ADD COLUMN IF NOT EXISTS "version_industry" varchar;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "works_page"
    DROP COLUMN IF EXISTS "hero_subheadline",
    DROP COLUMN IF EXISTS "hero_hero_image_id",
    DROP COLUMN IF EXISTS "portfolio_title",
    DROP COLUMN IF EXISTS "cta_top_line",
    DROP COLUMN IF EXISTS "cta_top_line_accent",
    DROP COLUMN IF EXISTS "cta_bottom_line",
    DROP COLUMN IF EXISTS "cta_bottom_line_accent",
    DROP COLUMN IF EXISTS "cta_background_image_id";
  `);

  await db.execute(sql`
    ALTER TABLE "works"
    DROP COLUMN IF EXISTS "industry";
  `);

  await db.execute(sql`
    ALTER TABLE "_works_v"
    DROP COLUMN IF EXISTS "version_industry";
  `);
}
