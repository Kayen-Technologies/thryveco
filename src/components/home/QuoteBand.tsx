import Container from "@/components/Container";
import Section from "@/components/Section";
import Typography from "@/components/Typography";

type QuoteBandProps = Readonly<{
  quote: string;
  attribution?: string | null;
}>;

export default function QuoteBand({ quote, attribution }: QuoteBandProps) {
  return (
    <Section
      tone="primary"
      padded={false}
      className="relative flex min-h-145 items-center overflow-hidden md:h-174"
    >
      {/* Decorative ampersand — Pinyon Script watermark behind the quote.
          Offset left 50px from center to compensate for the glyph's
          right-leaning visual weight, matching Figma node 78:119. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[calc(50%-50px)] top-1/2 -translate-x-1/2 translate-y-[-56%] select-none font-decorative text-[clamp(28rem,57vw,51.25rem)] leading-none text-[rgba(245,239,224,0.1)]"
      >
        &amp;
      </span>

      <Container className="relative z-10 w-full text-center">
        <figure className="mx-auto flex max-w-225 flex-col items-center gap-9">
          {/* Quote — Playfair Display italic, slight negative tracking (-0.44px
              at 88px ≈ -0.005em) to match Figma node 78:121 */}
          <Typography
            variant="quote"
            className="tracking-[-0.005em] text-(--color-text-on-dark)"
          >
            &#8220;{quote}&#8221;
          </Typography>

          {attribution && (
            /* Attribution — PP Editorial Old Italic in Figma, maps to
               font-heading italic (Playfair Display italic) in this project */
            <figcaption className="font-heading italic text-base tracking-widest text-[rgba(232,196,192,0.9)]">
              {attribution}
            </figcaption>
          )}
        </figure>
      </Container>
    </Section>
  );
}
