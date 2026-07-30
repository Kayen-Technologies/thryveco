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

type AboutMeetFounderProps = Readonly<{
  headline: string;
  name: string;
  photos: AboutMediaSrc[];
}>;

export default function AboutMeetFounder({ headline, name, photos }: AboutMeetFounderProps) {
  const collageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const collage = collageRef.current;
    if (!collage) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const photosEls = collage.querySelectorAll<HTMLElement>(".about-meet__photo");
    if (photosEls.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(photosEls, { opacity: 0, y: 36, force3D: true });

      gsap.to(photosEls, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "power2.out",
        scrollTrigger: {
          trigger: collage,
          start: "top 80%",
          once: true,
        },
      });
    }, collage);

    return () => {
      ctx.revert();
    };
  }, [photos]);

  return (
    <section className="about-meet">
      <div className="about-meet__inner">
        <Reveal className="about-meet__header" stagger y={28}>
          <p className="about-meet__eyebrow" data-reveal>
            {headline}
          </p>
          <h2 className="about-meet__name" data-reveal>
            {name}
          </h2>
        </Reveal>

        <div
          ref={collageRef}
          className="about-meet__collage"
          aria-label="Founder photo collage"
        >
          {photos.slice(0, 3).map((photo, index) => (
            <div key={photo.src} className={`about-meet__photo about-meet__photo--${index + 1}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 85vw, 325px"
                className="about-meet__image"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
