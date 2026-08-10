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
  const knockoutStageRef = useRef<HTMLDivElement>(null);
  const photoStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wordTrack = trackRef.current;
    const wordStage = stageRef.current;
    if (!wordTrack || !wordStage || visibleItems.length < 2) return;

    const syncShift = () => {
      const wordShift = wordTrack.offsetWidth;
      if (!wordShift) return;

      // Every band loops over the same distance, so a shared duration keeps
      // them at one speed and their seams coincide.
      const shift = `${wordShift}px`;
      const knockoutStage = knockoutStageRef.current;
      const photoStage = photoStageRef.current;

      wordStage.style.setProperty("--marquee-shift", shift);
      knockoutStage?.style.setProperty("--marquee-shift", shift);
      photoStage?.style.setProperty("--marquee-shift", shift);

      if (!photoStage) return;

      const trackLeft = wordTrack.getBoundingClientRect().left;
      const centers = Array.from(
        wordTrack.querySelectorAll<HTMLElement>(".home-marquee__word"),
      ).map((word) => {
        const rect = word.getBoundingClientRect();
        return rect.left + rect.width / 2 - trackLeft;
      });

      const photoTracks = Array.from(
        photoStage.querySelectorAll<HTMLElement>(
          ".home-marquee__gallery-track",
        ),
      );
      const photoWidth =
        photoTracks[0]?.querySelector<HTMLElement>(".home-marquee__photo")
          ?.offsetWidth ?? 0;
      if (!photoWidth) return;

      const offsets = centers.map((center) => center - photoWidth / 2);

      for (const track of photoTracks) {
        const photos = track.querySelectorAll<HTMLElement>(
          ".home-marquee__photo",
        );
        photos.forEach((photo, index) => {
          const offset = offsets[index];
          if (offset === undefined) return;
          photo.style.setProperty("--marquee-photo-offset", `${offset}px`);
        });
      }

      // Same offsets, expressed as mask bands, so the white knockout covers
      // precisely the photos and nothing else.
      const bands = offsets
        .map((offset) => {
          const start = Math.min(Math.max(offset, 0), wordShift);
          return { start, end: Math.min(start + photoWidth, wordShift) };
        })
        .sort((a, b) => a.start - b.start);

      const stops: string[] = [];
      let cursor = 0;
      for (const { start, end } of bands) {
        if (start > cursor) stops.push(`transparent ${cursor}px ${start}px`);
        stops.push(`#000 ${Math.max(start, cursor)}px ${end}px`);
        cursor = Math.max(cursor, end);
      }
      stops.push(`transparent ${cursor}px ${wordShift}px`);

      knockoutStage?.style.setProperty(
        "--marquee-mask-stops",
        stops.join(", "),
      );
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
        // The knockout layer mirrors this one word-for-word, so a shared index
        // keeps both copies in the same opacity state as they scroll.
        const knockout = wordsIn(knockoutStageRef.current);

        if (previousIndex >= 0) {
          words[previousIndex]?.removeAttribute("data-active");
          knockout[previousIndex]?.removeAttribute("data-active");
        }

        words[activeIndex]?.setAttribute("data-active", "true");
        knockout[activeIndex]?.setAttribute("data-active", "true");
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

  const photos = (keyPrefix: string, decorative = false) =>
    visibleItems.map(({ word, image }, index) => (
      <div className="home-marquee__photo" key={`${keyPrefix}-${word}-${index}`}>
        <Image
          src={image.src}
          alt={decorative ? "" : image.alt}
          fill
          sizes="(min-width: 1024px) 373px, (min-width: 640px) 33vw, 297px"
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
        <div ref={photoStageRef} className="home-marquee__gallery-stage">
          <div className="home-marquee__gallery-track">
            {photos("photo")}
          </div>
          <div
            className="home-marquee__gallery-track"
            data-loop="true"
            aria-hidden="true"
          >
            {photos("photo-loop", true)}
          </div>
        </div>
      </div>

      {/* Knockout copy of the word band, clipped to the photo box so the
          headline reads dark on cream and white over the photo. It must mirror
          the band above exactly to stay registered with it while scrolling. */}
      <div
        className="home-marquee__words-viewport home-marquee__words-viewport--invert"
        aria-hidden="true"
      >
        <div ref={knockoutStageRef} className="home-marquee__words-stage">
          <div className="home-marquee__words-track">{words("knockout")}</div>
          <div className="home-marquee__words-track">
            {words("knockout-loop")}
          </div>
        </div>
      </div>
    </Section>
  );
}
