type AboutFounderQuoteProps = Readonly<{
  quote: string;
  attribution?: string | null;
}>;

export default function AboutFounderQuote({ quote, attribution }: AboutFounderQuoteProps) {
  return (
    <section className="about-quote">
      <span className="about-quote__mark" aria-hidden="true">
        &amp;
      </span>
      <div className="about-quote__inner">
        <figure className="about-quote__figure">
          <blockquote className="about-quote__text">
            &#8220;{quote}&#8221;
          </blockquote>
          {attribution ? (
            <figcaption className="about-quote__attribution">{attribution}</figcaption>
          ) : null}
        </figure>
      </div>
    </section>
  );
}
