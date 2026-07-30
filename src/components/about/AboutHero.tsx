"use client";

import Image from "next/image";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import type { AboutMediaSrc } from "@/components/about/defaults";

type AboutHeroProps = Readonly<{
  headline: string;
  tagline?: string | null;
  image: AboutMediaSrc;
}>;

export default function AboutHero({ headline, tagline, image }: AboutHeroProps) {
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

    const lines = content.querySelectorAll<HTMLElement>("[data-about-hero-line]");

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
    <section ref={sectionRef} className="about-hero">
      <div className="about-hero__media" aria-hidden="true">
        <div ref={mediaMotionRef} className="about-hero__media-motion">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="about-hero__image"
          />
        </div>
      </div>
      <div className="about-hero__overlay" aria-hidden="true" />
      <div className="about-hero__layout">
        <div className="about-hero__nav-spacer" aria-hidden="true" />
        <div ref={contentRef} className="about-hero__content">
          <h1 className="about-hero__headline">
            <span data-about-hero-line>{headline}</span>
          </h1>
          {tagline ? (
            <p className="about-hero__tagline">
              <span data-about-hero-line>{tagline}</span>
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
