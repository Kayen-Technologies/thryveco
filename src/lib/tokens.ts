export const colors = {
  primary:      "#6B0F1A",
  primaryDark:  "#3D0710",
  accent:       "#C9A96E",
  accentDark:   "#A8854A",
  blush:        "#E8C4C0",
  sage:         "#7A8B6A",
  bg:           "#F5EFE0",
  bgSurface:    "#FFFFFF",
  bgWarm:       "#FCFAF7",
  text:         "#1A1A1A",
  textMuted:    "#929292",
  textOnDark:   "#FCFAF7",
} as const;

export const fonts = {
  heading:    "'Playfair Display', Georgia, serif",
  body:       "'Open Sans', system-ui, sans-serif",
  decorative: "'Pinyon Script', cursive",
} as const;

export const typography = {
  hero:    "clamp(2.75rem, 8vw, 6.25rem)",
  section: "clamp(2rem, 4vw, 2.5rem)",
  quote:   "clamp(2.5rem, 6vw, 5.5rem)",
  marquee: "clamp(2.5rem, 12vw, 12.5rem)",
  body:    "1rem",
  lead:    "1.25rem",
  leadingSection: 1.15,
} as const;

export const spacing = {
  containerX: "56px",
  containerXMobile: "24px",
  sectionY: "130px",
  navHeight: "130px",
} as const;

export const radii = {
  none: "0",
  circle: "100px",
  pill: "100px",
  card: "12px",
  input: "8px",
} as const;

export const motion = {
  easeOutExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  fast:   "150ms",
  base:   "300ms",
  slow:   "600ms",
} as const;
