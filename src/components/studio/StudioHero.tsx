"use client";

import Image from "next/image";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import type { StudioMediaSrc } from "@/components/studio/defaults";

type StudioHeroProps = Readonly<{
  headline: string;
  tagline?: string | null;
  image: StudioMediaSrc;
}>;

export default function StudioHero({ headline, tagline, image }: StudioHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaMotionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const mediaMotion = mediaMotionRef.current;
    if (!section || !content || !mediaMotion) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lines = content.querySelectorAll<HTMLElement>("[data-studio-hero-line]");
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
  }, [headline, tagline]);

  return (
    <section ref={sectionRef} className="studio-hero">
      <div className="studio-hero__media" aria-hidden="true">
        <div ref={mediaMotionRef} className="studio-hero__media-motion">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="studio-hero__image"
          />
        </div>
      </div>
      <div className="studio-hero__overlay" aria-hidden="true" />
      <div className="studio-hero__layout">
        <div className="studio-hero__nav-spacer" aria-hidden="true" />
        <div className="studio-hero__stage">
          <div ref={contentRef} className="studio-hero__copy">
            <h1 className="studio-hero__headline">
              <span data-studio-hero-line>{headline}</span>
            </h1>
            {tagline ? (
              <p className="studio-hero__tagline">
                <span data-studio-hero-line>{tagline}</span>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
