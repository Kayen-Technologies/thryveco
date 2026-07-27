import Image from "next/image";
import Link from "next/link";

import type { HomeMediaSrc } from "@/components/home/defaults";

export type FeaturedWorkItem = {
  slug: string;
  href?: string;
  name: string;
  category: string;
  tags: string[];
  image: HomeMediaSrc;
};

export default function FeaturedWorkBand({
  slug,
  href,
  name,
  category,
  tags,
  image,
}: FeaturedWorkItem) {
  return (
    <article className="featured-work-band">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="featured-work-band__image"
      />
      <div className="featured-work-band__overlay" aria-hidden="true" />
      <div className="featured-work-band__footer">
        <div className="featured-work-band__identity">
          <p className="featured-work-band__name">{name}</p>
          {category ? (
            <p className="featured-work-band__category">{category}</p>
          ) : null}
        </div>
        {tags.length > 0 ? (
          <ul className="featured-work-band__tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
        <Link
          href={href ?? `/works/${slug}`}
          className="featured-work-band__cta"
        >
          View Case Study
        </Link>
      </div>
    </article>
  );
}
