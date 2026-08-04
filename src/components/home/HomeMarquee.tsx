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

function MarqueeCluster({
  word,
  image,
  ariaHidden = false,
}: MarqueeItem & { ariaHidden?: boolean }) {
  return (
    <div className="home-marquee__cluster" aria-hidden={ariaHidden || undefined}>
      <div className="home-marquee__photo">
        <Image
          src={image.src}
          alt={ariaHidden ? "" : image.alt}
          fill
          sizes="297px"
          className="home-marquee__photo-img"
        />
      </div>
      <p className="home-marquee__word home-marquee__word--base">{word}</p>
      <div className="home-marquee__invert" aria-hidden="true">
        <p className="home-marquee__word home-marquee__word--overlay">{word}</p>
      </div>
    </div>
  );
}

export default function HomeMarquee({ items }: HomeMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage || items.length === 0) return;

    const syncShift = () => {
      stage.style.setProperty("--marquee-shift", `${track.offsetWidth}px`);
    };

    syncShift();
    const observer = new ResizeObserver(syncShift);
    observer.observe(track);
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const root = viewport?.closest(".home-marquee");
    if (!viewport || !(root instanceof HTMLElement)) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        root.classList.toggle("home-marquee--offscreen", !entry.isIntersecting);
      },
      { threshold: 0 },
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <Section
      tone="cream"
      padded={false}
      className="home-marquee marquee-container relative overflow-hidden"
    >
      <div ref={viewportRef} className="home-marquee__viewport">
        <div
          ref={stageRef}
          className="home-marquee__stage home-marquee__stage--animated"
        >
          <div ref={trackRef} className="home-marquee__track">
            {items.map((item) => (
              <MarqueeCluster key={`a-${item.word}`} {...item} />
            ))}
          </div>
          <div className="home-marquee__track" aria-hidden="true">
            {items.map((item) => (
              <MarqueeCluster key={`b-${item.word}`} {...item} ariaHidden />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
