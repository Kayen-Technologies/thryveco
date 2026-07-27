"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Typography from "@/components/Typography";

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

export default function TestimonialCarousel({
  headline,
  body,
  items,
}: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<-1 | 1 | null>(null);

  useEffect(() => {
    if (direction === null) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + direction + items.length) % items.length);
      setDirection(null);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [direction, items.length]);

  const move = (nextDirection: -1 | 1) => {
    if (direction !== null) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches
    ) {
      setActiveIndex((current) => (current + nextDirection + items.length) % items.length);
      return;
    }

    setDirection(nextDirection);
  };
  const itemAt = (offset: number) =>
    items[(activeIndex + offset + items.length) % items.length];
  const showSides = items.length > 1;
  let stageAnimationClass = "";
  if (direction === 1) stageAnimationClass = "home-testimonial-stage--next";
  if (direction === -1) stageAnimationClass = "home-testimonial-stage--previous";

  if (items.length === 0) return null;

  return (
    <Section
      tone="cream"
      padded={false}
      className="overflow-hidden py-20 md:min-h-255.5 md:py-[130px]"
    >
      <Container>
        {/* Section header — max-width 777px centered, Figma node 104:435 */}
          <div className="mx-auto flex max-w-194.25 flex-col items-center gap-6 text-center">
          <Typography
            variant="section"
            className="tracking-[1.12px]"
          >
            {headline}
          </Typography>
          <Typography variant="body" className="text-text-muted">
            {body}
          </Typography>
        </div>

        <section
          className="mt-10 outline-none"
          aria-label="Client testimonials"
        >
          <div
            aria-live="polite"
            aria-atomic="true"
            className={`home-testimonial-stage relative mx-auto min-h-96 ${stageAnimationClass}`}
          >
            {[-2, -1, 0, 1, 2].map((slot) => (
              <TestimonialCard
                key={`${itemAt(slot).name}-${itemAt(slot).role ?? ""}`}
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
                disabled={direction !== null}
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
                disabled={direction !== null}
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
