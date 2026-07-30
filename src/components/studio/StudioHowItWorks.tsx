"use client";

import Image from "next/image";
import { useState } from "react";

import type { StudioMediaSrc } from "@/components/studio/defaults";

type StudioStep = {
  step: number;
  title: string;
  description: string;
  image: StudioMediaSrc;
};

type StudioHowItWorksProps = Readonly<{
  title: string;
  steps: readonly StudioStep[];
}>;

export default function StudioHowItWorks({ title, steps }: StudioHowItWorksProps) {
  const sortedSteps = [...steps].sort((a, b) => a.step - b.step);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = sortedSteps[activeIndex] ?? sortedSteps[0];

  if (!activeStep) return null;

  return (
    <section className="studio-how">
      <div className="studio-how__inner">
        <h2 className="studio-how__title">{title}</h2>

        <div className="studio-how__layout">
          <div className="studio-how__panel">
            <div className="studio-how__copy">
              <h3 className="studio-how__step-title">{activeStep.title}</h3>
              <p className="studio-how__step-description">{activeStep.description}</p>
            </div>

            <div className="studio-how__steps" role="tablist" aria-label="How it works steps">
              {sortedSteps.map((step, index) => (
                <button
                  key={step.step}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-controls={`studio-how-panel-${index}`}
                  id={`studio-how-tab-${index}`}
                  className={`studio-how__step-pill${index === activeIndex ? " studio-how__step-pill--active" : ""}`}
                  onClick={() => setActiveIndex(index)}
                >
                  {step.step}
                </button>
              ))}
            </div>
          </div>

          <div
            className="studio-how__media"
            role="tabpanel"
            id={`studio-how-panel-${activeIndex}`}
            aria-labelledby={`studio-how-tab-${activeIndex}`}
          >
            {sortedSteps.map((step, index) => (
              <Image
                key={step.step}
                src={step.image.src}
                alt={step.image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className={`studio-how__image${index === activeIndex ? " studio-how__image--active" : ""}`}
                style={{ opacity: index === activeIndex ? 1 : 0, transition: "opacity 0.4s ease-in-out" }}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
