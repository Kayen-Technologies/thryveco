"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

import type { WorksMediaSrc } from "./defaults";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type WorksCaseStudyCardProps = Readonly<{
  slug: string;
  client: string;
  industry?: string;
  tags?: readonly string[];
  coverImage: WorksMediaSrc;
}>;

export default function WorksCaseStudyCard({
  slug,
  client,
  industry,
  tags = [],
  coverImage,
}: WorksCaseStudyCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = card.querySelectorAll<HTMLElement>("[data-works-card-reveal]");
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 24, force3D: true });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 72%",
          once: true,
        },
      });
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <Link ref={cardRef} href={`/works/${slug}`} className="works-case-study-card">
      <Image
        src={coverImage.src}
        alt={coverImage.alt}
        fill
        sizes="100vw"
        className="works-case-study-card__image"
      />
      <div className="works-case-study-card__overlay" aria-hidden="true" />

      <div className="works-case-study-card__footer">
        <div className="works-case-study-card__identity" data-works-card-reveal>
          <p className="works-case-study-card__client">{client}</p>
          {industry ? (
            <p className="works-case-study-card__industry">{industry}</p>
          ) : null}
        </div>

        {tags.length > 0 ? (
          <ul className="works-case-study-card__tags" data-works-card-reveal>
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}

        <span className="works-case-study-card__link" data-works-card-reveal>
          View Case Study
        </span>
      </div>
    </Link>
  );
}
