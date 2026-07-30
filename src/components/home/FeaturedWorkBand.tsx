"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import type { HomeMediaSrc } from "@/components/home/defaults";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type FeaturedWorkItem = {
  slug: string;
  href?: string;
  name: string;
  category: string;
  tags: string[];
  image: HomeMediaSrc;
};

export default function FeaturedWorkBand({
  slug,
  href,
  name,
  category,
  tags,
  image,
}: FeaturedWorkItem) {
  const bandRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const targets = band.querySelectorAll<HTMLElement>("[data-band-reveal]");
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
          trigger: band,
          start: "top 72%",
          once: true,
        },
      });
    }, band);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <article ref={bandRef} className="featured-work-band">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="featured-work-band__image"
      />
      <div className="featured-work-band__overlay" aria-hidden="true" />
      <div className="featured-work-band__footer">
        <div className="featured-work-band__identity" data-band-reveal>
          <p className="featured-work-band__name">{name}</p>
          {category ? (
            <p className="featured-work-band__category">{category}</p>
          ) : null}
        </div>
        {tags.length > 0 ? (
          <ul className="featured-work-band__tags" data-band-reveal>
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
        <Link
          href={href ?? `/works/${slug}`}
          className="featured-work-band__cta"
          data-band-reveal
        >
          View Case Study
        </Link>
      </div>
    </article>
  );
}
