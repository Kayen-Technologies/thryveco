import { getHomePage } from "@/lib/payload";

export default async function HomePage() {
  const page = await getHomePage();

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="bg-primary-section container-x section-y"
        style={{ minHeight: "85vh", display: "flex", alignItems: "center" }}
      >
        <div style={{ maxWidth: "800px" }}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-display)",
              fontWeight: 500,
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            {page?.hero?.headline ?? "Your Brand's New Creative Friend"}
          </h1>
          {page?.hero?.tagline && (
            <p style={{ fontSize: "var(--text-lead)", opacity: 0.85, marginBottom: "2.5rem" }}>
              {page.hero.tagline}
            </p>
          )}
          {page?.hero?.ctaLabel && (
            <a
              href={page.hero.ctaHref ?? "/contact"}
              style={{
                display: "inline-block",
                background: "var(--color-accent)",
                color: "var(--color-text)",
                padding: "1rem 2.5rem",
                borderRadius: "var(--radius-pill)",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: "var(--text-sm)",
                letterSpacing: "var(--tracking-caps)",
                textTransform: "uppercase",
              }}
            >
              {page.hero.ctaLabel}
            </a>
          )}
        </div>
      </section>

      {/* Additional sections will be built as components */}
      {/* TODO: IntroSection, MarqueeStrip, StorySection, FeaturedWork, QuoteBand, Testimonials, FinalCTA */}
    </main>
  );
}
