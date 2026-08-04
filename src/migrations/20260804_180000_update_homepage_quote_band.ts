import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/** Figma node 78:118 — homepage quote band. Raw SQL avoids Local API maxRows validation. */
const QUOTE = "Growth should look as good as it performs.";
const ATTRIBUTION = "Thryve & Co Creative Agency";

const PREVIOUS_QUOTE =
  "Beautiful brands aren't an accident. They're built, on purpose, one detail at a time.";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page"
    SET
      "quote_band_quote" = ${QUOTE},
      "quote_band_attribution" = ${ATTRIBUTION}
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "home_page"
    SET
      "quote_band_quote" = ${PREVIOUS_QUOTE},
      "quote_band_attribution" = ${ATTRIBUTION}
  `);
}
