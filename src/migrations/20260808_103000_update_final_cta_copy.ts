import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/** Figma node 488:1499 — redesigned final CTA copy, shared by home, about and studio. */
const HEADLINE = "Your Next Brand Move Starts Here.";
const SUBTEXT =
  "Your brand deserves more than content that fills a feed. Let’s build a strategy, presence, and visual identity people actually remember.";
const CTA_LABEL = "Book My Discovery Call";

const PREVIOUS_HEADLINE = "Ready to build a brand people remember?";
const PREVIOUS_SUBTEXT = "Beautiful brands start here";
const PREVIOUS_CTA_LABEL = "Book A Discovery Call";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page"
    SET
      "final_cta_headline" = ${HEADLINE},
      "final_cta_subtext" = ${SUBTEXT},
      "final_cta_cta_label" = ${CTA_LABEL}
  `);

  await db.execute(sql`
    UPDATE "about_page"
    SET
      "cta_headline" = ${HEADLINE},
      "cta_subtext" = ${SUBTEXT},
      "cta_cta_label" = ${CTA_LABEL}
  `);

  await db.execute(sql`
    UPDATE "studio_page"
    SET
      "cta_headline" = ${HEADLINE},
      "cta_subtext" = ${SUBTEXT},
      "cta_cta_label" = ${CTA_LABEL}
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page"
    SET
      "final_cta_headline" = ${PREVIOUS_HEADLINE},
      "final_cta_subtext" = ${PREVIOUS_SUBTEXT},
      "final_cta_cta_label" = ${PREVIOUS_CTA_LABEL}
  `);

  await db.execute(sql`
    UPDATE "about_page"
    SET
      "cta_headline" = ${PREVIOUS_HEADLINE},
      "cta_subtext" = ${PREVIOUS_SUBTEXT},
      "cta_cta_label" = ${PREVIOUS_CTA_LABEL}
  `);

  await db.execute(sql`
    UPDATE "studio_page"
    SET
      "cta_headline" = ${PREVIOUS_HEADLINE},
      "cta_subtext" = ${PREVIOUS_SUBTEXT},
      "cta_cta_label" = ${PREVIOUS_CTA_LABEL}
  `);
}
