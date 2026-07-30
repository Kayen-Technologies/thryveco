import type { Metadata } from "next";

import Reveal from "@/components/motion/Reveal";
import { WORKS_DEFAULTS, type WorksMediaSrc } from "@/components/works/defaults";
import WorksCaseStudyCard from "@/components/works/WorksCaseStudyCard";
import WorksCta from "@/components/works/WorksCta";
import WorksHero from "@/components/works/WorksHero";
import { getMediaUrl } from "@/lib/cms/media";
import { getWorksPage, getWorks } from "@/lib/payload";
import type { Media, Work } from "@/payload-types";

export const metadata: Metadata = {
  title: "Works",
  description: "A collection of brands we've helped find their voice, their aesthetic, and their people.",
};

function mediaSource(
  media: number | Media | null | undefined,
  fallback: WorksMediaSrc,
): WorksMediaSrc {
  const src = getMediaUrl(media);
  if (!src || !media || typeof media === "number") return fallback;
  return { src, alt: media.alt };
}

function findWorkFallback(slug: string): (typeof WORKS_DEFAULTS.works)[number] | undefined {
  return WORKS_DEFAULTS.works.find((w) => w.slug === slug);
}

function mapWork(work: Work) {
  const fallback = findWorkFallback(work.slug);

  return {
    slug: work.slug,
    client: work.client,
    industry: work.industry ?? fallback?.industry ?? "",
    tags: work.tags?.map((t) => t.tag) ?? fallback?.tags ?? [],
    coverImage: mediaSource(
      work.coverImage,
      fallback?.coverImage ?? WORKS_DEFAULTS.works[0].coverImage,
    ),
  };
}

export default async function WorksPage() {
  const [page, { docs: works }] = await Promise.all([getWorksPage(), getWorks()]);

  const heroImage = mediaSource(page?.hero?.heroImage, WORKS_DEFAULTS.hero.heroImage);
  const ctaBgImage = mediaSource(page?.cta?.backgroundImage, WORKS_DEFAULTS.cta.backgroundImage);

  const mappedWorks = works.length > 0 ? works.map(mapWork) : WORKS_DEFAULTS.works;

  return (
    <main className="works-page">
      <WorksHero
        headline={page?.hero?.headline ?? WORKS_DEFAULTS.hero.headline}
        subheadline={page?.hero?.subheadline ?? WORKS_DEFAULTS.hero.subheadline}
        heroImage={heroImage}
      />

      <section className="works-portfolio">
        <Reveal className="works-portfolio__header">
          <h2 className="works-portfolio__title">
            {page?.portfolio?.title ?? WORKS_DEFAULTS.portfolio.title}
          </h2>
        </Reveal>

        <div className="works-portfolio__list">
          {mappedWorks.map((work) => (
            <WorksCaseStudyCard
              key={work.slug}
              slug={work.slug}
              client={work.client}
              industry={work.industry}
              tags={work.tags}
              coverImage={work.coverImage}
            />
          ))}
        </div>
      </section>

      <WorksCta
        topLine={page?.cta?.topLine ?? WORKS_DEFAULTS.cta.topLine}
        topLineAccent={page?.cta?.topLineAccent ?? WORKS_DEFAULTS.cta.topLineAccent}
        bottomLine={page?.cta?.bottomLine ?? WORKS_DEFAULTS.cta.bottomLine}
        bottomLineAccent={page?.cta?.bottomLineAccent ?? WORKS_DEFAULTS.cta.bottomLineAccent}
        ctaLabel={page?.cta?.ctaLabel ?? WORKS_DEFAULTS.cta.ctaLabel}
        ctaHref={page?.cta?.ctaHref ?? WORKS_DEFAULTS.cta.ctaHref}
        backgroundImage={ctaBgImage}
      />
    </main>
  );
}
