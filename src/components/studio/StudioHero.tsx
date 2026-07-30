import Image from "next/image";

import type { StudioMediaSrc } from "@/components/studio/defaults";

type StudioHeroProps = Readonly<{
  headline: string;
  tagline?: string | null;
  image: StudioMediaSrc;
}>;

export default function StudioHero({ headline, tagline, image }: StudioHeroProps) {
  return (
    <section className="studio-hero">
      <div className="studio-hero__media" aria-hidden="true">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="studio-hero__image"
        />
      </div>
      <div className="studio-hero__overlay" aria-hidden="true" />
      <div className="studio-hero__layout">
        <div className="studio-hero__nav-spacer" aria-hidden="true" />
        <div className="studio-hero__stage">
          <div className="studio-hero__copy">
            <h1 className="studio-hero__headline">{headline}</h1>
            {tagline ? <p className="studio-hero__tagline">{tagline}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
