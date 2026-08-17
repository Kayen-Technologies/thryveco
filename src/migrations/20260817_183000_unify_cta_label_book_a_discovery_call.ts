import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/** Unify every booking CTA label to "Book a Discovery Call". */
const CTA_LABEL = "Book a Discovery Call";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page"
    SET
      "hero_cta_label" = ${CTA_LABEL},
      "intro_cta_label" = ${CTA_LABEL},
      "final_cta_cta_label" = ${CTA_LABEL}
  `);

  await db.execute(sql`
    UPDATE "about_page"
    SET "cta_cta_label" = ${CTA_LABEL}
  `);

  await db.execute(sql`
    UPDATE "works_page"
    SET "cta_cta_label" = ${CTA_LABEL}
  `);

  await db.execute(sql`
    UPDATE "studio_page"
    SET "cta_cta_label" = ${CTA_LABEL}
  `);

  await db.execute(sql`
    UPDATE "studio_page_services"
    SET "cta_label" = ${CTA_LABEL}
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page"
    SET
      "hero_cta_label" = 'Book a Call',
      "intro_cta_label" = 'Book a Discovery Call',
      "final_cta_cta_label" = 'Book My Discovery Call'
  `);

  await db.execute(sql`
    UPDATE "about_page"
    SET "cta_cta_label" = 'Book My Discovery Call'
  `);

  await db.execute(sql`
    UPDATE "works_page"
    SET "cta_cta_label" = 'Book My Discovery Call'
  `);

  await db.execute(sql`
    UPDATE "studio_page"
    SET "cta_cta_label" = 'Book My Discovery Call'
  `);

  await db.execute(sql`
    UPDATE "studio_page_services"
    SET "cta_label" = 'Book a Discovery Call'
  `);
}
