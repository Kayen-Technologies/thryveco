import Image from "next/image";

import type { AboutMediaSrc } from "@/components/about/defaults";

type AboutWhatThryveProps = Readonly<{
  intro: string;
  agencyCopy: string;
  aspirationCopy: string;
  image: AboutMediaSrc;
  underlineSrc: string;
}>;

export default function AboutWhatThryve({
  intro,
  agencyCopy,
  aspirationCopy,
  image,
  underlineSrc,
}: AboutWhatThryveProps) {
  return (
    <section className="about-what">
      <div className="about-what__inner">
        <header className="about-what__title-block">
          <h2 className="about-what__title">
            <span>What</span>
            <span className="about-what__title-word">
              Thryve
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={underlineSrc} alt="" aria-hidden="true" className="about-what__underline" />
            </span>
            <span>Means</span>
          </h2>
        </header>

        <p className="about-what__intro">{intro}</p>

        <div className="about-what__lower">
          <p className="about-what__aspiration">{aspirationCopy}</p>

          <div className="about-what__right">
            <p className="about-what__agency">{agencyCopy}</p>
            <div className="about-what__image-wrap">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 500px"
                className="about-what__image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
