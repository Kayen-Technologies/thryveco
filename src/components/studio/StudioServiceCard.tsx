import Image from "next/image";

import Button from "@/components/Button";
import type { StudioServiceDefault } from "@/components/studio/defaults";
import StudioServiceDisclosure from "@/components/studio/StudioServiceDisclosure";

type StudioServiceCardProps = Readonly<{
  service: StudioServiceDefault;
  sectionTitle: string;
  underlineSrc: string;
  bulletSrc: string;
  index: number;
  /* Pinned mode renders the title and label once in the shared header, where
     they already sit at the position every Figma frame draws them. */
  showHeading?: boolean;
}>;

export default function StudioServiceCard({
  service,
  sectionTitle,
  underlineSrc,
  bulletSrc,
  index,
  showHeading = true,
}: StudioServiceCardProps) {
  const heroImage = service.stackImages[0];
  const isFirst = index === 0;
  const disclosureGroup = `studio-service-disclosure-${index}`;

  return (
    <article className="studio-services__card">
      {showHeading ? (
        <>
          {isFirst ? (
            <h2 className="studio-services__title">{sectionTitle}</h2>
          ) : (
            <p className="studio-services__title" aria-hidden="true">
              {sectionTitle}
            </p>
          )}
          <p className="studio-services__label">{service.serviceLabel}</p>
        </>
      ) : null}

      <div className="studio-services__display-title-wrap">
        <p className="studio-services__display-title">
          <span>{service.displayTitlePrefix}</span>
          <span className="studio-services__display-title-accent">{service.displayTitleAccent}</span>
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={underlineSrc} alt="" aria-hidden="true" className="studio-services__underline" />
      </div>

      {heroImage ? (
        <div className="studio-services__card-media">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            sizes="100vw"
            className="studio-services__card-image"
          />
        </div>
      ) : null}

      <Button href={service.ctaHref} variant="primary" className="studio-services__card-cta">
        {service.ctaLabel}
      </Button>

      <StudioServiceDisclosure label="Overview" group={disclosureGroup}>
        <p className="studio-services__card-description">{service.description}</p>
      </StudioServiceDisclosure>

      <StudioServiceDisclosure label="What's included" group={disclosureGroup}>
        <ul className="studio-services__includes-list">
          {service.includes.map((item) => (
            <li key={item} className="studio-services__includes-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bulletSrc} alt="" aria-hidden="true" className="studio-services__bullet" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </StudioServiceDisclosure>
    </article>
  );
}
