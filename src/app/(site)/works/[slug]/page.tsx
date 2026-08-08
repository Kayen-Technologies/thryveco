import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CaseStudyGallery from "@/components/works/CaseStudyGallery";
import CaseStudyHero from "@/components/works/CaseStudyHero";
import CaseStudyListSection from "@/components/works/CaseStudyListSection";
import CaseStudyQuote from "@/components/works/CaseStudyQuote";
import CaseStudyTextSection from "@/components/works/CaseStudyTextSection";
import FinalCta from "@/components/home/FinalCta";
import { WORKS_DEFAULTS, type WorksMediaSrc } from "@/components/works/defaults";
import { getMediaUrl } from "@/lib/cms/media";
import { getWorksPage, getWork, getWorks } from "@/lib/payload";
import type { Media } from "@/payload-types";
import { resolveCaseStudy } from "@/lib/works/case-study";

type Props = {
  params: Promise<{ slug: string }>;
};

function mediaSource(
  media: number | Media | null | undefined,
  fallback: WorksMediaSrc,
): WorksMediaSrc {
  const src = getMediaUrl(media);
  if (!src || !media || typeof media === "number") return fallback;
  return { src, alt: media.alt };
}

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

      <FinalCta
        headline={worksPage?.cta?.headline ?? WORKS_DEFAULTS.cta.headline}
        subtext={worksPage?.cta?.subtext ?? WORKS_DEFAULTS.cta.subtext}
        ctaLabel={worksPage?.cta?.ctaLabel ?? WORKS_DEFAULTS.cta.ctaLabel}
        ctaHref={worksPage?.cta?.ctaHref ?? WORKS_DEFAULTS.cta.ctaHref}
        image={mediaSource(worksPage?.cta?.image, WORKS_DEFAULTS.cta.image)}
      />
    </main>
  );
}
