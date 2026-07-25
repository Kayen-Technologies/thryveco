import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RichText from "@/components/RichText";
import { getWork, getWorks } from "@/lib/payload";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { docs } = await getWorks();
  return docs.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) return {};
  return {
    title: work.title,
    description: work.tagline ?? `Case study — ${work.client}`,
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = await getWork(slug);

  if (!work) notFound();

  return (
    <main>
      <section className="bg-cream-section container-x section-y">
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-caps)",
            marginBottom: "1rem",
          }}
        >
          {work.client}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "var(--text-h1)",
            fontWeight: 500,
            marginBottom: "1rem",
          }}
        >
          {work.title}
        </h1>
        {work.tagline && (
          <p style={{ fontSize: "var(--text-lead)", color: "var(--color-text-muted)" }}>
            {work.tagline}
          </p>
        )}
      </section>

      {work.overview && (
        <section className="container-x py-16">
          <RichText content={work.overview} />
        </section>
      )}

      {work.problem && (
        <section className="bg-surface-section container-x py-16">
          <h2 className="font-heading mb-6 text-[var(--text-h2)]">The Problem</h2>
          <RichText content={work.problem} />
        </section>
      )}

      {work.solution && (
        <section className="container-x py-16">
          <h2 className="font-heading mb-6 text-[var(--text-h2)]">The Solution</h2>
          <RichText content={work.solution} />
        </section>
      )}

      {work.feedback?.quote && (
        <section className="bg-primary-section container-x py-16">
          <blockquote className="font-heading max-w-3xl text-2xl italic leading-relaxed text-[var(--color-text-on-dark)]">
            &ldquo;{work.feedback.quote}&rdquo;
          </blockquote>
          {work.feedback.attribution && (
            <cite className="mt-4 block text-sm not-italic text-[var(--color-text-on-dark)]/80">
              — {work.feedback.attribution}
            </cite>
          )}
        </section>
      )}
    </main>
  );
}
