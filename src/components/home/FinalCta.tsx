import Image from "next/image";
import Link from "next/link";

import { DEFAULT_FINAL_CTA_CLOSING_LINE, type HomeMediaSrc } from "@/components/home/defaults";

type FinalCtaProps = Readonly<{
  headline: string;
  subtext?: string | null;
  ctaLabel: string;
  ctaHref: string;
  image: HomeMediaSrc;
}>;

/** Split copy into two uppercase lines matching the Figma frame layout. */
function splitIntoTwoLines(text: string): [string, string] {
  const normalized = text.trim();
  if (!normalized) return ["", ""];

  const peopleRemember = normalized.match(/^(.*?)\s+(people remember\??)$/i);
  if (peopleRemember) return [peopleRemember[1], peopleRemember[2]];

  const brandsStart = normalized.match(/^(beautiful brands)\s+(start here\.?)$/i);
  if (brandsStart) return [brandsStart[1], brandsStart[2]];

  const words = normalized.split(/\s+/);
  if (words.length <= 3) return [normalized, ""];

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
}

export default function FinalCta({
  headline,
  subtext,
  ctaLabel,
  ctaHref,
  image,
}: FinalCtaProps) {
  const [headlineLine1, headlineLine2] = splitIntoTwoLines(headline);
  const closing = subtext?.trim() || DEFAULT_FINAL_CTA_CLOSING_LINE;
  const [closingLine1, closingLine2] = splitIntoTwoLines(closing);

  return (
    <section className="final-cta">
      <div className="final-cta__bg-wrap" aria-hidden="true">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="final-cta__bg"
        />
      </div>
      <div className="final-cta__overlay" aria-hidden="true" />

      <div className="final-cta__content">
        <div className="final-cta__frame">
          {/* White frame with rectangular aperture — Figma node 104:822 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/home/final-cta-mask.svg"
            alt=""
            aria-hidden="true"
            className="final-cta__mask"
          />

          <div className="final-cta__copy final-cta__copy--top">
            <p className="final-cta__line final-cta__line--offset-a">{headlineLine1}</p>
            {headlineLine2 ? (
              <p className="final-cta__line final-cta__line--offset-b">{headlineLine2}</p>
            ) : null}
          </div>

          <div className="final-cta__cta-wrap">
            <Link href={ctaHref} className="final-cta__cta">
              {ctaLabel}
            </Link>
          </div>

          <div className="final-cta__copy final-cta__copy--bottom">
            <p className="final-cta__line final-cta__line--offset-a">{closingLine1}</p>
            {closingLine2 ? (
              <p className="final-cta__line final-cta__line--offset-b">{closingLine2}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
