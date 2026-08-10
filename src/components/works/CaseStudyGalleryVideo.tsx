"use client";

import { useEffect, useRef, useState } from "react";

type CaseStudyGalleryVideoProps = Readonly<{
  src: string;
}>;

/** Not in lib.dom yet; Chromium-only, so every member is treated as optional. */
type NetworkInformation = {
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

function getConnection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

/**
 * Muted loop layered over a gallery still. The still underneath is the poster,
 * so this stays transparent until the first frame paints. These clips run to
 * tens of megabytes, so it renders nothing at all when the visitor asks for
 * reduced motion or has Data Saver on — they keep the still.
 */
export default function CaseStudyGalleryVideo({ src }: CaseStudyGalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackAllowed, setPlaybackAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = getConnection();
    const update = () => setPlaybackAllowed(!motionMq.matches && !connection?.saveData);

    update();
    motionMq.addEventListener("change", update);
    connection?.addEventListener?.("change", update);

    return () => {
      motionMq.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!playbackAllowed || !video) return;

    // Nothing downloads beyond metadata until the tile is actually on screen,
    // and playback stops again once it leaves.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            void video.play().catch(() => {
              // Autoplay can still be refused (low power mode); the still stays.
            });
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [playbackAllowed]);

  if (!playbackAllowed) return null;

  return (
    <video
      ref={videoRef}
      className="case-study-gallery__video"
      data-ready={ready ? "true" : undefined}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setReady(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
