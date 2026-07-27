import Image from "next/image";

import type { AboutMediaSrc } from "@/components/about/defaults";

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
        <h2 className="about-origin__headline">
          <span>{headlineLead}</span>
          <span className="about-origin__headline-muted">{headlineMuted}</span>
          <span>{headlineEnd}</span>
        </h2>

        <div className="about-origin__grid">
          <div className="about-origin__portrait">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 90vw, 593px"
              className="about-origin__portrait-image"
            />
          </div>
          <div className="about-origin__copy">
            <p>{paragraphOne}</p>
            <p>{paragraphTwo}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
