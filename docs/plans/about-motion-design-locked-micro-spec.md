# About Page Motion — Design Locked Micro-Spec

Authority for implement → sweep → QA. About (`/about`) only. Design locked.

## GOAL

Bring About to the same craft level as the homepage motion language: hero entrance, Meet Founder collage reveal + subtle hover, origin/what reveals, founder-quote watermark scrub. No layout, copy, or section structure changes. Shared `FinalCta` already animated — leave alone.

## INPUTS/OUTPUTS

**In:** `AboutHero`, `AboutMeetFounder`, `AboutOriginStory`, `AboutFounderQuote`, `AboutWhatThryve`, shared `Reveal`, GSAP + ScrollTrigger, existing About BEM in `globals.css`.

**Out:**
1. Hero: headline → tagline stagger; optional one-shot media scale settle (wrapper, not layout hacks)
2. Meet Founder: header Reveal; collage photos stagger in; desktop hover scale on photo image
3. Origin: headline + portrait/copy Reveals
4. Founder quote: inner `&` scrub (Home QuoteBand pattern) + quote/attribution Reveal
5. What Thryve: title/intro/lower Reveals; one-shot underline draw (scaleX)
6. Reduced-motion respected everywhere
7. This authority doc

## CONSTRAINTS

- Design locked: no new sections, no copy edits, no grid/spacing/typography changes
- Reuse `Reveal` + GSAP; no new deps
- Editorial: y ≤ 40px, duration ~0.7–1s, ease `power2.out`, stagger ≤ 0.14s
- Collage hover scale ≤ 1.04; `hover: hover` only
- Quote watermark drift ≤ ~40–60px (match Home)
- Kill/revert GSAP contexts on unmount
- Do not change `FinalCta` or homepage files except shared `Reveal` if untouched

## EDGE CASES

1. About hero desktop image absolute hacks — scale a media wrapper, not the Image’s forced top/height
2. Quote mark CSS centering transform vs GSAP — animate inner motion node only
3. Collage mobile stacked layout — stagger still ok; hover no-op on touch
4. Underline SVG — animate CSS transform on `.about-what__underline`, not path morph
5. Reduced motion: static visible state for all of the above

## ACCEPTANCE TESTS

1. `/about` hero: headline then tagline fade/rise once on load
2. Meet Founder: name/eyebrow reveal; photos stagger; desktop photo hover scales image
3. Origin + What Thryve: content reveals on scroll; underline draws once
4. Quote: `&` drifts on scrub; quote text reveals
5. Reduced motion: all static / visible; no scrub
6. Build/typecheck green; Figma composition unchanged; Home/Studio untouched beyond shared FinalCta already used

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/about-motion-design-locked-micro-spec.md` | This authority |
| `src/components/about/AboutHero.tsx` | Client + stagger + media settle |
| `src/components/about/AboutMeetFounder.tsx` | Client + Reveal + collage stagger/hover hooks |
| `src/components/about/AboutOriginStory.tsx` | Reveal wrappers |
| `src/components/about/AboutFounderQuote.tsx` | Client + scrub + Reveal |
| `src/components/about/AboutWhatThryve.tsx` | Client + Reveal + underline |
| `src/app/(site)/globals.css` | Motion wrappers, collage hover, underline, reduced-motion |

## NON-GOALS

- Redesign, new proof blocks, video hero
- Magnetic cursor, pinning, page transitions
- Home/Studio scope expansion
- CMS/schema/copy changes
