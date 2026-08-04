# Studio Hero Viewport Fill + Image — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `165:83`.

**[Certain]** Desktop locks `.studio-hero__layout` to `nav + 770px` and section height to `--hero-height` (900px). Stage measures ~770px — does not fill the viewport. Desktop also uses a Figma crop hack (`height: 240%; top: -96.65%`) for the old hero asset.

## GOAL

1. Studio hero fills the first viewport (`100svh` / `100dvh`) like the homepage hero.
2. Replace hero image with Figma `165:83` asset (desk / “STRATEGY FIRST. ALWAYS.” scene).
3. Headline + tagline remain bottom-left, legible over overlay; nav still overlays.

## CONSTRAINTS

- Scope height on `.studio-hero` (do not change global `--hero-height` for other pages that still use it).
- Remove negative `margin-top` under absolute nav — with `100dvh` it shortens the visible hero (same bug as homepage).
- Drop desktop `770px` row and `240%` image offset; use normal `object-fit: cover` + tuned `object-position`.
- Align tagline punctuation to Figma: period after “standard.”
- Refresh `public/assets/studio/studio-hero.jpg` + Payload media via migration.
- No Navbar / services / how-it-works changes.

## ACCEPTANCE

1. Desktop 1440×900 (and taller): `.studio-hero` height ≈ `window.innerHeight`; no strip of next section on first paint.
2. Stage fills remaining space under nav spacer (not fixed 770px).
3. New hero photo visible (hands, laptop, headphones, strategy paper).
4. Headline + tagline in viewport, overlaid; reduced-motion still skips entrance tween.

## NON-GOALS

Pixel-matching Figma’s 900/770 artboard on tall monitors; copy rewrite beyond Figma punctuation; video hero.
