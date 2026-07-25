import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RichText from "@/components/RichText";
import { getJournalPost, getJournalPosts } from "@/lib/payload";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { docs } = await getJournalPosts();
  return docs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getJournalPost(slug);

  if (!post) notFound();

  return (
    <main>
      <article className="container-x" style={{ maxWidth: "780px", margin: "0 auto", paddingBlock: "var(--spacing-section-y)" }}>
        {/* Back nav */}
        <a
          href="/journal"
          style={{
            display: "inline-block",
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            textDecoration: "none",
            marginBottom: "3rem",
          }}
        >
          ← Back to Journal
        </a>

        {/* Meta pills */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "var(--tracking-caps)", fontWeight: 600 }}>
            {post.category}
          </span>
          {post.readTime && (
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
              {post.readTime} min read
            </span>
          )}
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
            {post.author}
          </span>
        </div>

        <h1
          className="font-heading mb-12 text-[var(--text-h1)] leading-tight"
        >
          {post.title}
        </h1>

        <RichText content={post.body} />

        {/* Closing CTA */}
        <div
          style={{
            marginTop: "5rem",
            paddingTop: "3rem",
            borderTop: "1px solid #e2d9c9",
          }}
        >
          <p style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-h3)", fontWeight: 500, marginBottom: "1rem" }}>
            Ready to build something great?
          </p>
          <a
            href="/contact"
            style={{
              display: "inline-block",
              background: "var(--color-primary)",
              color: "var(--color-text-on-dark)",
              padding: "0.875rem 2rem",
              borderRadius: "var(--radius-pill)",
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "var(--text-sm)",
            }}
          >
            Book a Call
          </a>
        </div>
      </article>
    </main>
  );
}
