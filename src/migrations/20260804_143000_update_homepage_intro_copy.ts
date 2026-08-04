import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";

/** Figma node 47:75 — homepage intro section copy. */
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

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const current = await payload.findGlobal({
    slug: "home-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const intro = (current as { intro?: Record<string, unknown> }).intro ?? {};

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      intro: {
        ...intro,
        headline: INTRO_HEADLINE,
        body: INTRO_BODY_FIGMA,
        ctaLabel: INTRO_CTA_LABEL,
        ctaHref: INTRO_CTA_HREF,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  const current = await payload.findGlobal({
    slug: "home-page",
    depth: 0,
    overrideAccess: true,
    req,
  });

  const intro = (current as { intro?: Record<string, unknown> }).intro ?? {};

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      intro: {
        ...intro,
        headline: INTRO_HEADLINE,
        body: INTRO_BODY_PREVIOUS,
        ctaLabel: INTRO_CTA_LABEL,
        ctaHref: INTRO_CTA_HREF,
      },
    },
    overrideAccess: true,
    req,
    depth: 0,
  });
}
