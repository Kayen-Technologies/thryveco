"use client";

import Image from "next/image";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import type { JournalMediaSrc } from "@/components/journal/defaults";

type JournalHeroProps = Readonly<{
  headline: string;
  tagline?: string | null;
  image: JournalMediaSrc;
}>;

export default function JournalHero({ headline, tagline, image }: JournalHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaMotionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const mediaMotion = mediaMotionRef.current;
    if (!section || !content) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const lines = content.querySelectorAll<HTMLElement>("[data-journal-hero-line]");

    const ctx = gsap.context(() => {
      if (lines.length > 0) {
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
      }

      if (mediaMotion) {
        gsap.fromTo(
          mediaMotion,
          { scale: 1.04 },
          {
            scale: 1,
            duration: 1.4,
            ease: "power2.out",
            delay: 0.05,
          },
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [headline, tagline]);

  return (
    <section ref={sectionRef} className="journal-hero" aria-labelledby="journal-hero-heading">
      <div className="journal-hero__inner">
        <div ref={contentRef} className="journal-hero__content">
          <h1 id="journal-hero-heading" className="journal-hero__headline">
            <span data-journal-hero-line>{headline}</span>
          </h1>
          {tagline ? (
            <p className="journal-hero__tagline">
              <span data-journal-hero-line>{tagline}</span>
            </p>
          ) : null}
        </div>

        <div className="journal-hero__media" aria-hidden="true">
          <div ref={mediaMotionRef} className="journal-hero__media-motion">
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
      </div>
    </section>
  );
}
