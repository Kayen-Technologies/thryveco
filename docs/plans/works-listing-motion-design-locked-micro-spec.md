# Works Listing Motion — Design-Locked Micro-Spec

Authority for architect → implement → sweep → QA. Scope: `/works` listing only.

## GOAL

Bring the Works listing to the same restrained motion standard as Home, About, and Journal without changing its Figma composition, content, spacing, typography, or section structure.

## INPUTS / OUTPUTS

**Inputs:** `WorksHero`, portfolio heading, `WorksCaseStudyCard`, `WorksCta`, shared `Reveal`, GSAP + ScrollTrigger, and existing Works BEM styles.

**Outputs:**
1. Hero headline/subheadline stagger and one-shot media scale settle
2. Portfolio title reveal
3. Each full-bleed case-study footer reveals once on entry
4. Desktop card hover/focus scales the image, deepens the overlay, and lifts the CTA
5. Works CTA background scrubs from scale 1 to 1.06 while its existing frame content reveals
6. Reduced-motion users receive static, fully visible content

## CONSTRAINTS

- Listing only; do not touch `/works/[slug]`
- No layout, copy, CMS, schema, spacing, or typography changes
- No new dependencies; reuse GSAP and `Reveal`
- Entrance travel ≤ 32px; durations approximately 0.8–1s; stagger ≤ 0.12s
- Hover scale ≤ 1.04; CTA ken-burns scale ≤ 1.06
- Preserve existing image crop and CTA mask alignment
- Revert all GSAP contexts on unmount

## EDGE CASES

1. CTA desktop image uses a 145% crop: scale an inner motion wrapper, not the image’s crop rules
2. Card footer is a responsive flex/grid: animate existing children without adding layout-breaking wrappers
3. Touch devices have no hover; entry reveals still provide motion
4. Reduced motion skips GSAP initialization and removes CSS hover transforms
5. Missing industry or tags must not leave invalid reveal targets

## ACCEPTANCE TESTS

1. Hero headline and subheadline enter once; hero media settles without crop or layout shift
2. Portfolio title reveals once
3. Every case-study footer reveals in reading order as its band enters
4. Desktop hover/focus scales image to approximately 1.04, darkens overlay, and lifts CTA
5. Works CTA background reaches a scale between 1 and 1.06 while scrolling; frame content remains aligned
6. Reduced motion leaves all content visible and static
7. Typecheck/build pass; `/works/[slug]` files remain untouched

## FILE TOUCH LIST

- `docs/plans/works-listing-motion-design-locked-micro-spec.md`
- `src/app/(site)/works/page.tsx`
- `src/components/works/WorksHero.tsx`
- `src/components/works/WorksCaseStudyCard.tsx`
- `src/components/works/WorksCta.tsx`
- `src/app/(site)/globals.css`

## NON-GOALS

- Case-study detail-page motion
- New filters, proof overlays, metrics, or content
- Pinning, magnetic cursor, particles, or page transitions
- Changes to Home, About, Journal, or Studio behavior
