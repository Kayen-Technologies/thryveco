import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CaseStudyGallery from "@/components/works/CaseStudyGallery";
import CaseStudyHero from "@/components/works/CaseStudyHero";
import CaseStudyListSection from "@/components/works/CaseStudyListSection";
import CaseStudyQuote from "@/components/works/CaseStudyQuote";
import CaseStudyTextSection from "@/components/works/CaseStudyTextSection";
import WorksCta from "@/components/works/WorksCta";
import { WORKS_DEFAULTS } from "@/components/works/defaults";
import { getWorksPage, getWork, getWorks } from "@/lib/payload";
import { resolveCaseStudy } from "@/lib/works/case-study";

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
  const [work, worksPage] = await Promise.all([getWork(slug), getWorksPage()]);

  if (!work) notFound();

  const caseStudy = resolveCaseStudy(work);

  return (
    <main className="case-study-page">
      <CaseStudyHero
        title={caseStudy.title}
        seriesLabel={caseStudy.seriesLabel}
        publishedLabel={caseStudy.publishedLabel}
        heroImage={caseStudy.heroImage}
      />

      {caseStudy.brandContent ? (
        <CaseStudyTextSection
          title="The Brand"
          content={caseStudy.brandContent}
          images={caseStudy.brandImages}
          className="case-study-section--brand"
        />
      ) : null}

      {caseStudy.challengeContent ? (
        <CaseStudyTextSection title="The Challenge" content={caseStudy.challengeContent} />
      ) : null}

      {caseStudy.approachContent ? (
        <CaseStudyTextSection title="The Approach" content={caseStudy.approachContent} />
      ) : null}

      <CaseStudyListSection title="What We Delivered" items={caseStudy.deliverables} variant="spacious" />

      <CaseStudyGallery images={caseStudy.galleryImages} />

      <CaseStudyListSection title="The Results" items={caseStudy.results} variant="results" />

      {caseStudy.quote ? (
        <CaseStudyQuote quote={caseStudy.quote} attribution={caseStudy.attribution} />
      ) : null}

      <WorksCta
        topLine={worksPage?.cta?.topLine ?? WORKS_DEFAULTS.cta.topLine}
        topLineAccent={worksPage?.cta?.topLineAccent ?? WORKS_DEFAULTS.cta.topLineAccent}
        bottomLine={worksPage?.cta?.bottomLine ?? WORKS_DEFAULTS.cta.bottomLine}
        bottomLineAccent={worksPage?.cta?.bottomLineAccent ?? WORKS_DEFAULTS.cta.bottomLineAccent}
        ctaLabel={worksPage?.cta?.ctaLabel ?? WORKS_DEFAULTS.cta.ctaLabel}
        ctaHref={worksPage?.cta?.ctaHref ?? WORKS_DEFAULTS.cta.ctaHref}
      />
    </main>
  );
}
