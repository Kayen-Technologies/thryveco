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
      <div className="works-cta__bg-wrap" aria-hidden="true">
        <Image
          src={backgroundImage.src}
          alt={backgroundImage.alt}
          fill
          sizes="100vw"
          className="works-cta__bg"
        />
      </div>
      <div className="works-cta__overlay" aria-hidden="true" />

      <div className="works-cta__content">
        <div className="works-cta__frame">
          {/* White frame with rectangular aperture — Figma node 181:373 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/works/cta-mask.svg"
            alt=""
            aria-hidden="true"
            className="works-cta__mask"
          />

          <div className="works-cta__copy works-cta__copy--top">
            <p className="works-cta__line works-cta__line--offset-a">{topLine}</p>
            <p className="works-cta__line works-cta__line--offset-b">{topLineAccent}</p>
          </div>

          <div className="works-cta__cta-wrap">
            <Link href={ctaHref} className="works-cta__cta">
              {ctaLabel}
            </Link>
          </div>

          <div className="works-cta__copy works-cta__copy--bottom">
            <p className="works-cta__line works-cta__line--offset-a">{bottomLine}</p>
            <p className="works-cta__line works-cta__line--offset-b">{bottomLineAccent}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
