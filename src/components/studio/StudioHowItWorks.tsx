"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import type { StudioMediaSrc } from "@/components/studio/defaults";
import Reveal from "@/components/motion/Reveal";

type StudioStep = {
  step: number;
  title: string;
  description: string;
  image: StudioMediaSrc;
};

type StudioHowItWorksProps = Readonly<{
  title: string;
  steps: readonly StudioStep[];
}>;

const COPY_FADE_MS = 400;

export default function StudioHowItWorks({ title, steps }: StudioHowItWorksProps) {
  const sortedSteps = [...steps].sort((a, b) => a.step - b.step);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copyIndex, setCopyIndex] = useState(0);
  const [copyVisible, setCopyVisible] = useState(true);
  const fadeTimerRef = useRef<number | null>(null);
  const stepsRef = useRef<HTMLDivElement | null>(null);
  const copyStep = sortedSteps[copyIndex] ?? sortedSteps[0];

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
      }
    };
  }, []);

  if (!copyStep) return null;

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The mobile strip is narrower than the six pills, so centre the chosen one
  // to keep its neighbours reachable. No-ops wherever the row already fits.
  const centreStepInView = (index: number) => {
    const strip = stepsRef.current;
    if (!strip || strip.scrollWidth <= strip.clientWidth + 1) return;

    const pill = strip.querySelector<HTMLButtonElement>(`#studio-how-tab-${index}`);
    if (!pill) return;

    const stripBox = strip.getBoundingClientRect();
    const pillBox = pill.getBoundingClientRect();
    const target =
      strip.scrollLeft + (pillBox.left - stripBox.left) - (strip.clientWidth - pillBox.width) / 2;

    strip.scrollTo({
      left: Math.max(0, Math.min(target, strip.scrollWidth - strip.clientWidth)),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const selectStep = (index: number) => {
    if (index < 0 || index >= sortedSteps.length) return;
    centreStepInView(index);
    if (index === activeIndex && index === copyIndex && copyVisible) return;

    setActiveIndex(index);

    if (prefersReducedMotion()) {
      if (fadeTimerRef.current !== null) {
        window.clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
      setCopyIndex(index);
      setCopyVisible(true);
      return;
    }

    setCopyVisible(false);
    if (fadeTimerRef.current !== null) {
      window.clearTimeout(fadeTimerRef.current);
    }
    fadeTimerRef.current = window.setTimeout(() => {
      setCopyIndex(index);
      setCopyVisible(true);
      fadeTimerRef.current = null;
    }, COPY_FADE_MS);
  };

  const onTabListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (sortedSteps.length < 2) return;

    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (activeIndex + 1) % sortedSteps.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (activeIndex - 1 + sortedSteps.length) % sortedSteps.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = sortedSteps.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    selectStep(nextIndex);
    const nextTab = event.currentTarget.querySelector<HTMLButtonElement>(
      `#studio-how-tab-${nextIndex}`,
    );
    // selectStep already centred it; native focus scrolling would fight that.
    nextTab?.focus({ preventScroll: true });
  };

  return (
    <section className="studio-how">
      <div className="studio-how__inner">
        <Reveal className="studio-how__title-wrap" start="top 90%">
          <h2 className="studio-how__title">{title}</h2>
        </Reveal>

        <Reveal className="studio-how__layout" stagger y={28} start="top 85%">
          <div className="studio-how__panel" data-reveal>
            <div
              className={`studio-how__copy${copyVisible ? "" : " studio-how__copy--fading"}`}
              aria-live="polite"
            >
              <h3 className="studio-how__step-title">{copyStep.title}</h3>
              <p className="studio-how__step-description">{copyStep.description}</p>
            </div>
          </div>

          <div
            className="studio-how__media"
            data-reveal
            role="tabpanel"
            id={`studio-how-panel-${activeIndex}`}
            aria-labelledby={`studio-how-tab-${activeIndex}`}
          >
            {sortedSteps.map((step, index) => (
              <Image
                key={step.step}
                src={step.image.src}
                alt={step.image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className={`studio-how__image${index === activeIndex ? " studio-how__image--active" : ""}`}
                style={{
                  opacity: index === activeIndex ? 1 : 0,
                  transition: "opacity 0.4s ease-in-out",
                }}
                priority={index === 0}
              />
            ))}
          </div>

          {/* Sibling of the media because the mobile design puts the step
              numbers under the photo; desktop grid-places them back inside the
              burgundy panel. */}
          <div
            ref={stepsRef}
            className="studio-how__steps"
            role="tablist"
            aria-label="How it works steps"
            onKeyDown={onTabListKeyDown}
            data-reveal
          >
            {sortedSteps.map((step, index) => (
              <button
                key={step.step}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-controls={`studio-how-panel-${index}`}
                id={`studio-how-tab-${index}`}
                tabIndex={index === activeIndex ? 0 : -1}
                className={`studio-how__step-pill${
                  index === activeIndex ? " studio-how__step-pill--active" : ""
                }`}
                onClick={() => selectStep(index)}
              >
                {step.step}
              </button>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
