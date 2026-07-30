"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AboutFounderQuoteProps = Readonly<{
  quote: string;
  attribution?: string | null;
}>;

export default function AboutFounderQuote({ quote, attribution }: AboutFounderQuoteProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);
  const figureRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const watermark = watermarkRef.current;
    const figure = figureRef.current;
    if (!section || !watermark || !figure) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const revealTargets = figure.querySelectorAll<HTMLElement>("[data-about-quote-reveal]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        watermark,
        { y: 36, opacity: 0.72 },
        {
          y: -48,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );

      if (revealTargets.length > 0) {
        gsap.set(revealTargets, { opacity: 0, y: 28, force3D: true });
        gsap.to(revealTargets, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: figure,
            start: "top 88%",
            once: true,
          },
        });
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="about-quote">
      <span className="about-quote__mark" aria-hidden="true">
        <span
          ref={watermarkRef}
          className="about-quote__mark-motion inline-block will-change-transform"
        >
          &amp;
        </span>
      </span>
      <div className="about-quote__inner">
        <figure ref={figureRef} className="about-quote__figure">
          <blockquote className="about-quote__text" data-about-quote-reveal>
            &#8220;{quote}&#8221;
          </blockquote>
          {attribution ? (
            <figcaption className="about-quote__attribution" data-about-quote-reveal>
              {attribution}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
