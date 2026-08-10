"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef } from "react";

import Button from "@/components/Button";
import type { HomeMediaSrc } from "@/components/home/defaults";
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

export default function FinalCta({
  headline,
  subtext,
  ctaLabel,
  ctaHref,
  image,
}: FinalCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaMotionRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const body = subtext?.trim();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const mediaMotion = mediaMotionRef.current;
    if (!section || !mediaMotion) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mediaMotion,
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

  useEffect(() => {
    const cta = ctaRef.current;
    if (!cta) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        cta.classList.add("final-cta__cta-wrap--pulse");
        io.disconnect();
      },
      { threshold: 0.4 },
    );

    io.observe(cta);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="final-cta">
      <Reveal className="final-cta__inner" stagger y={32} start="top 75%">
        <div className="final-cta__copy" data-reveal>
          <h2 className="final-cta__headline">{headline}</h2>
          {body ? <p className="final-cta__subtext">{body}</p> : null}
        </div>

        <div className="final-cta__media" data-reveal>
          <div ref={mediaMotionRef} className="final-cta__media-motion">
            {/* Mobile crops into a 1.45x zoom, so only ~69% of the chosen
                candidate is on screen — ask for a proportionally larger one. */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 986px, (min-width: 768px) 100vw, 150vw"
              className="final-cta__image"
            />
          </div>
          <div className="final-cta__overlay" aria-hidden="true" />
        </div>

        <div ref={ctaRef} className="final-cta__cta-wrap" data-reveal>
          <Button href={ctaHref} className="final-cta__cta">
            {ctaLabel}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
