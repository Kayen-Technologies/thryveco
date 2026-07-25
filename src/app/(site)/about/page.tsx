import type { Metadata } from "next";
import { getAboutPage } from "@/lib/payload";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the founder of Thryve Co.",
};

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <main>
      <section className="bg-cream-section container-x section-y">
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-h1)",
            fontWeight: 500,
          }}
        >
          {page?.hero?.headline ?? "About Thryve Co."}
        </h1>
        {page?.hero?.tagline && (
          <p style={{ fontSize: "var(--text-lead)", color: "var(--color-text-muted)", marginTop: "1rem" }}>
            {page.hero.tagline}
          </p>
        )}
      </section>

      {/* Founder section */}
      {page?.founderSection?.name && (
        <section className="bg-surface-section container-x" style={{ paddingBlock: "var(--spacing-section-gap)" }}>
          <p style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", color: "var(--color-primary)", fontWeight: 600, marginBottom: "1rem" }}>
            {page.founderSection.headline ?? "Meet the Founder"}
          </p>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h2)", fontWeight: 500, marginBottom: "0.5rem" }}>
            {page.founderSection.name}
          </h2>
          {page.founderSection.title && (
            <p style={{ color: "var(--color-text-muted)" }}>{page.founderSection.title}</p>
          )}
        </section>
      )}

      {/* Founder quote */}
      {page?.founderQuote?.quote && (
        <section
          className="bg-primary-section container-x"
          style={{ paddingBlock: "var(--spacing-section-gap)" }}
        >
          <blockquote
            style={{
              fontFamily: "var(--font-decorative)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.4,
              color: "var(--color-accent)",
              maxWidth: "800px",
              margin: "0",
            }}
          >
            {page.founderQuote.quote}
          </blockquote>
          {page.founderQuote.attribution && (
            <cite
              style={{
                display: "block",
                marginTop: "1.5rem",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-on-dark)",
                opacity: 0.7,
                fontStyle: "normal",
              }}
            >
              — {page.founderQuote.attribution}
            </cite>
          )}
        </section>
      )}

      {/* TODO: founderStory, whatThryve, CTA */}
    </main>
  );
}
