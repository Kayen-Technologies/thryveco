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
    const wordTrack = trackRef.current;
    const wordStage = stageRef.current;
    if (!wordTrack || !wordStage || visibleItems.length < 2) return;

    const syncShift = () => {
      // One loop's travel is exactly one copy of the track, so the duplicate
      // behind it lands seam-to-seam.
      const wordShift = wordTrack.offsetWidth;
      if (!wordShift) return;

      wordStage.style.setProperty("--marquee-shift", `${wordShift}px`);
    };

    syncShift();
    const observer = new ResizeObserver(syncShift);
    observer.observe(wordTrack);
    window.addEventListener("resize", syncShift);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncShift);
    };
  }, [visibleItems.length]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!viewport || !stage || visibleItems.length < 2) return;

    let frame = 0;
    let previousIndex = -1;

    const wordsIn = (root: HTMLElement | null) =>
      root
        ? Array.from(root.querySelectorAll<HTMLElement>(".home-marquee__word"))
        : [];

    const updateActiveWord = () => {
      const viewportRect = viewport.getBoundingClientRect();
      const centerAnchor = viewportRect.left + viewportRect.width / 2;
      const words = wordsIn(stage);
      let activeIndex = -1;
      let nearestDistance = Number.POSITIVE_INFINITY;

      words.forEach((word, index) => {
        const rect = word.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - centerAnchor);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          activeIndex = index;
        }
      });

      if (activeIndex !== previousIndex) {
        if (previousIndex >= 0) {
          delete words[previousIndex]?.dataset.active;
        }

        const active = words[activeIndex];
        if (active) active.dataset.active = "true";
        previousIndex = activeIndex;
      }

      frame = window.requestAnimationFrame(updateActiveWord);
    };

    frame = window.requestAnimationFrame(updateActiveWord);
    return () => window.cancelAnimationFrame(frame);
  }, [visibleItems.length]);

  if (visibleItems.length === 0) return null;

  const words = (keyPrefix: string) =>
    visibleItems.map(({ word }, index) => (
      <p className="home-marquee__word" key={`${keyPrefix}-${word}-${index}`}>
        {word}
      </p>
    ));

  const photos = (keyPrefix: string) =>
    visibleItems.map(({ word, image }, index) => (
      <div className="home-marquee__photo" key={`${keyPrefix}-${word}-${index}`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 373px, 33vw"
          className="home-marquee__photo-img"
        />
      </div>
    ));

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
            {words("word")}
          </div>
          <div className="home-marquee__words-track" aria-hidden="true">
            {words("word-loop")}
          </div>
        </div>
      </div>

      <div className="home-marquee__gallery">
        <div className="home-marquee__gallery-stage">
          <div className="home-marquee__gallery-track">{photos("photo")}</div>
        </div>
      </div>
    </Section>
  );
}
