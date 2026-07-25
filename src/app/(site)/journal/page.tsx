import type { Metadata } from "next";
import { getJournalPage, getJournalPosts } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Journal",
  description: "Thoughts, perspective & a little creative obsession.",
};

export default async function JournalPage() {
  const [page, { docs: posts }] = await Promise.all([
    getJournalPage(),
    getJournalPosts(),
  ]);

  return (
    <main>
      <section className="bg-cream-section container-x section-y">
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-h1)",
            fontWeight: 500,
            maxWidth: "700px",
          }}
        >
          {page?.hero?.headline ?? "Thoughts, perspective & a little creative obsession."}
        </h1>
      </section>

      {posts.length > 0 && (
        <section className="container-x" style={{ paddingBlock: "var(--spacing-section-gap)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--spacing-gap-md)",
            }}
          >
            {posts.map((post) => (
              <a
                key={post.id}
                href={`/journal/${post.slug}`}
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
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", fontWeight: 600 }}>
                    {post.category}
                  </span>
                  {post.readTime && (
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                      {post.readTime} min read
                    </span>
                  )}
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h3)", fontWeight: 500, marginBottom: "0.75rem" }}>
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
                    {post.excerpt}
                  </p>
                )}
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
