import Image from "next/image";

import type { AboutMediaSrc } from "@/components/about/defaults";

type AboutMeetFounderProps = Readonly<{
  headline: string;
  name: string;
  photos: AboutMediaSrc[];
}>;

export default function AboutMeetFounder({ headline, name, photos }: AboutMeetFounderProps) {
  return (
    <section className="about-meet">
      <div className="about-meet__inner">
        <header className="about-meet__header">
          <p className="about-meet__eyebrow">{headline}</p>
          <h2 className="about-meet__name">{name}</h2>
        </header>

        <div className="about-meet__collage" aria-label="Founder photo collage">
          {photos.slice(0, 3).map((photo, index) => (
            <div key={photo.src} className={`about-meet__photo about-meet__photo--${index + 1}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 85vw, 325px"
                className="about-meet__image"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
