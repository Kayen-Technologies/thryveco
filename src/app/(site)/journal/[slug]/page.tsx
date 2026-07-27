import type { Metadata } from "next";
import { notFound } from "next/navigation";

import RichText from "@/components/RichText";
import { JOURNAL_DEFAULTS, type JournalMediaSrc } from "@/components/journal/defaults";
import JournalArticleBody from "@/components/journal/JournalArticleBody";
import JournalArticleHero from "@/components/journal/JournalArticleHero";
import { getMediaUrl } from "@/lib/cms/media";
import { resolveJournalArticleContent } from "@/lib/journal/article-content";
import { getJournalPost, getJournalPosts } from "@/lib/payload";
import type { Media } from "@/payload-types";

type Props = {
  params: Promise<{ slug: string }>;
};

function mediaSource(
  media: number | Media | null | undefined,
  fallback: JournalMediaSrc,
): JournalMediaSrc {
  const src = getMediaUrl(media);

  if (!src || !media || typeof media === "number") return fallback;

  return { src, alt: media.alt };
}

function heroFallback(slug: string): JournalMediaSrc {
  const post = JOURNAL_DEFAULTS.posts.find((entry) => entry.slug === slug);
  return post?.image ?? JOURNAL_DEFAULTS.posts[0].image;
}

export async function generateStaticParams() {
  const { docs } = await getJournalPosts();
  return docs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return {};

  const article = resolveJournalArticleContent(post);

  return {
    title: post.title,
    description: article?.deck ?? post.excerpt ?? undefined,
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getJournalPost(slug);

  if (!post) notFound();

  const article = resolveJournalArticleContent(post);

  return (
    <main className="journal-article-page">
      <article className="journal-article">
        <div className="journal-article__column">
          <JournalArticleHero
            title={post.title}
            deck={article?.deck ?? post.deck ?? post.excerpt ?? ""}
            category={post.category}
            readTime={post.readTime}
            authorLabel={article?.authorLabel ?? post.author ?? "Thryve & Co."}
            heroImage={mediaSource(post.heroImage, heroFallback(slug))}
          />

          {post.body ? (
            <div className="journal-article-body journal-article-body--rich-text">
              <RichText content={post.body} />
            </div>
          ) : article?.blocks.length ? (
            <JournalArticleBody blocks={article.blocks} />
          ) : null}
        </div>
      </article>
    </main>
  );
}
