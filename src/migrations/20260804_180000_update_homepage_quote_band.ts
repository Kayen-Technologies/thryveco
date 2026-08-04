import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

/** Figma node 78:118 — homepage quote band. */
const QUOTE = "Growth should look as good as it performs.";
const ATTRIBUTION = "Thryve & Co Creative Agency";

const PREVIOUS_QUOTE =
  "Beautiful brands aren't an accident. They're built, on purpose, one detail at a time.";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "home-page",
    data: {
      quoteBand: {
        quote: QUOTE,
        attribution: ATTRIBUTION,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  await payload.updateGlobal({
    slug: "home-page",
    data: {
      quoteBand: {
        quote: PREVIOUS_QUOTE,
        attribution: ATTRIBUTION,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}
