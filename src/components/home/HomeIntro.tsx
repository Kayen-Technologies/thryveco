import Image from "next/image";

import Button from "@/components/Button";
import Container from "@/components/Container";
import Section from "@/components/Section";
import type { HomeMediaSrc } from "@/components/home/defaults";
import Reveal from "@/components/motion/Reveal";

type HomeIntroProps = Readonly<{
  headline: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaHref: string;
  image: HomeMediaSrc;
}>;

export default function HomeIntro({
  headline,
  paragraphs,
  ctaLabel,
  ctaHref,
  image,
}: HomeIntroProps) {
  return (
    <Section tone="cream" padded={false} className="home-intro overflow-hidden">
      <Container>
        <div className="home-intro__grid">
          <Reveal className="home-intro__copy" stagger>
            <div className="home-intro__text" data-reveal>
              <h2 className="home-intro__headline">{headline}</h2>
              <div className="home-intro__body">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div data-reveal className="w-full md:w-auto">
              <Button href={ctaHref} variant="primary" className="w-full md:w-auto">
                {ctaLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal className="home-intro__media" y={40} delay={0.12}>
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1023px) 100vw, 541px"
              className="home-intro__image"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
