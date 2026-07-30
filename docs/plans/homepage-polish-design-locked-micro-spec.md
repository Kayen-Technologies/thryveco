# Homepage Polish — Design Locked Micro-Spec

Authority for implement → sweep → QA. Homepage (`/`) only.

## GOAL

Improve perceived craft of the existing homepage without changing Figma layout, typography, spacing, copy, or section structure. Leave hero video assets and playback approach untouched.

## INPUTS/OUTPUTS

**In:** Existing home sections (`HomeMarquee`, `TestimonialCarousel`, `FeaturedWorkBand` / `FeaturedWorkSection`, `Reveal`, `globals.css` home styles), GSAP already installed.

**Out:**
1. Marquee: pause on hover **and** focus-within; pause when off-screen; reduced-motion remains static
2. Testimonials: header Reveal; keyboard ←/→; touch swipe; mobile gets a short center-card fade instead of a hard cut
3. Featured bands: one-shot footer content reveal on enter (identity / tags / CTA); keep existing hover image scale
4. No visual redesign — same nodes, same composition
5. This authority doc

## CONSTRAINTS

- Design locked: no new sections, overlays, logos, metrics, copy edits, or layout grid changes
- Do **not** compress or replace `hero.mp4` / change HomeHero video behavior
- No new npm deps; reuse GSAP + CSS
- `prefers-reduced-motion: reduce` → no marquee scroll, no carousel tween, no featured footer motion, no hover transform
- Kill/revert GSAP contexts on unmount
- Preserve Phase A/B/C motions already shipped

## EDGE CASES

1. Marquee: ResizeObserver shift sync must keep working when paused/resumed
2. Testimonials: ignore swipe/keyboard while a desktop stage animation is in flight
3. Testimonials: single item → no controls / no swipe handlers needed
4. Featured footer Reveal must not break desktop CSS grid (animate existing children, do not wrap grid in a breaking flex container)
5. Touch devices: featured hover is no-op (existing); swipe owns carousel

## ACCEPTANCE TESTS

1. Marquee pauses on hover and when tab-focus lands inside the section; resumes on leave
2. Marquee not animating while fully off-screen (class or play-state)
3. Reduced motion: marquee static; carousel instant; featured footer visible without tween
4. Desktop testimonials: arrow buttons + keyboard arrows advance with existing card choreography
5. Mobile testimonials: swipe or buttons fade/swap center card without blanking layout
6. Featured band footer fades/rises once as each band enters viewport; hover scale still works on desktop
7. Build/typecheck green; hero video unchanged

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/homepage-polish-design-locked-micro-spec.md` | This authority |
| `src/components/home/HomeMarquee.tsx` | Off-screen pause; a11y focus target if needed |
| `src/components/home/TestimonialCarousel.tsx` | Reveal header, keyboard, swipe, mobile fade |
| `src/components/home/FeaturedWorkBand.tsx` | Client + footer enter reveal |
| `src/app/(site)/globals.css` | Marquee focus/off-screen pause; mobile testimonial fade |

## NON-GOALS

- Hero video compression or poster changes
- Proof overlays, logo strips, process sections, copy rewrites
- Magnetic cursor, pinning, page transitions
- Studio / other pages
- Changing testimonial card layout or marquee Figma mask composition
