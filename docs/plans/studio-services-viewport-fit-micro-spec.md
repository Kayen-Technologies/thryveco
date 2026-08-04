# Studio Services Viewport Fit — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `165:105`. Designer note: each service must **fit the screen**; scroll advances to the next service.

**[Certain]** Current scroll frame is fixed at `74.3125rem` (1189px). On typical viewports the panel overflows, so the pin/snap experience fails.

## GOAL

Desktop scroll mode: pinned frame = **one viewport** (`100dvh`); composition scaled into that frame; scroll distance ≈ **1 viewport per service** so snap feels like “next service on scroll.”

## CONSTRAINTS

- Desktop ≥1024 + motion allowed only (existing gate). Static/mobile path unchanged.
- Keep GSAP panel crossfade / stack motion; pin the frame (`pinSpacing: true`), `end: +=innerHeight*(n-1)`; track height auto (no double-count tall track).
- No ScrollTrigger `snap` — it skipped services on modest wheel deltas; scrub maps scroll 1:1 to progress.
- Reposition absolute layout via `%` / `vh` relative to the viewport frame (not fixed 1189px artboard rem).
- No Payload/copy changes this slice.

## ACCEPTANCE

1. Desktop: `.studio-services__frame` height ≈ `window.innerHeight` (dvh).
2. Active panel content (title, stack, includes, description, CTA) visible without scrolling inside the pin.
3. Scrolling through section advances Service 01→02→03→04 (scrubbed; ~1 viewport per step).
4. Reduced-motion / <1024: static stacked layout still works.

## NON-GOALS

New service content, image swaps, mobile scroll-pin recreation.
