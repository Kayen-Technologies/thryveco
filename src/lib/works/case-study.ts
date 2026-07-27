import {
  caseStudyContentForSlug,
  defaultApproachLexical,
  defaultBrandLexical,
  defaultChallengeLexical,
  type CaseStudyContent,
  type CaseStudyMediaSrc,
} from "@/components/works/caseStudyDefaults";
import { WORKS_DEFAULTS } from "@/components/works/defaults";
import { getMediaUrl } from "@/lib/cms/media";
import type { Media, Work } from "@/payload-types";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type ResolvedCaseStudy = {
  title: string;
  seriesLabel: string;
  publishedLabel: string;
  heroImage: CaseStudyMediaSrc;
  brandContent: SerializedEditorState | null;
  brandImages: CaseStudyMediaSrc[];
  challengeContent: SerializedEditorState | null;
  approachContent: SerializedEditorState | null;
  deliverables: string[];
  galleryImages: CaseStudyMediaSrc[];
  results: string[];
  quote: string;
  attribution: string;
};

function mediaSource(
  media: number | Media | null | undefined,
  fallback?: CaseStudyMediaSrc,
): CaseStudyMediaSrc | null {
  const src = getMediaUrl(media);
  if (!src || !media || typeof media === "number") return fallback ?? null;
  return { src, alt: media.alt };
}

function formatPublishedDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function mapGalleryImages(
  work: Work,
  fallback: CaseStudyContent | null,
): CaseStudyMediaSrc[] {
  const fromPayload =
    work.galleryImages
      ?.map((entry) => mediaSource(entry.image))
      .filter((image): image is CaseStudyMediaSrc => image !== null) ?? [];

  if (fromPayload.length > 0) return fromPayload;
  return fallback?.galleryImages ?? [];
}

function mapBrandImages(
  work: Work,
  fallback: CaseStudyContent | null,
): CaseStudyMediaSrc[] {
  const fromPayload =
    (work as Work & { brandImages?: { image?: number | Media | null }[] }).brandImages
      ?.map((entry) => mediaSource(entry.image))
      .filter((image): image is CaseStudyMediaSrc => image !== null) ?? [];

  if (fromPayload.length > 0) return fromPayload;
  return fallback?.brandImages ?? [];
}

export function resolveCaseStudy(work: Work): ResolvedCaseStudy {
  const fallback = caseStudyContentForSlug(work.slug);
  const listingFallback = WORKS_DEFAULTS.works.find((entry) => entry.slug === work.slug);

  const heroImage =
    mediaSource(work.heroImage, fallback?.heroImage ?? listingFallback?.coverImage) ??
    listingFallback?.coverImage ?? {
      src: "/assets/works/work-casa-muse.jpg",
      alt: work.title,
    };

  const deliverables =
    (work as Work & { deliverables?: { item?: string | null }[] }).deliverables
      ?.map((entry) => entry.item?.trim())
      .filter((item): item is string => Boolean(item)) ??
    fallback?.deliverables ??
    work.tags?.map((tag) => tag.tag) ??
    [];

  const results =
    (work as Work & { results?: { item?: string | null }[] }).results
      ?.map((entry) => entry.item?.trim())
      .filter((item): item is string => Boolean(item)) ?? fallback?.results ?? [];

  return {
    title: work.title,
    seriesLabel:
      (work as Work & { seriesLabel?: string | null }).seriesLabel ??
      fallback?.seriesLabel ??
      "The Thryve Edit",
    publishedLabel: formatPublishedDate(work.publishedAt),
    heroImage,
    brandContent: work.overview ?? defaultBrandLexical(work.slug),
    brandImages: mapBrandImages(work, fallback),
    challengeContent: work.problem ?? defaultChallengeLexical(work.slug),
    approachContent: work.solution ?? defaultApproachLexical(work.slug),
    deliverables,
    galleryImages: mapGalleryImages(work, fallback),
    results,
    quote: work.feedback?.quote ?? fallback?.quote ?? "",
    attribution: work.feedback?.attribution ?? fallback?.attribution ?? "",
  };
}
