import Image from "next/image";
import Link from "next/link";

import type { JournalMediaSrc } from "@/components/journal/defaults";

type JournalArticleHeroProps = Readonly<{
  title: string;
  deck: string;
  category: string;
  readTime?: number | null;
  authorLabel: string;
  heroImage: JournalMediaSrc;
}>;

export default function JournalArticleHero({
  title,
  deck,
  category,
  readTime,
  authorLabel,
  heroImage,
}: JournalArticleHeroProps) {
  return (
    <header className="journal-article-hero">
      <Link href="/journal" className="journal-article-hero__back" aria-label="Back to Journal">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/arrow-left.svg" alt="" width={24} height={24} />
      </Link>

      <div className="journal-article-hero__meta">
        <span className="journal-article-hero__pill">{category}</span>
        {readTime != null ? (
          <span className="journal-article-hero__pill">{readTime} min read</span>
        ) : null}
        <span className="journal-article-hero__pill">By {authorLabel}</span>
      </div>

      <div className="journal-article-hero__intro">
        <h1 className="journal-article-hero__title">{title}</h1>
        <p className="journal-article-hero__deck">{deck}</p>
      </div>

      <div className="journal-article-hero__media">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 920px, 100vw"
          className="journal-article-hero__image"
        />
      </div>
    </header>
  );
}
