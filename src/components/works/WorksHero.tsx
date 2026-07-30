"use client";

import Image from "next/image";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { WORKS_DEFAULTS, type WorksMediaSrc } from "./defaults";

type WorksHeroProps = Readonly<{
  headline?: string;
  subheadline?: string;
  heroImage?: WorksMediaSrc;
}>;

export default function WorksHero({
  headline = WORKS_DEFAULTS.hero.headline,
  subheadline = WORKS_DEFAULTS.hero.subheadline,
  heroImage = WORKS_DEFAULTS.hero.heroImage,
}: WorksHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaMotionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const mediaMotion = mediaMotionRef.current;
    if (!section || !content || !mediaMotion) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lines = content.querySelectorAll<HTMLElement>("[data-works-hero-line]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.18,
          ease: "power2.out",
          delay: 0.15,
        },
      );

      gsap.fromTo(
        mediaMotion,
        { scale: 1.04 },
        { scale: 1, duration: 1.4, ease: "power2.out", delay: 0.05 },
      );
    }, section);

    return () => ctx.revert();
  }, [headline, subheadline]);

  return (
    <section ref={sectionRef} className="works-hero" aria-labelledby="works-hero-heading">
      <div className="works-hero__inner">
        <div ref={contentRef} className="works-hero__content">
          <h1 id="works-hero-heading" className="works-hero__headline">
            <span data-works-hero-line>{headline}</span>
          </h1>
          <p className="works-hero__subheadline">
            <span data-works-hero-line>{subheadline}</span>
          </p>
        </div>

        <div className="works-hero__media" aria-hidden="true">
          <div ref={mediaMotionRef} className="works-hero__media-motion">
            <Image
              src={heroImage.src}
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 64vw, 100vw"
              className="works-hero__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
