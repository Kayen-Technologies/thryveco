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

type FeaturedWorkBandProps = FeaturedWorkItem & {
  variant?: "full" | "compact";
};

export default function FeaturedWorkBand({
  slug,
  href,
  name,
  category,
  tags,
  image,
  variant = "full",
}: FeaturedWorkBandProps) {
  const bandRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const band = bandRef.current;
    if (!band) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const targets = band.querySelectorAll<HTMLElement>("[data-band-reveal]");
    const tagTargets = band.querySelectorAll<HTMLElement>("[data-tag-reveal]");
    const imageEl = imageRef.current;

    const ctx = gsap.context(() => {
      if (imageEl) {
        gsap.set(imageEl, { scale: 1.08, force3D: true });
        gsap.to(imageEl, {
          scale: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: band,
            start: "top 80%",
            once: true,
          },
        });
      }

      if (targets.length > 0) {
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
      }

      if (tagTargets.length > 0) {
        gsap.set(tagTargets, { opacity: 0, y: 12, force3D: true });

        gsap.to(tagTargets, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: band,
            start: "top 72%",
            once: true,
          },
        });
      }
    }, band);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <article
      ref={bandRef}
      className={`featured-work-band${variant === "compact" ? " featured-work-band--compact" : ""}`}
    >
      {/* The whole card is the link, so tapping the image opens the case study.
          The visible label below is decorative text, not a nested anchor. */}
      <Link
        href={href ?? `/works/${slug}`}
        className="featured-work-band__link"
        aria-label={`${name} case study`}
      >
        <div ref={imageRef} className="featured-work-band__image-wrap">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="featured-work-band__image"
          />
        </div>
        <div className="featured-work-band__overlay" aria-hidden="true" />
        <div className="featured-work-band__footer">
          <div className="featured-work-band__identity" data-band-reveal>
            <p className="featured-work-band__name">{name}</p>
            {category ? (
              <p className="featured-work-band__category">{category}</p>
            ) : null}
          </div>
          {tags.length > 0 ? (
            <ul className="featured-work-band__tags">
              {tags.map((tag) => (
                <li key={tag} data-tag-reveal>
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
          <span className="featured-work-band__cta" data-band-reveal>
            View Case Study
          </span>
        </div>
      </Link>
    </article>
  );
}
