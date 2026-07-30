"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, type ReactNode } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type RevealProps = Readonly<{
  children: ReactNode;
  className?: string;
  /** Animate `[data-reveal]` descendants instead of the root. */
  stagger?: boolean;
  y?: number;
  delay?: number;
  /** ScrollTrigger start. Default "top 88%". */
  start?: string;
}>;

export default function Reveal({
  children,
  className,
  stagger = false,
  y = 32,
  delay = 0,
  start = "top 88%",
}: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const targets = stagger
      ? Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
      : [root];

    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y, force3D: true });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        delay,
        stagger: stagger ? 0.1 : 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start,
          once: true,
        },
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [stagger, y, delay, start]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
