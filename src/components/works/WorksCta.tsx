"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

import Reveal from "@/components/motion/Reveal";
import { WORKS_DEFAULTS, type WorksMediaSrc } from "./defaults";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const sectionRef = useRef<HTMLElement>(null);
  const bgMotionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bgMotion = bgMotionRef.current;
    if (!section || !bgMotion) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="works-cta">
      <div className="works-cta__bg-wrap" aria-hidden="true">
        <div ref={bgMotionRef} className="works-cta__bg-motion">
          <Image
            src={backgroundImage.src}
            alt={backgroundImage.alt}
            fill
            sizes="100vw"
            className="works-cta__bg"
          />
        </div>
      </div>
      <div className="works-cta__overlay" aria-hidden="true" />

      <div className="works-cta__content">
        <Reveal className="works-cta__frame" stagger y={36} start="top 75%">
          {/* White frame with rectangular aperture — Figma node 181:373 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/works/cta-mask.svg"
            alt=""
            aria-hidden="true"
            className="works-cta__mask"
          />

          <div className="works-cta__copy works-cta__copy--top" data-reveal>
            <p className="works-cta__line works-cta__line--offset-a">{topLine}</p>
            <p className="works-cta__line works-cta__line--offset-b">{topLineAccent}</p>
          </div>

          <div className="works-cta__cta-wrap" data-reveal>
            <Link href={ctaHref} className="works-cta__cta">
              {ctaLabel}
            </Link>
          </div>

          <div className="works-cta__copy works-cta__copy--bottom" data-reveal>
            <p className="works-cta__line works-cta__line--offset-a">{bottomLine}</p>
            <p className="works-cta__line works-cta__line--offset-b">{bottomLineAccent}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
