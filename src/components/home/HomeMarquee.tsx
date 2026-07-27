"use client";

import Image from "next/image";
import { useEffect, useRef, type RefObject } from "react";

import Section from "@/components/Section";
import type { HomeMediaSrc } from "@/components/home/defaults";

type HomeMarqueeProps = Readonly<{
  primaryWord: string;
  secondaryWord: string;
  image: HomeMediaSrc;
  maskSrc?: string;
}>;

type MarqueeSegmentProps = {
  primaryWord: string;
  secondaryWord: string;
  variant: "primary" | "overlay" | "secondary" | "secondary-overlay";
  ariaHidden?: boolean;
  className?: string;
  segmentRef?: RefObject<HTMLDivElement | null>;
};

function MarqueeTextSegment({
  primaryWord,
  secondaryWord,
  variant,
  ariaHidden = false,
  className = "",
  segmentRef,
}: MarqueeSegmentProps) {
  return (
    <div
      ref={segmentRef}
      className={`home-marquee__segment ${className}`.trim()}
      aria-hidden={ariaHidden || undefined}
    >
      <div className="home-marquee__primary-slot">
        {variant !== "secondary" && variant !== "secondary-overlay" && (
          <p
            className={
              variant === "overlay"
                ? "home-marquee__word home-marquee__word--overlay"
                : "home-marquee__word home-marquee__word--base"
            }
          >
            {primaryWord}
          </p>
        )}
      </div>

      {variant === "primary" ? (
        <span className="home-marquee__secondary-slot" aria-hidden="true">
          {secondaryWord}
        </span>
      ) : variant === "secondary" ? (
        <p className="home-marquee__word home-marquee__word--secondary">{secondaryWord}</p>
      ) : variant === "secondary-overlay" ? (
        <p className="home-marquee__word home-marquee__word--secondary home-marquee__word--secondary--overlay">
          {secondaryWord}
        </p>
      ) : (
        <span className="home-marquee__secondary-slot" aria-hidden="true">
          {secondaryWord}
        </span>
      )}
    </div>
  );
}

export default function HomeMarquee({
  primaryWord,
  secondaryWord,
  image,
}: HomeMarqueeProps) {
  const segmentRef = useRef<HTMLDivElement>(null);
  const baseStageRef = useRef<HTMLDivElement>(null);
  const overlayStageRef = useRef<HTMLDivElement>(null);
  const secondaryStageRef = useRef<HTMLDivElement>(null);
  const secondaryOverlayStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const segment = segmentRef.current;
    const baseStage = baseStageRef.current;
    const overlayStage = overlayStageRef.current;
    const secondaryStage = secondaryStageRef.current;
    const secondaryOverlayStage = secondaryOverlayStageRef.current;
    if (!segment || !baseStage || !overlayStage || !secondaryStage || !secondaryOverlayStage) return;

    const syncShift = () => {
      const shift = `${segment.offsetWidth}px`;
      baseStage.style.setProperty("--marquee-shift", shift);
      overlayStage.style.setProperty("--marquee-shift", shift);
      secondaryStage.style.setProperty("--marquee-shift", shift);
      secondaryOverlayStage.style.setProperty("--marquee-shift", shift);
    };

    syncShift();

    const observer = new ResizeObserver(syncShift);
    observer.observe(segment);

    return () => observer.disconnect();
  }, [primaryWord, secondaryWord]);

  const segmentContent = { primaryWord, secondaryWord };

  return (
    <Section
      tone="cream"
      padded={false}
      className="home-marquee marquee-container relative overflow-hidden"
    >
      <div className="home-marquee__viewport">
        <div className="home-marquee__photo-static" aria-hidden="true">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="297px"
            className="object-cover"
          />
        </div>

        <div
          ref={baseStageRef}
          className="home-marquee__stage home-marquee__stage--base home-marquee__stage--animated"
        >
          <MarqueeTextSegment {...segmentContent} variant="primary" segmentRef={segmentRef} />
          <MarqueeTextSegment
            {...segmentContent}
            variant="primary"
            ariaHidden
            className="home-marquee-duplicate"
          />
        </div>

        <div className="home-marquee__overlay-mask" aria-hidden="true">
          <div
            ref={overlayStageRef}
            className="home-marquee__stage home-marquee__stage--animated"
          >
            <MarqueeTextSegment {...segmentContent} variant="overlay" />
            <MarqueeTextSegment
              {...segmentContent}
              variant="overlay"
              ariaHidden
              className="home-marquee-duplicate"
            />
          </div>
          <div
            ref={secondaryOverlayStageRef}
            className="home-marquee__stage home-marquee__stage--animated"
          >
            <MarqueeTextSegment {...segmentContent} variant="secondary-overlay" />
            <MarqueeTextSegment
              {...segmentContent}
              variant="secondary-overlay"
              ariaHidden
              className="home-marquee-duplicate"
            />
          </div>
        </div>

        <div className="home-marquee__secondary-layer" aria-hidden="true">
          <div
            ref={secondaryStageRef}
            className="home-marquee__stage home-marquee__stage--secondary home-marquee__stage--animated"
          >
            <MarqueeTextSegment {...segmentContent} variant="secondary" />
            <MarqueeTextSegment
              {...segmentContent}
              variant="secondary"
              ariaHidden
              className="home-marquee-duplicate"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
