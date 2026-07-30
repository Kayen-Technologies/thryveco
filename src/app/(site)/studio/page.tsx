import type { Metadata } from "next";

import FinalCta from "@/components/home/FinalCta";
import {
  STUDIO_DEFAULTS,
  type StudioMediaSrc,
  type StudioServiceDefault,
} from "@/components/studio/defaults";
import StudioHero from "@/components/studio/StudioHero";
import StudioHowItWorks from "@/components/studio/StudioHowItWorks";
import StudioServices from "@/components/studio/StudioServices";
import { getMediaUrl } from "@/lib/cms/media";
import { getStudioPage } from "@/lib/payload";
import type { Media } from "@/payload-types";

export const metadata: Metadata = {
  title: "Studio",
  description: "Our four core creative services.",
};

function mediaSource(
  media: number | Media | null | undefined,
  fallback: StudioMediaSrc,
): StudioMediaSrc {
  const src = getMediaUrl(media);

  if (!src || !media || typeof media === "number") return fallback;

  return { src, alt: media.alt };
}

function mapServices(
  services:
    | {
        serviceLabel?: string | null;
        title: string;
        displayTitlePrefix?: string | null;
        displayTitleAccent?: string | null;
        description?: string | null;
        includes?: { item: string }[] | null;
        stackImages?: { image: number | Media }[] | null;
        ctaLabel?: string | null;
        ctaHref?: string | null;
      }[]
    | null
    | undefined,
): StudioServiceDefault[] {
  if (!services?.length) return [...STUDIO_DEFAULTS.services];

  const mapped = services
    .map((service, index) => {
      const fallback = STUDIO_DEFAULTS.services[index] ?? STUDIO_DEFAULTS.services[0];
      const stackImages =
        service.stackImages
          ?.map((entry, stackIndex) => {
            const fallbackImage =
              fallback.stackImages[stackIndex] ?? fallback.stackImages[0];
            return mediaSource(entry.image, fallbackImage);
          })
          .filter(Boolean) ?? fallback.stackImages;

      return {
        serviceLabel: service.serviceLabel ?? fallback.serviceLabel,
        title: service.title,
        displayTitlePrefix: service.displayTitlePrefix ?? fallback.displayTitlePrefix,
        displayTitleAccent: service.displayTitleAccent ?? fallback.displayTitleAccent,
        description: service.description ?? fallback.description,
        includes:
          service.includes?.map((entry) => entry.item).filter(Boolean) ?? fallback.includes,
        ctaLabel: service.ctaLabel ?? fallback.ctaLabel,
        ctaHref: service.ctaHref ?? fallback.ctaHref,
        stackImages: stackImages.length > 0 ? stackImages : fallback.stackImages,
      };
    })
    .filter((service): service is StudioServiceDefault => Boolean(service.title));

  return mapped.length > 0 ? mapped : [...STUDIO_DEFAULTS.services];
}

export default async function StudioPage() {
  const page = await getStudioPage();

  const howItWorks =
    page?.howItWorks?.map((step, index) => {
      const fallback = STUDIO_DEFAULTS.howItWorks[index] ?? STUDIO_DEFAULTS.howItWorks[0];
      return {
        step: step.step ?? fallback.step,
        title: step.title ?? fallback.title,
        description: step.description ?? fallback.description,
        image: mediaSource(step.image, fallback.image),
      };
    }) ?? STUDIO_DEFAULTS.howItWorks;

  return (
    <main className="studio-page">
      <StudioHero
        headline={page?.hero?.headline ?? STUDIO_DEFAULTS.hero.headline}
        tagline={page?.hero?.tagline ?? STUDIO_DEFAULTS.hero.tagline}
        image={mediaSource(page?.hero?.image, STUDIO_DEFAULTS.hero.image)}
      />

      <StudioServices
        sectionTitle={page?.servicesSection?.title ?? STUDIO_DEFAULTS.servicesSection.title}
        services={mapServices(page?.services)}
        underlineSrc={STUDIO_DEFAULTS.underlineSrc}
        bulletSrc={STUDIO_DEFAULTS.bulletSrc}
      />

      <StudioHowItWorks
        title={page?.howItWorksSection?.title ?? STUDIO_DEFAULTS.howItWorksSection.title}
        steps={howItWorks}
      />

      <FinalCta
        headline={page?.cta?.headline ?? STUDIO_DEFAULTS.cta.headline}
        subtext={page?.cta?.subtext ?? STUDIO_DEFAULTS.cta.subtext}
        ctaLabel={page?.cta?.ctaLabel ?? STUDIO_DEFAULTS.cta.ctaLabel}
        ctaHref={page?.cta?.ctaHref ?? STUDIO_DEFAULTS.cta.ctaHref}
        image={mediaSource(page?.cta?.image, STUDIO_DEFAULTS.cta.image)}
      />
    </main>
  );
}
