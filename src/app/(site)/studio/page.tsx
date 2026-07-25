import type { Metadata } from "next";
import { getStudioPage } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Studio",
  description: "Our four core creative services.",
};

export default async function StudioPage() {
  const page = await getStudioPage();

  return (
    <main>
      <section className="bg-cream-section container-x section-y">
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-h1)",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
        >
          {page?.hero?.headline ?? "The Studio"}
        </h1>
        {page?.hero?.tagline && (
          <p style={{ fontSize: "var(--text-lead)", color: "var(--color-text-muted)" }}>
            {page.hero.tagline}
          </p>
        )}
      </section>

      {/* TODO: Services cards, How It Works, CTA */}
    </main>
  );
}
