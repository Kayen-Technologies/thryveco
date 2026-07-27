import Image from "next/image";

import type { HomeMediaSrc } from "@/components/home/defaults";

type HomeHeroProps = Readonly<{
  headline: string;
  emphasis?: string | null;
  image: HomeMediaSrc;
}>;

export default function HomeHero({ headline, emphasis, image }: HomeHeroProps) {
  const emphasisIndex = emphasis ? headline.indexOf(emphasis) : -1;
  const hasEmphasis = Boolean(emphasis && emphasisIndex >= 0);

  return (
    <section className="home-hero">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="home-hero__image"
      />
      <div className="home-hero__overlay" aria-hidden="true" />
      <div className="home-hero__layout">
        <div className="home-hero__nav-spacer" aria-hidden="true" />
        <div className="home-hero__content">
          <h1 className="home-hero__headline">
            {hasEmphasis ? (
              <>
                {headline.slice(0, emphasisIndex)}
                <span className="home-hero__emphasis">{emphasis}</span>
                {headline.slice(emphasisIndex + emphasis!.length)}
              </>
            ) : (
              headline
            )}
          </h1>
        </div>
      </div>
    </section>
  );
}
