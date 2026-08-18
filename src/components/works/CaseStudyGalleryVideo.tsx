"use client";

import { useEffect, useId, useRef, useState } from "react";

type CaseStudyGalleryVideoProps = Readonly<{
  src: string;
  /** Describes the clip so stacked toggles get distinguishable button names. */
  label?: string;
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
 * Module-scoped so tiles can enforce one-at-a-time audio between themselves.
 * The gallery that renders them is a server component, so there is no shared
 * client parent to hold this state.
 */
const muteHandlers = new Set<(unmutedId: string) => void>();

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M11 5 6.5 8.5H3.5v7h3L11 19V5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 9.5a3.5 3.5 0 0 1 0 5M17.5 7a7 7 0 0 1 0 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerMutedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M11 5 6.5 8.5H3.5v7h3L11 19V5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m15.5 9.5 5 5m0-5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Muted loop layered over a gallery still. The still underneath is the poster,
 * so this stays transparent until the first frame paints. These clips run to
 * tens of megabytes, so it renders nothing at all when the visitor asks for
 * reduced motion or has Data Saver on — they keep the still.
 *
 * Audio starts off because autoplay is only permitted while muted; the toggle
 * is the user gesture that may lift it.
 */
export default function CaseStudyGalleryVideo({ src, label }: CaseStudyGalleryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackAllowed, setPlaybackAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const instanceId = useId();

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

  useEffect(() => {
    if (!playbackAllowed) return;

    const handleOtherUnmuted = (unmutedId: string) => {
      if (unmutedId === instanceId) return;
      setMuted(true);
    };

    muteHandlers.add(handleOtherUnmuted);
    return () => {
      muteHandlers.delete(handleOtherUnmuted);
    };
  }, [instanceId, playbackAllowed]);

  // React does not reflect the muted attribute onto the element reliably, so
  // the property is the source of truth.
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted, playbackAllowed]);

  if (!playbackAllowed) return null;

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !muted;
    video.muted = nextMuted;
    setMuted(nextMuted);

    if (nextMuted) return;

    for (const handler of muteHandlers) handler(instanceId);
    // Whatever refused autoplay earlier, this click is a gesture that clears it.
    void video.play().catch(() => {});
  };

  const action = muted ? "Unmute" : "Mute";
  const soundLabel = label ? `${action} video: ${label}` : `${action} video`;

  return (
    <>
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

      <button
        type="button"
        className="case-study-gallery__sound"
        onClick={toggleSound}
        aria-label={soundLabel}
      >
        {muted ? <SpeakerMutedIcon /> : <SpeakerIcon />}
      </button>
    </>
  );
}
