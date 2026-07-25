export const colors = {
  primary:      "#6B0F1A",
  primaryDark:  "#3D0710",
  accent:       "#C9A96E",
  accentDark:   "#A8854A",
  bg:           "#F5EFE0",
  bgSurface:    "#FFFFFF",
  bgWarm:       "#FCFAF7",
  text:         "#1C1B1A",
  textMuted:    "#929292",
  textOnDark:   "#FCFAF7",
} as const;

export const fonts = {
  heading:    "'Playfair Display', Georgia, serif",
  body:       "'Open Sans', system-ui, sans-serif",
  decorative: "'Pinyon Script', cursive",
} as const;

export const motion = {
  easeOutExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
  fast:   "150ms",
  base:   "300ms",
  slow:   "600ms",
} as const;
