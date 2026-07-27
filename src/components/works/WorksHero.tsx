import Image from "next/image";

import { WORKS_DEFAULTS, type WorksMediaSrc } from "./defaults";

type WorksHeroProps = Readonly<{
  headline?: string;
  subheadline?: string;
  heroImage?: WorksMediaSrc;
}>;

export default function WorksHero({
  headline = WORKS_DEFAULTS.hero.headline,
  subheadline = WORKS_DEFAULTS.hero.subheadline,
  heroImage = WORKS_DEFAULTS.hero.heroImage,
}: WorksHeroProps) {
  return (
    <section className="works-hero" aria-labelledby="works-hero-heading">
      <div className="works-hero__inner">
        <div className="works-hero__content">
          <h1 id="works-hero-heading" className="works-hero__headline">
            {headline}
          </h1>
          <p className="works-hero__subheadline">{subheadline}</p>
        </div>

        <div className="works-hero__media" aria-hidden="true">
          <Image
            src={heroImage.src}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 64vw, 100vw"
            className="works-hero__image"
          />
        </div>
      </div>
    </section>
  );
}
