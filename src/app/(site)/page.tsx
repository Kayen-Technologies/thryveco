import { getHomePage, getWorks } from "@/lib/payload";
import FeaturedWorkSection from "@/components/home/FeaturedWorkSection";
import type { FeaturedWorkItem } from "@/components/home/FeaturedWorkBand";
import FinalCta from "@/components/home/FinalCta";
import HomeHero from "@/components/home/HomeHero";
import HomeIntro from "@/components/home/HomeIntro";
import HomeMarquee from "@/components/home/HomeMarquee";
import QuoteBand from "@/components/home/QuoteBand";
import TestimonialCarousel from "@/components/home/TestimonialCarousel";
import { HOME_DEFAULTS, type HomeMediaSrc } from "@/components/home/defaults";
import { getMediaUrl } from "@/lib/cms/media";
import type { Media, Work } from "@/payload-types";

function mediaSource(
  media: number | Media | null | undefined,
  fallback: HomeMediaSrc,
): HomeMediaSrc {
  const src = getMediaUrl(media);

  if (!src || !media || typeof media === "number") return fallback;

  return { src, alt: media.alt };
}

function mapFeaturedWork(work: Work): FeaturedWorkItem | null {
  const media = work.coverImage ?? work.heroImage;
  const src = getMediaUrl(media);
  if (!src || !media || typeof media === "number") return null;

  return {
    slug: work.slug,
    href: `/works/${work.slug}`,
    name: work.client || work.title,
    category: work.industry ?? work.tagline ?? "",
    tags: work.tags?.map(({ tag }) => tag) ?? [],
    image: { src, alt: media.alt },
  };
}

export default async function HomePage() {
  const [page, { docs: allWorks }] = await Promise.all([
    getHomePage(),
    getWorks({ limit: 4 }),
  ]);

  const introBody = page?.intro?.body?.trim();
  const paragraphs = introBody
    ? introBody.split(/\n\s*\n/).filter(Boolean)
    : [...HOME_DEFAULTS.intro.body];
  const marqueeWords = page?.marqueeWords?.map(({ word }) => word.trim()).filter(Boolean) ?? [];

  const dynamicWorks = allWorks
    .map(mapFeaturedWork)
    .filter((work): work is FeaturedWorkItem => work !== null);

  const featuredWorks =
    dynamicWorks.length > 0
      ? dynamicWorks
      : HOME_DEFAULTS.featured.items.map((item) => ({
          ...item,
          tags: [...item.tags],
        }));
  const testimonials =
    page?.testimonials
      ?.map(({ quote, name, role }) => ({ quote, name, role }))
      .filter(({ quote, name }) => quote.trim().length > 0 && name.trim().length > 0) ?? [];
  const testimonialItems =
    testimonials.length > 0
      ? testimonials
      : HOME_DEFAULTS.testimonials.items.map((item) => ({ ...item }));

  return (
    <main className="overflow-clip">
      <HomeHero
        headline={page?.hero?.headline ?? HOME_DEFAULTS.hero.headline}
        emphasis={page?.hero?.headlineEmphasis ?? HOME_DEFAULTS.hero.emphasis}
        image={mediaSource(page?.hero?.heroImage, HOME_DEFAULTS.hero.image)}
        videoSrc={
          getMediaUrl(page?.hero?.heroVideo) ?? HOME_DEFAULTS.hero.videoSrc
        }
      />
      <HomeIntro
        headline={page?.intro?.headline ?? HOME_DEFAULTS.intro.headline}
        paragraphs={paragraphs}
        ctaLabel={page?.intro?.ctaLabel ?? HOME_DEFAULTS.intro.ctaLabel}
        ctaHref={page?.intro?.ctaHref ?? HOME_DEFAULTS.intro.ctaHref}
        image={mediaSource(page?.intro?.image, HOME_DEFAULTS.intro.image)}
      />
      <HomeMarquee
        primaryWord={marqueeWords[0] ?? HOME_DEFAULTS.marquee.primaryWord}
        secondaryWord={marqueeWords[1] ?? HOME_DEFAULTS.marquee.secondaryWord}
        image={mediaSource(page?.marquee?.image, HOME_DEFAULTS.marquee.image)}
        maskSrc={HOME_DEFAULTS.marquee.maskSrc}
      />
      <FeaturedWorkSection
        headline={page?.featuredWork?.headline ?? HOME_DEFAULTS.featured.headline}
        body={page?.story?.body?.trim() || HOME_DEFAULTS.featured.body}
        works={featuredWorks}
      />
      <QuoteBand
        quote={page?.quoteBand?.quote ?? HOME_DEFAULTS.quote.quote}
        attribution={page?.quoteBand?.attribution ?? HOME_DEFAULTS.quote.attribution}
      />
      <TestimonialCarousel
        headline={HOME_DEFAULTS.testimonials.headline}
        body={HOME_DEFAULTS.testimonials.body}
        items={testimonialItems}
      />
      <FinalCta
        headline={page?.finalCta?.headline ?? HOME_DEFAULTS.finalCta.headline}
        subtext={page?.finalCta?.subtext ?? HOME_DEFAULTS.finalCta.subtext}
        ctaLabel={page?.finalCta?.ctaLabel ?? HOME_DEFAULTS.finalCta.ctaLabel}
        ctaHref={page?.finalCta?.ctaHref ?? HOME_DEFAULTS.finalCta.ctaHref}
        image={mediaSource(page?.finalCta?.image, HOME_DEFAULTS.finalCta.image)}
      />
    </main>
  );
}
