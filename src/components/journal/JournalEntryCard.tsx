import Image from "next/image";
import Link from "next/link";

import type { JournalMediaSrc } from "@/components/journal/defaults";

export type JournalEntryCardData = Readonly<{
  slug: string;
  title: string;
  category: string;
  readTime?: number | null;
  excerpt?: string | null;
  image: JournalMediaSrc;
}>;

type JournalEntryCardProps = Readonly<{
  entry: JournalEntryCardData;
}>;

export default function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const meta =
    entry.readTime != null
      ? `${entry.category} - ${entry.readTime} min read`
      : entry.category;

  return (
    <article className="journal-entry-card">
      <Link href={`/journal/${entry.slug}`} className="journal-entry-card__link">
        <div className="journal-entry-card__media">
          <Image
            src={entry.image.src}
            alt={entry.image.alt}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="journal-entry-card__image"
          />
        </div>

        <div className="journal-entry-card__body">
          <p className="journal-entry-card__meta">{meta}</p>

          <div className="journal-entry-card__copy">
            <div className="journal-entry-card__text">
              <h2 className="journal-entry-card__title">{entry.title}</h2>
              {entry.excerpt ? (
                <p className="journal-entry-card__excerpt">{entry.excerpt}</p>
              ) : null}
            </div>
            <span className="journal-entry-card__cta">Read more</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
