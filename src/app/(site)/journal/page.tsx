import type { Metadata } from "next";

import JournalEntriesSection from "@/components/journal/JournalEntriesSection";
import type { JournalEntryCardData } from "@/components/journal/JournalEntryCard";
import JournalHero from "@/components/journal/JournalHero";
import { JOURNAL_DEFAULTS, type JournalMediaSrc } from "@/components/journal/defaults";
import FinalCta from "@/components/home/FinalCta";
import { getMediaUrl } from "@/lib/cms/media";
import { getJournalPage, getJournalPosts } from "@/lib/payload";
import type { JournalPost, Media } from "@/payload-types";

export const metadata: Metadata = {
  title: "Journal",
  description: "Thoughts, perspective & a little creative obsession.",
};

function mediaSource(
  media: number | Media | null | undefined,
  fallback: JournalMediaSrc,
): JournalMediaSrc {
  const src = getMediaUrl(media);

  if (!src || !media || typeof media === "number") return fallback;

  return { src, alt: media.alt };
}

function mapPost(post: JournalPost): JournalEntryCardData {
  const fallbackPost = JOURNAL_DEFAULTS.posts.find((entry) => entry.slug === post.slug);
  const fallbackImage = fallbackPost?.image ?? {
    src: "/assets/journal/journal-post-01.jpg",
    alt: post.title,
  };

  return {
    slug: post.slug,
    title: post.title,
    category: post.category,
    readTime: post.readTime,
    excerpt: post.excerpt ?? fallbackPost?.excerpt ?? "",
    image: mediaSource(post.heroImage, fallbackImage),
  };
}

export default async function JournalPage() {
  const [page, { docs: posts }] = await Promise.all([
    getJournalPage(),
    getJournalPosts(),
  ]);

  const entries = posts.map((post) => mapPost(post));

  return (
    <main className="journal-page">
      <JournalHero
        headline={page?.hero?.headline ?? JOURNAL_DEFAULTS.hero.headline}
        tagline={page?.hero?.tagline ?? JOURNAL_DEFAULTS.hero.tagline}
        image={mediaSource(page?.hero?.image, JOURNAL_DEFAULTS.hero.image)}
      />

      <JournalEntriesSection
        title={page?.entriesSection?.title ?? JOURNAL_DEFAULTS.entriesSection.title}
        entries={entries}
      />

      <FinalCta
        headline={JOURNAL_DEFAULTS.cta.headline}
        subtext={JOURNAL_DEFAULTS.cta.subtext}
        ctaLabel={JOURNAL_DEFAULTS.cta.ctaLabel}
        ctaHref={JOURNAL_DEFAULTS.cta.ctaHref}
        image={JOURNAL_DEFAULTS.cta.image}
      />
    </main>
  );
}
