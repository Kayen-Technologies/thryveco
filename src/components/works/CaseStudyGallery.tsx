import Image from "next/image";

import type { CaseStudyMediaSrc } from "@/components/works/caseStudyDefaults";

type CaseStudyGalleryProps = Readonly<{
  images: CaseStudyMediaSrc[];
}>;

export default function CaseStudyGallery({ images }: CaseStudyGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className="case-study-gallery">
      <div className="case-study-gallery__inner">
        <h2 className="case-study-gallery__title">The Work</h2>
        <div className="case-study-gallery__grid">
          {images.map((image) => (
            <figure key={image.src} className="case-study-gallery__figure">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="case-study-gallery__image"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
