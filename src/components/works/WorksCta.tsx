import Image from "next/image";
import Link from "next/link";

import { WORKS_DEFAULTS, type WorksMediaSrc } from "./defaults";

type WorksCtaProps = Readonly<{
  topLine?: string;
  topLineAccent?: string;
  bottomLine?: string;
  bottomLineAccent?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundImage?: WorksMediaSrc;
}>;

export default function WorksCta({
  topLine = WORKS_DEFAULTS.cta.topLine,
  topLineAccent = WORKS_DEFAULTS.cta.topLineAccent,
  bottomLine = WORKS_DEFAULTS.cta.bottomLine,
  bottomLineAccent = WORKS_DEFAULTS.cta.bottomLineAccent,
  ctaLabel = WORKS_DEFAULTS.cta.ctaLabel,
  ctaHref = WORKS_DEFAULTS.cta.ctaHref,
  backgroundImage = WORKS_DEFAULTS.cta.backgroundImage,
}: WorksCtaProps) {
  return (
    <section className="works-cta">
      <div className="works-cta__media">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          sizes="100vw"
          className="works-cta__bg-image"
        />
        <div className="works-cta__overlay" />
      </div>

      <div className="works-cta__mask">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/works/cta-mask.svg"
          alt=""
          className="works-cta__mask-image"
        />
      </div>

      <div className="works-cta__content">
        <div className="works-cta__text works-cta__text--top">
          <span className="works-cta__line">{topLine}</span>
          <span className="works-cta__line works-cta__line--accent">
            {topLineAccent}
          </span>
        </div>

        <Link href={ctaHref} className="works-cta__button">
          {ctaLabel}
        </Link>

        <div className="works-cta__text works-cta__text--bottom">
          <span className="works-cta__line">{bottomLine}</span>
          <span className="works-cta__line works-cta__line--accent">
            {bottomLineAccent}
          </span>
        </div>
      </div>
    </section>
  );
}
