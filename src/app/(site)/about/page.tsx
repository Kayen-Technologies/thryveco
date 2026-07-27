import type { Metadata } from "next";

import AboutFounderQuote from "@/components/about/AboutFounderQuote";
import AboutHero from "@/components/about/AboutHero";
import AboutMeetFounder from "@/components/about/AboutMeetFounder";
import AboutOriginStory from "@/components/about/AboutOriginStory";
import AboutWhatThryve from "@/components/about/AboutWhatThryve";
import { ABOUT_DEFAULTS, type AboutMediaSrc } from "@/components/about/defaults";
import FinalCta from "@/components/home/FinalCta";
import { getMediaUrl } from "@/lib/cms/media";
import { getAboutPage } from "@/lib/payload";
import type { Media } from "@/payload-types";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the founder of Thryve Co.",
};

function mediaSource(
  media: number | Media | null | undefined,
  fallback: AboutMediaSrc,
): AboutMediaSrc {
  const src = getMediaUrl(media);

  if (!src || !media || typeof media === "number") return fallback;

  return { src, alt: media.alt };
}

function collagePhotos(
  photos: { photo: number | Media }[] | null | undefined,
  fallback: AboutMediaSrc[],
): AboutMediaSrc[] {
  if (!photos?.length) return fallback;

  const mapped = photos
    .map((item) => {
      const media = item.photo;
      const src = getMediaUrl(media);
      if (!src || !media || typeof media === "number") return null;
      return { src, alt: media.alt };
    })
    .filter((item): item is AboutMediaSrc => item !== null);

  return mapped.length > 0 ? mapped : fallback;
}

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <main className="about-page">
      <AboutHero
        headline={page?.hero?.headline ?? ABOUT_DEFAULTS.hero.headline}
        tagline={page?.hero?.tagline ?? ABOUT_DEFAULTS.hero.tagline}
        image={mediaSource(page?.hero?.image, ABOUT_DEFAULTS.hero.image)}
      />

      <div className="about-cream-band">
        <div className="about-cream-band__inner">
          <AboutMeetFounder
            headline={page?.founderSection?.headline ?? ABOUT_DEFAULTS.founderSection.headline}
            name={page?.founderSection?.name ?? ABOUT_DEFAULTS.founderSection.name}
            photos={collagePhotos(page?.founderStory?.photos, [...ABOUT_DEFAULTS.founderStory.collage])}
          />

          <AboutOriginStory
            headlineLead={page?.founderStory?.headlineLead ?? ABOUT_DEFAULTS.founderStory.headlineLead}
            headlineMuted={page?.founderStory?.headlineMuted ?? ABOUT_DEFAULTS.founderStory.headlineMuted}
            headlineEnd={page?.founderStory?.headlineEnd ?? ABOUT_DEFAULTS.founderStory.headlineEnd}
            paragraphOne={page?.founderStory?.paragraphOne ?? ABOUT_DEFAULTS.founderStory.paragraphOne}
            paragraphTwo={page?.founderStory?.paragraphTwo ?? ABOUT_DEFAULTS.founderStory.paragraphTwo}
            image={mediaSource(page?.founderStory?.storyImage, ABOUT_DEFAULTS.founderStory.storyImage)}
          />
        </div>
      </div>

      <AboutFounderQuote
        quote={page?.founderQuote?.quote ?? ABOUT_DEFAULTS.founderQuote.quote}
        attribution={page?.founderQuote?.attribution ?? ABOUT_DEFAULTS.founderQuote.attribution}
      />

      <AboutWhatThryve
        intro={page?.whatThryve?.intro ?? ABOUT_DEFAULTS.whatThryve.intro}
        agencyCopy={page?.whatThryve?.agencyCopy ?? ABOUT_DEFAULTS.whatThryve.agencyCopy}
        aspirationCopy={page?.whatThryve?.aspirationCopy ?? ABOUT_DEFAULTS.whatThryve.aspirationCopy}
        image={mediaSource(page?.whatThryve?.image, ABOUT_DEFAULTS.whatThryve.image)}
        underlineSrc={ABOUT_DEFAULTS.whatThryve.underlineSrc}
      />

      <FinalCta
        headline={page?.cta?.headline ?? ABOUT_DEFAULTS.cta.headline}
        subtext={page?.cta?.subtext ?? ABOUT_DEFAULTS.cta.subtext}
        ctaLabel={page?.cta?.ctaLabel ?? ABOUT_DEFAULTS.cta.ctaLabel}
        ctaHref={page?.cta?.ctaHref ?? ABOUT_DEFAULTS.cta.ctaHref}
        image={mediaSource(page?.cta?.image, ABOUT_DEFAULTS.cta.image)}
      />
    </main>
  );
}
