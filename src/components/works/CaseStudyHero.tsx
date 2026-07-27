import Image from "next/image";
import Link from "next/link";

import type { CaseStudyMediaSrc } from "@/components/works/caseStudyDefaults";

type CaseStudyHeroProps = Readonly<{
  title: string;
  seriesLabel?: string;
  publishedLabel?: string;
  heroImage: CaseStudyMediaSrc;
}>;

export default function CaseStudyHero({
  title,
  seriesLabel,
  publishedLabel,
  heroImage,
}: CaseStudyHeroProps) {
  return (
    <header className="case-study-hero">
      <Link href="/works" className="case-study-hero__back" aria-label="Back to Works">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/home/arrow-left.svg" alt="" width={24} height={24} />
      </Link>

      <div className="case-study-hero__intro">
        <h1 className="case-study-hero__title">{title}</h1>

        {(seriesLabel || publishedLabel) && (
          <div className="case-study-hero__meta">
            {seriesLabel ? (
              <span className="case-study-hero__pill">{seriesLabel}</span>
            ) : null}
            {publishedLabel ? (
              <span className="case-study-hero__pill">{publishedLabel}</span>
            ) : null}
          </div>
        )}
      </div>

      <div className="case-study-hero__media">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="case-study-hero__image"
        />
      </div>
    </header>
  );
}
