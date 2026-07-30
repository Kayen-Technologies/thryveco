"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import JournalEntryCard, {
  type JournalEntryCardData,
} from "@/components/journal/JournalEntryCard";
import Reveal from "@/components/motion/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type JournalEntriesSectionProps = Readonly<{
  title: string;
  entries: JournalEntryCardData[];
}>;

export default function JournalEntriesSection({
  title,
  entries,
}: JournalEntriesSectionProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || entries.length === 0) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const cards = grid.querySelectorAll<HTMLElement>(".journal-entry-card");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0, y: 32, force3D: true });

      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          once: true,
        },
      });
    }, grid);

    return () => {
      ctx.revert();
    };
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <section className="journal-entries" aria-labelledby="journal-entries-heading">
      <div className="journal-entries__inner">
        <Reveal>
          <h2 id="journal-entries-heading" className="journal-entries__title">
            {title}
          </h2>
        </Reveal>

        <div ref={gridRef} className="journal-entries__grid">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
