"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import { DEFAULT_FINAL_CTA_CLOSING_LINE, type HomeMediaSrc } from "@/components/home/defaults";
import Reveal from "@/components/motion/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const bgMotionRef = useRef<HTMLDivElement>(null);

  const [headlineLine1, headlineLine2] = splitIntoTwoLines(headline);
  const closing = subtext?.trim() || DEFAULT_FINAL_CTA_CLOSING_LINE;
  const [closingLine1, closingLine2] = splitIntoTwoLines(closing);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bgMotion = bgMotionRef.current;
    if (!section || !bgMotion) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgMotion,
        { scale: 1 },
        {
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="final-cta">
      <div className="final-cta__bg-wrap" aria-hidden="true">
        <div ref={bgMotionRef} className="final-cta__bg-motion">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="final-cta__bg"
          />
        </div>
      </div>
      <div className="final-cta__overlay" aria-hidden="true" />

      <div className="final-cta__content">
        <Reveal className="final-cta__frame" stagger y={36} start="top 75%">
          {/* White frame with rectangular aperture — Figma node 104:822 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/home/final-cta-mask.svg"
            alt=""
            aria-hidden="true"
            className="final-cta__mask"
          />

          <div className="final-cta__copy final-cta__copy--top">
            <div data-reveal>
              <p className="final-cta__line final-cta__line--offset-a">{headlineLine1}</p>
              {headlineLine2 ? (
                <p className="final-cta__line final-cta__line--offset-b">{headlineLine2}</p>
              ) : null}
            </div>
          </div>

          <div className="final-cta__cta-wrap">
            <div data-reveal>
              <Link href={ctaHref} className="final-cta__cta">
                {ctaLabel}
              </Link>
            </div>
          </div>

          <div className="final-cta__copy final-cta__copy--bottom">
            <div data-reveal>
              <p className="final-cta__line final-cta__line--offset-a">{closingLine1}</p>
              {closingLine2 ? (
                <p className="final-cta__line final-cta__line--offset-b">{closingLine2}</p>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
