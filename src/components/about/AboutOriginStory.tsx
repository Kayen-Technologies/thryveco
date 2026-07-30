import Image from "next/image";

import type { AboutMediaSrc } from "@/components/about/defaults";
import Reveal from "@/components/motion/Reveal";

type AboutOriginStoryProps = Readonly<{
  headlineLead: string;
  headlineMuted: string;
  headlineEnd: string;
  paragraphOne: string;
  paragraphTwo: string;
  image: AboutMediaSrc;
}>;

export default function AboutOriginStory({
  headlineLead,
  headlineMuted,
  headlineEnd,
  paragraphOne,
  paragraphTwo,
  image,
}: AboutOriginStoryProps) {
  return (
    <section className="about-origin">
      <div className="about-origin__inner">
        <Reveal>
          <h2 className="about-origin__headline">
            <span>{headlineLead}</span>
            <span className="about-origin__headline-muted">{headlineMuted}</span>
            <span>{headlineEnd}</span>
          </h2>
        </Reveal>

        <div className="about-origin__grid">
          <Reveal className="about-origin__portrait" y={40} delay={0.08}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 90vw, 593px"
              className="about-origin__portrait-image"
            />
          </Reveal>
          <Reveal className="about-origin__copy" stagger y={28} delay={0.12}>
            <p data-reveal>{paragraphOne}</p>
            <p data-reveal>{paragraphTwo}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
