import Image from "next/image";
import Link from "next/link";

import type { JournalArticleBlock } from "@/components/journal/articleDefaults";

type JournalArticleBodyProps = Readonly<{
  blocks: JournalArticleBlock[];
}>;

export default function JournalArticleBody({ blocks }: JournalArticleBodyProps) {
  return (
    <div className="journal-article-body">
      {blocks.map((block, index) => {
        if (block.type === "paragraphs") {
          return (
            <div key={`paragraphs-${index}`} className="journal-article-body__paragraphs">
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph} className="journal-article-body__paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          );
        }

        if (block.type === "headingGroup") {
          return (
            <section key={`heading-${block.heading}`} className="journal-article-body__section">
              <h2 className="journal-article-body__heading">{block.heading}</h2>
              <div className="journal-article-body__paragraphs">
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="journal-article-body__paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={block.image.src} className="journal-article-body__figure">
              <div className="journal-article-body__figure-media">
                <Image
                  src={block.image.src}
                  alt={block.image.alt}
                  fill
                  sizes="(min-width: 1024px) 920px, 100vw"
                  className="journal-article-body__figure-image"
                />
              </div>
            </figure>
          );
        }

        if (block.type === "imageGrid") {
          return (
            <div
              key={`grid-${index}`}
              className="journal-article-body__image-grid"
              data-columns={block.columns}
            >
              {block.images.map((image) => (
                <figure key={image.src} className="journal-article-body__grid-figure">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={920}
                    height={470}
                    sizes={`(min-width: 1024px) ${Math.floor(920 / Number(block.columns))}px, ${Math.floor(100 / Number(block.columns))}vw`}
                    className="journal-article-body__grid-image"
                  />
                </figure>
              ))}
            </div>
          );
        }

        if (block.type === "closingCta") {
          return (
            <section key="closing-cta" className="journal-article-body__cta">
              <p className="journal-article-body__cta-copy">
                <span>{block.lead}</span>
                <span className="journal-article-body__cta-muted">{block.muted}</span>
                <span>{block.end}</span>
              </p>
              <Link href={block.ctaHref} className="journal-article-body__cta-button">
                {block.ctaLabel}
              </Link>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
