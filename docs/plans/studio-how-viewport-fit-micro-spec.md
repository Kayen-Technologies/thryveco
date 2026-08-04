# Studio How It Works Viewport Fit — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `165:116`. Designer note: section must **fit the screen** (incl. smaller laptop viewports); content should **reveal on scroll**.

**[Certain]** Desktop panel/media use `min-height: 58.0625rem` (~929px Figma artboard). With title + section padding the block measures ~1263px — overflows typical viewports.

## GOAL

Desktop (≥1024): the How It Works composition (title + burgundy panel + media + step pills) fits in **one viewport** (`100dvh`). On enter, title / layout / steps **reveal** (stagger). Clickable step tabs + copy/image crossfade stay.

## INPUTS / OUTPUTS

- INPUT: existing `StudioHowItWorks` props (title, steps with image/copy)
- OUTPUT: viewport-bounded section; scroll-reveal motion; tab UX unchanged

## CONSTRAINTS

- Desktop ≥1024 primary; tablet (≥768) should not keep the 929px floor either.
- Compress via `dvh` / flex fill / `clamp` paddings — do not invent a Services-style 6-panel pin scrub unless product asks later.
- Reuse existing `Reveal` (GSAP ScrollTrigger); respect `prefers-reduced-motion`.
- No Payload/copy/image changes this slice.

## EDGE CASES

- Short laptop (~800–900px tall): title + both columns + all 6 pills still visible.
- Reduced motion: no reveal tween; tabs still work; fade may be instant (existing).
- Mobile stacked layout: no forced `100dvh` that clips the stack; keep readable stacked flow.

## ACCEPTANCE TESTS

1. Desktop 1440×900: `.studio-how__inner` (or section content box) height ≤ `window.innerHeight` when the section is in view (pinned not required).
2. Title, active copy, step pills, and media all within the viewport (no page scroll needed to see the composition once the section is scrolled into view).
3. Scrolling into the section triggers reveal (opacity/y) of title and layout when motion allowed.
4. Clicking steps 1–6 still swaps copy + image.
5. `<1024` / reduced-motion: usable; no broken layout.

## NON-GOALS

Pin-scroll through all 6 steps; new copy; replacing images; mobile pin recreation.
