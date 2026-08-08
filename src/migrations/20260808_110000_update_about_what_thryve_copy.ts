import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/** Figma node 165:48 — "What Thryve Means" copy, verbatim including typographic apostrophes. */
const INTRO =
  "Thriving isn’t passive. It’s putting yourself out there, taking up space, and doing it on your own terms. And the & Co.? That’s the part that says we’re always doing more. More than just thriving. More ideas, more possibilities, more of what your brand deserves.";
const AGENCY_COPY =
  "We call ourselves a Creative Agency because that’s exactly what we are. A team of people whose job is to make your brand impossible to ignore. A creative partner with a point of view, in your corner, invested in what you’re building.";
const ASPIRATION_COPY =
  "We aspire to be the agency that changes how lifestyle, wellness and product brands show up. The name people mention when they talk about brands that look different. The agency behind the brands you can’t stop watching.";

const PREVIOUS_INTRO =
  "Thriving isn't passive. It's putting yourself out there, taking up space, and doing it on your own terms. And the & Co.? That's the part that says we're always doing more. More than just thriving. More ideas, more possibilities, more of what your brand deserves.";
const PREVIOUS_AGENCY_COPY =
  "We call ourselves a Creative Agency because that's exactly what we are a team of people whose job is to make your brand impossible to ignore. A creative partner with a point of view, in your corner, invested in what you're building.";
const PREVIOUS_ASPIRATION_COPY =
  "We aspire to be the agency that changes how lifestyle and product brands show up the name people mention when they talk about brands that look different. The agency behind the brands you can't stop watching.";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "about_page"
    SET
      "what_thryve_intro" = ${INTRO},
      "what_thryve_agency_copy" = ${AGENCY_COPY},
      "what_thryve_aspiration_copy" = ${ASPIRATION_COPY}
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "about_page"
    SET
      "what_thryve_intro" = ${PREVIOUS_INTRO},
      "what_thryve_agency_copy" = ${PREVIOUS_AGENCY_COPY},
      "what_thryve_aspiration_copy" = ${PREVIOUS_ASPIRATION_COPY}
  `);
}
