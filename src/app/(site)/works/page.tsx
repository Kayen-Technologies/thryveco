import type { Metadata } from "next";
import { getWorksPage, getWorks } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Works",
  description: "Brands we've built.",
};

export default async function WorksPage() {
  const [page, { docs: works }] = await Promise.all([getWorksPage(), getWorks()]);

  return (
    <main>
      <section className="bg-cream-section container-x section-y">
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-h1)",
            fontWeight: 500,
            marginBottom: "1rem",
            maxWidth: "700px",
          }}
        >
          {page?.hero?.headline ?? "Good brands are built. Great brands are Thryved."}
        </h1>
      </section>

      {works.length > 0 && (
        <section className="container-x" style={{ paddingBlock: "var(--spacing-section-gap)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--spacing-gap-md)",
            }}
          >
            {works.map((work) => (
              <a
                key={work.id}
                href={`/works/${work.slug}`}
                style={{
                  display: "block",
                  background: "var(--color-bg-surface)",
                  borderRadius: "var(--radius-card)",
                  padding: "2rem",
                  textDecoration: "none",
                  color: "var(--color-text)",
                  border: "1px solid #e2d9c9",
                }}
              >
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)" }}>
                  {work.client}
                </p>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h3)", fontWeight: 500 }}>
                  {work.title}
                </h2>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* TODO: CTA section */}
    </main>
  );
}
