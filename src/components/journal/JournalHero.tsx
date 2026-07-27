import Image from "next/image";

import type { JournalMediaSrc } from "@/components/journal/defaults";

type JournalHeroProps = Readonly<{
  headline: string;
  tagline?: string | null;
  image: JournalMediaSrc;
}>;

export default function JournalHero({ headline, tagline, image }: JournalHeroProps) {
  return (
    <section className="journal-hero" aria-labelledby="journal-hero-heading">
      <div className="journal-hero__inner">
        <div className="journal-hero__content">
          <h1 id="journal-hero-heading" className="journal-hero__headline">
            {headline}
          </h1>
          {tagline ? <p className="journal-hero__tagline">{tagline}</p> : null}
        </div>

        <div className="journal-hero__media" aria-hidden="true">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 64vw, 100vw"
            className="journal-hero__image"
          />
        </div>
      </div>
    </section>
  );
}
