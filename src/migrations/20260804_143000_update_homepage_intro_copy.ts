import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/**
 * Figma node 47:75 — homepage intro copy.
 *
 * Must use raw SQL — not Payload Local API. This migration runs *before*
 * `20260804_150000_homepage_marquee_items` adds `home_page_marquee_words.image_id`.
 * `findGlobal` / `updateGlobal` always SELECT against the *current* schema, which
 * already expects `image_id`, so Local API blows up on production mid-chain.
 */

const INTRO_HEADLINE = "Growth should look as good as it performs.";
const INTRO_CTA_LABEL = "Book a Discovery Call";
const INTRO_CTA_HREF = "/contact";

const INTRO_BODY_FIGMA = [
  "We're a creative agency for brands that refuse to blend in. Aesthetic-forward, strategy-driven, and built for brands that want both.",
  "We help ambitious brands build an online presence that feels as intentional as the products and experiences they create. By blending strategy, creative direction, content creation and social media management, we shape brands that are memorable, culturally relevant and impossible to overlook.",
].join("\n\n");

const INTRO_BODY_PREVIOUS = [
  "We're a creative agency for brands that refuse to blend in — aesthetic-forward, strategy-driven, and built for brands that want both.",
  "We help ambitious brands build an online presence that feels as intentional as the products and experiences they create. By blending strategy, creative direction, content creation and social media management, we shape brands that are memorable, culturally relevant and impossible to overlook.",
].join("\n\n");

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page"
    SET
      "intro_headline" = ${INTRO_HEADLINE},
      "intro_body" = ${INTRO_BODY_FIGMA},
      "intro_cta_label" = ${INTRO_CTA_LABEL},
      "intro_cta_href" = ${INTRO_CTA_HREF}
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page"
    SET
      "intro_headline" = ${INTRO_HEADLINE},
      "intro_body" = ${INTRO_BODY_PREVIOUS},
      "intro_cta_label" = ${INTRO_CTA_LABEL},
      "intro_cta_href" = ${INTRO_CTA_HREF}
  `);
}
