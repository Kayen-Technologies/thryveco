# Studio Motion — Design Locked Micro-Spec

Authority for implement → sweep → QA. Scope: `/studio` only. Design locked.

## GOAL

Close craft gaps around Studio’s existing services scroll set piece: hero entrance parity, How it Works interaction polish (copy crossfade + keyboard), and a light services section-title reveal. Do **not** rewrite the Four Services scrub timeline. Leave shared `FinalCta` alone.

## INPUTS/OUTPUTS

**In:** `StudioHero`, `StudioServices`, `StudioHowItWorks`, shared `Reveal`, GSAP, existing Studio BEM.

**Out:**
1. Hero: headline → tagline stagger; media wrapper scale settle
2. How it Works: title Reveal; copy fades on step change; ←/→ (and Home/End) on tablist; image fade retained; reduced-motion instant
3. Services: section title one-shot Reveal (static + scroll layouts); scrub timeline untouched
4. Reduced-motion respected
5. This authority doc

## CONSTRAINTS

- Design locked: no layout/copy/CMS/schema changes
- Do not alter services pin/scrub/snap logic beyond title reveal wrapper
- Reuse `Reveal` + GSAP; no new deps
- Copy fade ≤ ~200ms; hero matches About/Works timing language
- Kill/revert GSAP contexts on unmount
- FinalCta unchanged

## EDGE CASES

1. Studio hero desktop image absolute hacks — scale media wrapper only
2. How it Works: ignore rapid step clicks while copy fade in flight (or queue last index)
3. Single step → no keyboard cycling needed beyond no-op
4. Services static (mobile / reduced-motion) and scroll layouts both get title reveal
5. Reduced motion: hero static; how-it-works instant swap; no title tween if Reveal skips

## ACCEPTANCE TESTS

1. `/studio` hero: headline then tagline enter; media settles
2. How it Works: title reveals; clicking pills fades copy then shows new step; image still crossfades; arrows change steps when tablist focused
3. Services section title reveals once; desktop scrub still works as before
4. Reduced motion: all content visible; how-it-works swaps instantly; services scrub disabled as today
5. Build/typecheck green; FinalCta and other pages untouched

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/studio-motion-design-locked-micro-spec.md` | This authority |
| `src/components/studio/StudioHero.tsx` | Client + stagger + media settle |
| `src/components/studio/StudioHowItWorks.tsx` | Reveal, copy fade, keyboard |
| `src/components/studio/StudioServices.tsx` | Title Reveal only |
| `src/app/(site)/globals.css` | Media motion wrapper, copy fade, reduced-motion |

## NON-GOALS

- Rewriting services ScrollTrigger timeline
- New sections, process redesign, pinning changes
- Magnetic cursor / page transitions
- Other pages
