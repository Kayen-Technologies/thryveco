"use client";

import Image from "next/image";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { HomeMediaSrc } from "@/components/home/defaults";

type HomeHeroProps = Readonly<{
  headline: string;
  emphasis?: string | null;
  image: HomeMediaSrc;
  videoSrc?: string | null;
}>;

export default function HomeHero({ headline, emphasis, image, videoSrc }: HomeHeroProps) {
  const emphasisIndex = emphasis ? headline.indexOf(emphasis) : -1;
  const hasEmphasis = Boolean(emphasis && emphasisIndex >= 0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!motionMq.matches);
    update();
    motionMq.addEventListener("change", update);
    return () => motionMq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !motionAllowed || !videoSrc) return;

    const play = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay can be blocked; poster/image remains visible underneath.
      }
    };

    void play();
  }, [motionAllowed, videoSrc]);

  useLayoutEffect(() => {
    const headlineEl = headlineRef.current;
    if (!headlineEl) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const parts = headlineEl.querySelectorAll<HTMLElement>("[data-hero-line]");
    const targets = parts.length > 0 ? Array.from(parts) : [headlineEl];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.18,
          ease: "power2.out",
          delay: 0.15,
        },
      );
    }, headlineEl);

    return () => {
      ctx.revert();
    };
  }, [headline, emphasis]);

  const showVideo = Boolean(videoSrc && motionAllowed);

  return (
    <section className="home-hero">
      {showVideo ? (
        <video
          ref={videoRef}
          className="home-hero__video"
          autoPlay
          muted
          loop
          playsInline
          poster={image.src}
          aria-hidden="true"
        >
          <source src={videoSrc!} type="video/mp4" />
        </video>
      ) : null}

      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className={`home-hero__image${showVideo ? " home-hero__image--under-video" : ""}`}
      />

      <div className="home-hero__overlay" aria-hidden="true" />
      <div className="home-hero__layout">
        <div className="home-hero__nav-spacer" aria-hidden="true" />
        <div className="home-hero__content">
          <h1 ref={headlineRef} className="home-hero__headline">
            {hasEmphasis ? (
              <>
                <span data-hero-line>{headline.slice(0, emphasisIndex)}</span>
                <span data-hero-line className="home-hero__emphasis">
                  {emphasis}
                </span>
                {headline.slice(emphasisIndex + emphasis!.length) ? (
                  <span data-hero-line>
                    {headline.slice(emphasisIndex + emphasis!.length)}
                  </span>
                ) : null}
              </>
            ) : (
              headline
            )}
          </h1>
        </div>
      </div>
    </section>
  );
}
