# Homepage Motion — Phase C Micro-Spec

Authority for implement → sweep → QA. Builds on Phase A/B (`homepage-motion-phase-ab-micro-spec.md`). Homepage (`/`) only.

## GOAL

Add two closing-beat motions: (1) quote-band decorative `&` drifts slowly with scroll, (2) Final CTA background gets a restrained ken-burns scale while the section is in view. Keep editorial restraint; respect `prefers-reduced-motion`.

## INPUTS/OUTPUTS

**In:** `QuoteBand`, `FinalCta`, GSAP + ScrollTrigger, existing Reveal on those sections, `.quote-band__watermark` / `.final-cta__bg*` CSS.

**Out:**
1. Quote watermark scrubbed y (+ slight opacity) while section crosses viewport
2. Final CTA bg wrapper scales ~1 → 1.06 scrubbed (ken-burns), without breaking Figma crop
3. CSS wrappers so GSAP transforms do not fight layout centering / cover crop
4. Reduced-motion: no scrub / no ken-burns
5. This authority doc

## CONSTRAINTS

- No new deps; reuse GSAP
- Watermark drift ≤ ~40–60px; opacity stay readable (~0.08–0.14 equivalent feel)
- Ken-burns scale ≤ 1.06; scrub only (no endless CSS loop)
- Do not pin Final CTA or Quote
- Do not animate quote text word-by-word
- Kill/revert GSAP contexts on unmount
- Preserve Phase A/B reveals

## EDGE CASES

1. CSS centering transform on watermark vs GSAP — animate inner node only
2. Final CTA desktop `width: 145%` image crop — scale a motion wrapper, not the Image’s layout hacks directly if conflict
3. `overflow-clip` on `<main>` — triggers on section roots
4. Reduced motion mid-session — skip init / leave static
5. Mobile short viewports — scrub still ok, shorter travel

## ACCEPTANCE TESTS

1. Scrolling through Quote: `&` drifts slowly; quote/attribution still reveal as before
2. Scrolling through Final CTA: background gently zooms; frame copy still staggers in
3. Reduced motion: watermark and bg static at resting styles
4. No layout jump / broken CTA frame mask alignment
5. Build/typecheck green

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/homepage-motion-phase-c-micro-spec.md` | This authority |
| `src/components/home/QuoteBand.tsx` | Client + watermark scrub |
| `src/components/home/FinalCta.tsx` | Client + ken-burns wrapper |
| `src/app/(site)/globals.css` | Motion wrapper + reduced-motion |

## NON-GOALS

- Magnetic cursor, pinning, page transitions
- Marquee/testimonial redesign
- Other pages
- Compressing hero video
