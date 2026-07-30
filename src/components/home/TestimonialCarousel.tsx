"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";

import Button from "@/components/Button";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Typography from "@/components/Typography";
import Reveal from "@/components/motion/Reveal";

export type Testimonial = {
  quote: string;
  name: string;
  role?: string | null;
};

type TestimonialCarouselProps = Readonly<{
  headline: string;
  body: string;
  items: Testimonial[];
}>;

function TestimonialCard({
  item,
  slot,
  className = "",
}: Readonly<{
  item: Testimonial;
  slot: number;
  className?: string;
}>) {
  return (
    <article
      data-slot={slot}
      aria-hidden={slot !== 0}
      className={`home-testimonial-card flex h-96 w-75.75 shrink-0 items-center rounded-[20px] bg-white px-10 py-8 text-center shadow-[0_14px_54px_rgba(240,229,211,0.6)] ${className}`}
    >
      <div className="flex w-full flex-col items-center gap-10">
        <p className="font-heading text-base leading-normal tracking-[0.02em]">
          &ldquo;{item.quote}&rdquo;
        </p>
        <div className="flex flex-col gap-2 font-body text-sm tracking-[0.02em]">
          <p>{item.name}</p>
          {item.role && (
            <p className="leading-[1.4] text-[rgba(94,94,94,0.8)]">{item.role}</p>
          )}
        </div>
      </div>
    </article>
  );
}

const MOBILE_FADE_MS = 160;
const DESKTOP_STAGE_MS = 700;
const SWIPE_THRESHOLD_PX = 48;

export default function TestimonialCarousel({
  headline,
  body,
  items,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<-1 | 1 | null>(null);
  const [centerHidden, setCenterHidden] = useState(false);
  const [mobileBusy, setMobileBusy] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLElement>(null);
  const moveRef = useRef<(nextDirection: -1 | 1) => void>(() => undefined);

  useEffect(() => {
    if (direction === null) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + direction + items.length) % items.length);
      setDirection(null);
    }, DESKTOP_STAGE_MS);

    return () => window.clearTimeout(timer);
  }, [direction, items.length]);

  const move = (nextDirection: -1 | 1) => {
    if (direction !== null || mobileBusy) return;
    if (items.length < 2) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex((current) => (current + nextDirection + items.length) % items.length);
      return;
    }

    if (window.matchMedia("(max-width: 767px)").matches) {
      setMobileBusy(true);
      setCenterHidden(true);
      window.setTimeout(() => {
        setActiveIndex((current) => (current + nextDirection + items.length) % items.length);
        setCenterHidden(false);
        window.setTimeout(() => setMobileBusy(false), MOBILE_FADE_MS);
      }, MOBILE_FADE_MS);
      return;
    }

    setDirection(nextDirection);
  };

  moveRef.current = move;

  useEffect(() => {
    const region = regionRef.current;
    if (!region || items.length < 2) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveRef.current(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveRef.current(1);
      }
    };

    region.addEventListener("keydown", onKeyDown);
    return () => region.removeEventListener("keydown", onKeyDown);
  }, [items.length]);

  const onTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null || items.length < 2) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

    move(delta < 0 ? 1 : -1);
  };

  const itemAt = (offset: number) =>
    items[(activeIndex + offset + items.length) % items.length];
  const showSides = items.length > 1;
  let stageAnimationClass = "";
  if (direction === 1) stageAnimationClass = "home-testimonial-stage--next";
  if (direction === -1) stageAnimationClass = "home-testimonial-stage--previous";
  if (centerHidden) stageAnimationClass = "home-testimonial-stage--center-hidden";

  if (items.length === 0) return null;

  return (
    <Section
      tone="cream"
      padded={false}
      className="overflow-hidden py-20 md:min-h-255.5 md:py-[130px]"
    >
      <Container>
        <Reveal
          className="mx-auto flex max-w-194.25 flex-col items-center gap-6 text-center"
          stagger
        >
          <div data-reveal>
            <Typography variant="section" className="tracking-[1.12px]">
              {headline}
            </Typography>
          </div>
          <div data-reveal>
            <Typography variant="body" className="text-text-muted">
              {body}
            </Typography>
          </div>
        </Reveal>

        <section
          ref={regionRef}
          className="mt-10 outline-none"
          aria-label="Client testimonials"
          tabIndex={0}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            aria-live="polite"
            aria-atomic="true"
            className={`home-testimonial-stage relative mx-auto min-h-96 ${stageAnimationClass}`}
          >
            {[-2, -1, 0, 1, 2].map((slot) => (
              <TestimonialCard
                key={`${itemAt(slot).name}-${itemAt(slot).role ?? ""}-${slot}`}
                item={itemAt(slot)}
                slot={slot}
                className={slot === 0 ? "max-w-[calc(100vw-48px)]" : ""}
              />
            ))}
          </div>

          {showSides && (
            <div className="mt-10 flex justify-center gap-4">
              <Button
                variant="icon"
                aria-label="Previous testimonial"
                disabled={direction !== null || mobileBusy}
                onClick={() => move(-1)}
              >
                <Image
                  src="/assets/home/arrow-left.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </Button>
              <Button
                variant="icon"
                aria-label="Next testimonial"
                disabled={direction !== null || mobileBusy}
                onClick={() => move(1)}
              >
                <Image
                  src="/assets/home/arrow-right.svg"
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </Button>
            </div>
          )}
        </section>
      </Container>
    </Section>
  );
}
