"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import Container from "@/components/Container";
import Typography from "@/components/Typography";
import Reveal from "@/components/motion/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type QuoteBandProps = Readonly<{
  quote: string;
  attribution?: string | null;
}>;

export default function QuoteBand({ quote, attribution }: QuoteBandProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const watermark = watermarkRef.current;
    if (!section || !watermark) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

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
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="quote-band bg-primary-section relative flex min-h-145 items-center overflow-hidden md:h-174"
    >
      <span
        aria-hidden="true"
        className="quote-band__watermark pointer-events-none absolute left-[calc(50%-50px)] top-1/2 -translate-x-1/2 translate-y-[-56%] select-none font-decorative text-[clamp(28rem,57vw,51.25rem)] leading-none text-[rgba(245,239,224,0.1)]"
      >
        <span
          ref={watermarkRef}
          className="quote-band__watermark-motion inline-block will-change-transform"
        >
          &amp;
        </span>
      </span>

      <Container className="relative z-10 w-full text-center">
        <Reveal stagger y={28}>
          <figure className="mx-auto flex max-w-225 flex-col items-center gap-9">
            <div data-reveal>
              <Typography
                variant="quote"
                className="tracking-[-0.005em] text-(--color-text-on-dark)"
              >
                &#8220;{quote}&#8221;
              </Typography>
            </div>

            {attribution ? (
              <figcaption
                data-reveal
                className="font-heading italic text-base tracking-widest text-[rgba(232,196,192,0.9)]"
              >
                {attribution}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
