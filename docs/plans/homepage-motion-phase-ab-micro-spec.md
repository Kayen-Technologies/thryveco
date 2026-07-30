# Homepage Motion — Phase A + B Micro-Spec

Authority for implement → sweep → QA. Scope: homepage (`/`) only.

## GOAL

Make the homepage feel composed and alive through restrained editorial motion: shared scroll reveals, a one-shot hero title entrance, CTA hover polish, and featured-work image hover scale. Must respect `prefers-reduced-motion`.

## INPUTS/OUTPUTS

**In:** Existing home sections (`HomeHero`, `HomeIntro`, `FeaturedWorkSection`/`FeaturedWorkBand`, `QuoteBand`, `FinalCta`), GSAP 3.x already installed, `globals.css` BEM for home.

**Out:**
1. Reusable client `Reveal` primitive (GSAP ScrollTrigger) for fade + rise
2. Hero headline stagger entrance (prefix then italic emphasis)
3. Reveal wired on Intro, Featured intro copy, Quote, Final CTA
4. Featured work band image hover scale + slightly stronger CTA underline/opacity
5. Primary/inverse Button subtle hover lift (CSS)
6. This authority doc

## CONSTRAINTS

- No new npm deps; reuse GSAP
- Editorial: y ≤ 40px, duration ~0.7–1s, ease `power2.out`, stagger ≤ 0.12s
- Kill/revert GSAP contexts on unmount (Studio pattern)
- `prefers-reduced-motion: reduce` → no entrance/scroll/hover transform animation (static visible state)
- Do not pin sections, custom cursors, particles, or animate marquee/testimonials redesign
- Do not change Payload schema or copy

## EDGE CASES

1. Reduced motion at page load and mid-session change
2. Hero without emphasis substring → single reveal of whole h1
3. Reveal elements already in viewport on load → play once immediately
4. Mobile: hover polish is no-op (fine); scroll reveal still runs
5. Nested overflow (`overflow-clip` on main) — trigger must use section roots carefully

## ACCEPTANCE TESTS

1. Desktop: hero title fades/rises (emphasis slightly later) once on load
2. Scrolling into Intro / Featured header / Quote / Final CTA reveals content (not already visible as blank)
3. Featured work hover: image scales ~1.04 smoothly; CTA opacity increases
4. Buttons: slight opacity/lift on hover without layout shift
5. `prefers-reduced-motion: reduce`: no autoplay-style motion; content fully visible
6. Build/typecheck green; other pages unchanged

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/homepage-motion-phase-ab-micro-spec.md` | This authority |
| `src/components/motion/Reveal.tsx` | New shared reveal |
| `src/components/home/HomeHero.tsx` | Title stagger |
| `src/components/home/HomeIntro.tsx` | Wrap reveal targets |
| `src/components/home/FeaturedWorkSection.tsx` | Reveal header |
| `src/components/home/FeaturedWorkBand.tsx` | Hover class hooks if needed |
| `src/components/home/QuoteBand.tsx` | Reveal + watermark class |
| `src/components/home/FinalCta.tsx` | Reveal content groups |
| `src/components/Button.tsx` | Hover polish classes |
| `src/app/(site)/globals.css` | Hover + reveal helpers + reduced-motion |

## NON-GOALS

- Phase C (quote drift scrub, heavy Final CTA ken burns)
- Studio/Works/About/Journal motion
- Framer Motion / new libraries
- Magnetic cursor, section pinning, page transitions
- Compressing hero video
