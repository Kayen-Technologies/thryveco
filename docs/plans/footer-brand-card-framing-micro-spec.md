# Footer Brand Card Framing — Micro-Spec

Authority for implement → sweep → QA. Figma footer `285:1471` / card `285:1420`. Designer note: increase height so paper text (“YOUR BRAND'S…”) is visible.

## GOAL

Show the full brand-card copy in the footer image by (1) taller card frame than 295×196 and (2) object-position matching Figma’s crop (not top-biased 18%). Refresh asset + Payload media linked on Site Settings.

## CONSTRAINTS

CSS on `.site-footer__brand-card*`; optional media upsert migration. No footer layout rewrite.

## ACCEPTANCE

Footer brand card shows “YOUR BRAND'S / NEW / best friend” without clipping; width stays ~295px desktop.
