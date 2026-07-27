import type { ReactNode } from "react";

export type SectionTone = "cream" | "primary" | "surface" | "none";

export type SectionProps = Readonly<{
  as?: "section" | "div" | "header" | "footer";
  tone?: SectionTone;
  padded?: boolean;
  className?: string;
  children: ReactNode;
}>;

const toneClassNames: Record<SectionTone, string> = {
  cream: "bg-cream-section",
  primary: "bg-primary-section",
  surface: "bg-surface-section",
  none: "",
};

export default function Section({
  as: Component = "section",
  tone = "none",
  padded = true,
  className = "",
  children,
}: SectionProps) {
  const classes = [padded ? "section-y" : "", toneClassNames[tone], className]
    .filter(Boolean)
    .join(" ");

  return <Component className={classes}>{children}</Component>;
}
