"use client";

import Image from "next/image";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import type { ContactMediaSrc } from "@/components/contact/defaults";

type ContactHeroProps = Readonly<{
  headline: string;
  body: string;
  image: ContactMediaSrc;
}>;

export default function ContactHero({ headline, body, image }: ContactHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mediaMotionRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const mediaMotion = mediaMotionRef.current;
    if (!section || !content) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lines = content.querySelectorAll<HTMLElement>("[data-contact-hero-line]");
    const ctx = gsap.context(() => {
      if (lines.length > 0) {
        gsap.fromTo(
          lines,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.16,
            ease: "power2.out",
            delay: 0.12,
          },
        );
      }

      if (mediaMotion) {
        gsap.fromTo(
          mediaMotion,
          { scale: 1.04 },
          { scale: 1, duration: 1.35, ease: "power2.out", delay: 0.05 },
        );
      }
    }, section);

    return () => ctx.revert();
  }, [headline, body]);

  return (
    <section ref={sectionRef} className="contact-hero">
      <div className="contact-hero__media">
        <div ref={mediaMotionRef} className="contact-hero__media-motion">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 64vw"
            className="contact-hero__image"
          />
        </div>
      </div>
      <div className="contact-hero__layout">
        <div className="contact-hero__nav-spacer" aria-hidden="true" />
        <div className="contact-hero__band">
          <div ref={contentRef} className="contact-hero__copy">
            <h1 className="contact-hero__headline">
              <span data-contact-hero-line>{headline}</span>
            </h1>
            <p className="contact-hero__body">
              <span data-contact-hero-line>{body}</span>
            </p>
          </div>
          <div className="contact-hero__media-slot" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
