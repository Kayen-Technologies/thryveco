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

      <div className="studio-services__display-title-wrap">
        <p className="studio-services__display-title">
          <span>{service.displayTitlePrefix}</span>
          <span className="studio-services__display-title-accent">{service.displayTitleAccent}</span>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={underlineSrc} alt="" aria-hidden="true" className="studio-services__underline" />
      </div>

      <p className="studio-services__description">{service.description}</p>

      <div className="studio-services__includes">
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

      <div className="studio-services__cta-wrap">
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
    const desktopMq = window.matchMedia("(min-width: 1024px)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      const shouldEnable = desktopMq.matches && !motionMq.matches;
      if (!shouldEnable) {
        killGsap();
      }
      setScrollEnabled(shouldEnable);
    };

    update();
    desktopMq.addEventListener("change", update);
    motionMq.addEventListener("change", update);

    return () => {
      desktopMq.removeEventListener("change", update);
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

    const track = trackRef.current;
    const frame = frameRef.current;
    const section = sectionRef.current;
    const triggerId = `studio-services-${Date.now()}`;

    const initAnimation = () => {
      if (!document.body.contains(track)) return;

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

        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          scrollTrigger: {
            id: triggerId,
            trigger: track,
            start: "top top",
            end: () => `+=${window.innerHeight * 0.85 * (services.length - 1)}`,
            pin: frame,
            pinSpacing: true,
            scrub: 0.8,
            snap: {
              snapTo: 1 / (services.length - 1),
              duration: { min: 0.4, max: 0.8 },
              delay: 0.1,
              ease: "power2.inOut",
            },
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                services.length - 1,
                Math.max(0, Math.round(self.progress * (services.length - 1))),
              );
              setActiveIndex(idx);
              panels.forEach((panel, i) => {
                gsap.set(panel, { zIndex: i === idx ? 10 : 1 });
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
            { opacity: 0, pointerEvents: "none", duration: segmentDuration * 0.6 },
            segmentStart,
          );

          if (currentStack) {
            timeline.to(
              currentStack,
              { scale: 0.92, y: -40, duration: segmentDuration * 0.7 },
              segmentStart,
            );
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
            { opacity: 1, pointerEvents: "auto", duration: segmentDuration * 0.6 },
            segmentStart + segmentDuration * 0.35,
          );

          if (nextStack) {
            timeline.to(
              nextStack,
              { scale: 1, y: 0, duration: segmentDuration * 0.7 },
              segmentStart + segmentDuration * 0.3,
            );
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
            <div className="studio-services__static-stage">
              <ServicePanel service={service} underlineSrc={underlineSrc} bulletSrc={bulletSrc} />
            </div>
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
