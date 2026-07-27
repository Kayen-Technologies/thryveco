import Image from "next/image";
import Link from "next/link";

import type { WorksMediaSrc } from "./defaults";

type WorksCaseStudyCardProps = Readonly<{
  slug: string;
  client: string;
  industry?: string;
  tags?: readonly string[];
  coverImage: WorksMediaSrc;
}>;

export default function WorksCaseStudyCard({
  slug,
  client,
  industry,
  tags = [],
  coverImage,
}: WorksCaseStudyCardProps) {
  return (
    <Link href={`/works/${slug}`} className="works-case-study-card">
      <Image
        src={coverImage.src}
        alt={coverImage.alt}
        fill
        sizes="100vw"
        className="works-case-study-card__image"
      />
      <div className="works-case-study-card__overlay" aria-hidden="true" />

      <div className="works-case-study-card__footer">
        <div className="works-case-study-card__identity">
          <p className="works-case-study-card__client">{client}</p>
          {industry ? (
            <p className="works-case-study-card__industry">{industry}</p>
          ) : null}
        </div>

        {tags.length > 0 ? (
          <ul className="works-case-study-card__tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}

        <span className="works-case-study-card__link">View Case Study</span>
      </div>
    </Link>
  );
}
