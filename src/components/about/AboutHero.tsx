import Image from "next/image";

import type { AboutMediaSrc } from "@/components/about/defaults";

type AboutHeroProps = Readonly<{
  headline: string;
  tagline?: string | null;
  image: AboutMediaSrc;
}>;

export default function AboutHero({ headline, tagline, image }: AboutHeroProps) {
  return (
    <section className="about-hero">
      <div className="about-hero__media" aria-hidden="true">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="about-hero__image"
        />
      </div>
      <div className="about-hero__overlay" aria-hidden="true" />
      <div className="about-hero__layout">
        <div className="about-hero__nav-spacer" aria-hidden="true" />
        <div className="about-hero__content">
          <h1 className="about-hero__headline">{headline}</h1>
          {tagline ? <p className="about-hero__tagline">{tagline}</p> : null}
        </div>
      </div>
    </section>
  );
}
