import Image from "next/image";

import RichText from "@/components/RichText";
import type { CaseStudyMediaSrc } from "@/components/works/caseStudyDefaults";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

type CaseStudyTextSectionProps = Readonly<{
  title: string;
  content: SerializedEditorState;
  images?: CaseStudyMediaSrc[];
  className?: string;
}>;

export default function CaseStudyTextSection({
  title,
  content,
  images,
  className = "",
}: CaseStudyTextSectionProps) {
  return (
    <section className={`case-study-section ${className}`.trim()}>
      <div className="case-study-section__inner">
        <div className="case-study-section__content">
          <h2 className="case-study-section__title">{title}</h2>
          <div className="case-study-section__body">
            <RichText content={content} className="case-study-rich-text" />
          </div>
        </div>

        {images && images.length > 0 ? (
          <div className="case-study-section__images">
            {images.map((image) => (
              <figure key={image.src} className="case-study-section__figure">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="case-study-section__figure-image"
                />
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
