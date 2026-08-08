"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import Section from "@/components/Section";
import type { HomeMediaSrc } from "@/components/home/defaults";

export type MarqueeItem = Readonly<{
  word: string;
  image: HomeMediaSrc;
}>;

type HomeMarqueeProps = Readonly<{
  items: MarqueeItem[];
}>;

export default function HomeMarquee({ items }: HomeMarqueeProps) {
  const visibleItems = items.slice(0, 3);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage || visibleItems.length < 2) return;

    const syncShift = () => {
      stage.style.setProperty("--marquee-text-shift", `${track.offsetWidth}px`);
    };

    syncShift();
    const observer = new ResizeObserver(syncShift);
    observer.observe(track);
    return () => observer.disconnect();
  }, [visibleItems.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!viewport || !stage || visibleItems.length < 2) return;

    let frame = 0;
    let previousActive: HTMLElement | null = null;

    const updateActiveWord = () => {
      const viewportRect = viewport.getBoundingClientRect();
      const centerAnchor = viewportRect.left + viewportRect.width / 2;
      const words = Array.from(
        stage.querySelectorAll<HTMLElement>(".home-marquee__word"),
      );
      let active: HTMLElement | null = null;
      let nearestDistance = Number.POSITIVE_INFINITY;

      for (const word of words) {
        const rect = word.getBoundingClientRect();
        const wordCenter = rect.left + rect.width / 2;
        const distance = Math.abs(wordCenter - centerAnchor);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          active = word;
        }
      }

      if (active !== previousActive) {
        previousActive?.removeAttribute("data-active");
        active?.setAttribute("data-active", "true");
        previousActive = active;
      }

      frame = window.requestAnimationFrame(updateActiveWord);
    };

    frame = window.requestAnimationFrame(updateActiveWord);
    return () => window.cancelAnimationFrame(frame);
  }, [visibleItems.length]);

  if (visibleItems.length === 0) return null;

  return (
    <Section
      tone="cream"
      padded={false}
      className="home-marquee relative overflow-hidden"
    >
      <div
        ref={viewportRef}
        className="home-marquee__words-viewport"
        aria-label={visibleItems.map(({ word }) => word).join(", ")}
      >
        <div ref={stageRef} className="home-marquee__words-stage">
          <div ref={trackRef} className="home-marquee__words-track">
            {visibleItems.map(({ word }, index) => (
              <p className="home-marquee__word" key={`${word}-${index}`}>
                {word}
              </p>
            ))}
          </div>
          <div className="home-marquee__words-track" aria-hidden="true">
            {visibleItems.map(({ word }, index) => (
              <p className="home-marquee__word" key={`${word}-copy-${index}`}>
                {word}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="home-marquee__gallery">
        {visibleItems.map(({ word, image }, index) => (
          <div className="home-marquee__photo" key={`${word}-image-${index}`}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 373px, 33vw"
              className="home-marquee__photo-img"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
