import type { ReactNode } from "react";

export type TypographyVariant =
  | "hero"
  | "section"
  | "quote"
  | "marquee"
  | "body"
  | "lead"
  | "decorative";

export type TypographyProps = Readonly<{
  as?: keyof HTMLElementTagNameMap;
  variant: TypographyVariant;
  className?: string;
  children: ReactNode;
}>;

const defaultElements: Record<TypographyVariant, keyof HTMLElementTagNameMap> = {
  hero: "h1",
  section: "h2",
  quote: "blockquote",
  marquee: "p",
  body: "p",
  lead: "p",
  decorative: "span",
};

const variantClassNames: Record<TypographyVariant, string> = {
  hero:
    "font-heading text-[length:var(--text-hero)] font-medium leading-[1.1]",
  section:
    "font-heading text-[length:var(--text-section)] font-normal leading-[var(--leading-section)]",
  quote:
    "font-heading text-[length:var(--text-quote)] font-normal italic leading-[1.15]",
  marquee:
    "font-heading text-[length:var(--text-marquee)] font-medium italic leading-none",
  body: "font-body text-[length:var(--text-body)] leading-[1.6]",
  lead: "font-body text-[length:var(--text-lead)]",
  decorative: "font-decorative",
};

export default function Typography({
  as,
  variant,
  className = "",
  children,
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];
  const classes = `${variantClassNames[variant]} ${className}`.trim();

  return <Component className={classes}>{children}</Component>;
}
