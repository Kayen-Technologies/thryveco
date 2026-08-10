"use client";

import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import Button from "@/components/Button";
import Reveal from "@/components/motion/Reveal";
import type { StudioServiceDefault } from "@/components/studio/defaults";
import StudioServiceStack from "@/components/studio/StudioServiceStack";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type StudioServicesProps = Readonly<{
  sectionTitle: string;
  services: StudioServiceDefault[];
  underlineSrc: string;
  bulletSrc: string;
}>;

function ServicePanel({
  service,
  underlineSrc,
  bulletSrc,
}: Readonly<{
  service: StudioServiceDefault;
  underlineSrc: string;
  bulletSrc: string;
}>) {
  return (
    <>
      <StudioServiceStack images={service.stackImages} />

      <div className="studio-services__display-title-wrap" data-reveal>
        <p className="studio-services__display-title">
          <span>{service.displayTitlePrefix}</span>
          <span className="studio-services__display-title-accent">{service.displayTitleAccent}</span>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={underlineSrc} alt="" aria-hidden="true" className="studio-services__underline" />
      </div>

      <p className="studio-services__description" data-reveal>
        {service.description}
      </p>

      <div className="studio-services__includes" data-reveal>
        <p className="studio-services__includes-heading">What&apos;s included</p>
        <ul className="studio-services__includes-list">
          {service.includes.map((item) => (
            <li key={item} className="studio-services__includes-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bulletSrc} alt="" aria-hidden="true" className="studio-services__bullet" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="studio-services__cta-wrap" data-reveal>
        <Button href={service.ctaHref} variant="primary" className="studio-services__cta">
          {service.ctaLabel}
        </Button>
      </div>
    </>
  );
}

export default function StudioServices({
  sectionTitle,
  services,
  underlineSrc,
  bulletSrc,
}: StudioServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const gsapContextRef = useRef<gsap.Context | null>(null);
  const scrollTriggerIdRef = useRef<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const killGsap = useCallback(() => {
    if (scrollTriggerIdRef.current) {
      const trigger = ScrollTrigger.getById(scrollTriggerIdRef.current);
      if (trigger) {
        trigger.kill();
      }
      scrollTriggerIdRef.current = null;
    }
    if (gsapContextRef.current) {
      gsapContextRef.current.revert();
      gsapContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const shouldEnable = !motionMq.matches;
      if (!shouldEnable) {
        killGsap();
      }
      setScrollEnabled(shouldEnable);
    };

    update();
    motionMq.addEventListener("change", update);

    return () => {
      motionMq.removeEventListener("change", update);
      killGsap();
    };
  }, [killGsap]);

  useLayoutEffect(() => {
    if (!scrollEnabled || !sectionRef.current || !trackRef.current || !frameRef.current || services.length < 2) {
      return;
    }

    const panels = panelsRef.current.filter((panel): panel is HTMLDivElement => panel !== null);
    if (panels.length !== services.length) return;

    const frame = frameRef.current;
    const section = sectionRef.current;
    const triggerId = `studio-services-${Date.now()}`;

    const initAnimation = () => {
      if (!document.body.contains(frame)) return;

      gsapContextRef.current = gsap.context(() => {
        panels.forEach((panel, index) => {
          const imageStack = panel.querySelector(".studio-services__stack");
          const textContent = panel.querySelector(".studio-services__display-title-wrap");
          const description = panel.querySelector(".studio-services__description");
          const includes = panel.querySelector(".studio-services__includes");
          const cta = panel.querySelector(".studio-services__cta-wrap");

          gsap.set(panel, {
            opacity: index === 0 ? 1 : 0,
            zIndex: index === 0 ? 10 : 1,
            pointerEvents: index === 0 ? "auto" : "none",
          });

          if (imageStack) {
            gsap.set(imageStack, {
              scale: index === 0 ? 1 : 0.92,
              y: index === 0 ? 0 : 60,
            });

            const layers = imageStack.querySelectorAll(".studio-services__stack-layer");
            layers.forEach((layer, layerIndex) => {
              const depthMultiplier = 1 - layerIndex * 0.25;
              gsap.set(layer, {
                y: index === 0 ? 0 : 24 * depthMultiplier,
                force3D: true,
              });
            });
          }

          [textContent, description, includes, cta].forEach((el, elIndex) => {
            if (el) {
              gsap.set(el, {
                opacity: index === 0 ? 1 : 0,
                y: index === 0 ? 0 : 30 + elIndex * 8,
              });
            }
          });
        });

        // One frame of scroll per service transition; pinSpacing owns track length.
        // Avoid aggressive snap — it was skipping 01→04 on modest wheel deltas.
        // Measuring the frame (not innerHeight) keeps the distance in step with a
        // svh-based height when a mobile address bar shows or hides.
        const scrollPerService = () => frame.offsetHeight || window.innerHeight;

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: triggerId,
            trigger: frame,
            start: "top top",
            end: () => `+=${scrollPerService() * (services.length - 1)}`,
            pin: true,
            pinSpacing: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                services.length - 1,
                Math.max(0, Math.round(self.progress * (services.length - 1))),
              );
              setActiveIndex(idx);
              // Hit-testing follows the panel the viewer is actually looking at.
              // Tweening pointerEvents inside the scrub instead left every
              // resting position mid-transition with no interactive panel, so
              // the button ignored taps unless a segment had fully settled.
              panels.forEach((panel, i) => {
                gsap.set(panel, {
                  zIndex: i === idx ? 10 : 1,
                  pointerEvents: i === idx ? "auto" : "none",
                });
              });
            },
          },
        });

        scrollTriggerIdRef.current = triggerId;

        for (let index = 0; index < services.length - 1; index += 1) {
          const currentPanel = panels[index];
          const nextPanel = panels[index + 1];
          const currentStack = currentPanel.querySelector(".studio-services__stack");
          const nextStack = nextPanel.querySelector(".studio-services__stack");
          const currentTextElements = [
            currentPanel.querySelector(".studio-services__display-title-wrap"),
            currentPanel.querySelector(".studio-services__description"),
            currentPanel.querySelector(".studio-services__includes"),
            currentPanel.querySelector(".studio-services__cta-wrap"),
          ].filter(Boolean);
          const nextTextElements = [
            nextPanel.querySelector(".studio-services__display-title-wrap"),
            nextPanel.querySelector(".studio-services__description"),
            nextPanel.querySelector(".studio-services__includes"),
            nextPanel.querySelector(".studio-services__cta-wrap"),
          ].filter(Boolean);

          const segmentStart = index;
          const segmentDuration = 1;

          timeline.to(
            currentPanel,
            { opacity: 0, duration: segmentDuration * 0.6 },
            segmentStart,
          );

          if (currentStack) {
            timeline.to(
              currentStack,
              { scale: 0.92, y: -40, duration: segmentDuration * 0.7 },
              segmentStart,
            );

            const currentLayers = currentStack.querySelectorAll(".studio-services__stack-layer");
            currentLayers.forEach((layer, layerIndex) => {
              const depthMultiplier = 1 - layerIndex * 0.25;
              timeline.to(
                layer,
                { y: -24 * depthMultiplier, duration: segmentDuration * 0.6 },
                segmentStart,
              );
            });
          }

          currentTextElements.forEach((el, elIdx) => {
            timeline.to(
              el,
              { opacity: 0, y: -20 - elIdx * 4, duration: segmentDuration * 0.5 },
              segmentStart + elIdx * 0.03,
            );
          });

          timeline.to(
            nextPanel,
            { opacity: 1, duration: segmentDuration * 0.6 },
            segmentStart + segmentDuration * 0.35,
          );

          if (nextStack) {
            timeline.to(
              nextStack,
              { scale: 1, y: 0, duration: segmentDuration * 0.7 },
              segmentStart + segmentDuration * 0.3,
            );

            const nextLayers = nextStack.querySelectorAll(".studio-services__stack-layer");
            nextLayers.forEach((layer) => {
              timeline.to(
                layer,
                { y: 0, duration: segmentDuration * 0.7 },
                segmentStart + segmentDuration * 0.3,
              );
            });
          }

          nextTextElements.forEach((el, elIdx) => {
            timeline.to(
              el,
              { opacity: 1, y: 0, duration: segmentDuration * 0.5 },
              segmentStart + segmentDuration * 0.4 + elIdx * 0.04,
            );
          });
        }
      }, section);
    };

    const frameId = requestAnimationFrame(() => {
      initAnimation();
    });

    return () => {
      cancelAnimationFrame(frameId);
      killGsap();
    };
  }, [scrollEnabled, services, killGsap]);

  if (!scrollEnabled) {
    return (
      <section className="studio-services studio-services--static" ref={sectionRef}>
        <Reveal className="studio-services__static-intro">
          <h2 className="studio-services__title">{sectionTitle}</h2>
        </Reveal>

        {services.map((service) => (
          <article key={service.serviceLabel} className="studio-services__static-item">
            <p className="studio-services__label">{service.serviceLabel}</p>
            <Reveal className="studio-services__static-stage" stagger y={28} start="top 85%">
              <ServicePanel service={service} underlineSrc={underlineSrc} bulletSrc={bulletSrc} />
            </Reveal>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section
      className="studio-services studio-services--scroll"
      ref={sectionRef}
      style={{ "--studio-service-count": services.length } as CSSProperties}
    >
      <div className="studio-services__track" ref={trackRef}>
        <div className="studio-services__frame" ref={frameRef}>
          <header className="studio-services__header">
            <Reveal>
              <h2 className="studio-services__title">{sectionTitle}</h2>
            </Reveal>
            <p className="studio-services__label" aria-live="polite">
              {services[activeIndex]?.serviceLabel}
            </p>
          </header>

          <div className="studio-services__stage">
            {services.map((service, index) => (
              <div
                key={service.serviceLabel}
                ref={(element) => {
                  panelsRef.current[index] = element;
                }}
                className="studio-services__panel"
                aria-hidden={index !== activeIndex}
                id={`studio-service-panel-${index}`}
              >
                <ServicePanel service={service} underlineSrc={underlineSrc} bulletSrc={bulletSrc} />
              </div>
            ))}
          </div>

          <div className="studio-services__progress" aria-hidden="true">
            {services.map((service, index) => (
              <span
                key={service.serviceLabel}
                className={`studio-services__progress-dot${
                  index === activeIndex ? " studio-services__progress-dot--active" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
