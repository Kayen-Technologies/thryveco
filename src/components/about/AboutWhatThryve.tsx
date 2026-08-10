"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import type { AboutMediaSrc } from "@/components/about/defaults";
import Reveal from "@/components/motion/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AboutWhatThryveProps = Readonly<{
  intro: string;
  agencyCopy: string;
  aspirationCopy: string;
  image: AboutMediaSrc;
  underlineSrc: string;
}>;

export default function AboutWhatThryve({
  intro,
  agencyCopy,
  aspirationCopy,
  image,
  underlineSrc,
}: AboutWhatThryveProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const underline = underlineRef.current;
    if (!section || !underline) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        underline,
        { scaleX: 0, opacity: 0.4 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: underline,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="about-what">
      <div className="about-what__inner">
        <Reveal className="about-what__title-block">
          <h2 className="about-what__title">
            <span>What</span>
            <span className="about-what__title-word">
              Thryve
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={underlineRef}
                src={underlineSrc}
                alt=""
                aria-hidden="true"
                className="about-what__underline"
              />
            </span>
            <span>Means</span>
          </h2>
        </Reveal>

        <Reveal>
          <p className="about-what__intro">{intro}</p>
        </Reveal>

        {/* Source order follows the mobile design, which runs the photo between
            the two paragraphs; desktop places them side by side via grid. */}
        <div className="about-what__lower">
          <Reveal className="about-what__copy about-what__copy--agency" y={28} delay={0.12}>
            <p>{agencyCopy}</p>
          </Reveal>

          <Reveal className="about-what__image-wrap" y={36} delay={0.08}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 90vw, 551px"
              className="about-what__image"
            />
          </Reveal>

          <Reveal className="about-what__copy about-what__copy--aspiration" y={28} delay={0.12}>
            <p>{aspirationCopy}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
