type CaseStudyQuoteProps = Readonly<{
  quote: string;
  attribution: string;
}>;

export default function CaseStudyQuote({ quote, attribution }: CaseStudyQuoteProps) {
  return (
    <section className="case-study-quote" aria-label="Client testimonial">
      <p className="case-study-quote__watermark" aria-hidden="true">
        &
      </p>
      <blockquote className="case-study-quote__inner">
        <p className="case-study-quote__text">&ldquo;{quote}&rdquo;</p>
        <cite className="case-study-quote__attribution">{attribution}</cite>
      </blockquote>
    </section>
  );
}
