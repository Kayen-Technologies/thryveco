import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import { sql } from "@payloadcms/db-postgres";

/** Figma node 162:209 — founder story copy. Adds the missing colon and corrects the years. */
const PARAGRAPH_ONE =
  "Before Thryve, Michelle was a digital creator learning the language of content, aesthetics and storytelling one post at a time. She had an eye for what looked good and an instinct for what felt right. That combination led her into social media management, where she discovered something she hadn't expected: a love for strategy. For the thinking behind the making. For the way a well-built brand presence could change how a business was perceived overnight.";
const PARAGRAPH_TWO =
  "Five years, multiple clients, and countless content pieces later, it became clear that what she was building wasn't just a freelance career. It was something bigger. Something with a name, a vision, and a standard.";

const PREVIOUS_PARAGRAPH_ONE =
  "Before Thryve, Michelle was a digital creator learning the language of content, aesthetics and storytelling one post at a time. She had an eye for what looked good and an instinct for what felt right. That combination led her into social media management, where she discovered something she hadn't expected a love for strategy. For the thinking behind the making. For the way a well-built brand presence could change how a business was perceived overnight.";
const PREVIOUS_PARAGRAPH_TWO =
  "Two years, multiple clients, and countless content pieces later, it became clear that what she was building wasn't just a freelance career. It was something bigger. Something with a name, a vision, and a standard.";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "about_page"
    SET
      "founder_story_paragraph_one" = ${PARAGRAPH_ONE},
      "founder_story_paragraph_two" = ${PARAGRAPH_TWO}
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "about_page"
    SET
      "founder_story_paragraph_one" = ${PREVIOUS_PARAGRAPH_ONE},
      "founder_story_paragraph_two" = ${PREVIOUS_PARAGRAPH_TWO}
  `);
}
