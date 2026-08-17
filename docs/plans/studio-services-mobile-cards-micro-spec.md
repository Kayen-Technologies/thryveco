# Studio Services Mobile Cards — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5` (mobile service frames, node ids `416:1174`, `638:1610`, `638:1639`). Designer changed the mobile view: each service is a normal-flow card with one image, a CTA, and two disclosure rows (`Overview`, `What's included`). No pinned scroll-jack on phones.

## GOAL

Below `768px`, `StudioServices` renders four services in normal document flow. Each card: repeated section title, service label, centered display title + swoosh underline, one ~1:1 image, centered CTA, then divider-separated `Overview` and `What's included` disclosures — both closed by default, independently toggleable. No pin, no crossfade, no progress dots, no `aria-live` label.

## RENDER MODE MATRIX

Revised after the designer confirmed the pinned crossfade must also apply on phones ("when you scroll, it changes… service 1, 2 etc like it did before").

| Viewport | Motion pref | Path | Root class |
|---|---|---|---|
| `< 768px` | no-preference | Pinned crossfade, card composition | `studio-services--scroll studio-services--scroll-cards` |
| `< 768px` | reduce | Stacked accordion cards, no pin | `studio-services--cards` |
| `≥ 768px` | no-preference | Pinned crossfade, stack layout (unchanged) | `studio-services--scroll` |
| `≥ 768px` | reduce | 2-col static grid (unchanged) | `studio-services--static` |

### How the pin and the accordions coexist

The pinned frame is a fixed `100svh`, so accordion expansion must be absorbed **inside** it:

1. The image is the only elastic element (`flex: 1; min-height: 5rem`), so it shrinks to make room. The frame height never changes, which is why opening a disclosure needs no `ScrollTrigger.refresh()`.
2. Once the image hits its floor the card grows past the panel (`min-height: 100%` on a `display: block` panel), and the panel becomes scrollable so the remaining content stays reachable.
3. The panel is a scroll container **only** while a disclosure is open (`:has(.studio-services__disclosure[open])`), and scroll chaining stays at its default. Both matter: a permanently-scrollable panel captures wheel gestures that belong to the pin, and `overscroll-behavior: contain` swallows them outright, freezing service advancement.

## CONSTRAINTS

- Phone path (`< 768px`) only. Tablet 768–1023 keeps the existing pinned stack frame.
- Inactive pinned panels carry `inert`, because the card variant puts tabbable `<summary>` elements in every panel and focusable nodes must not sit inside `aria-hidden`.
- Image: reuse `service.stackImages[0]` (front layer, already the maroon-card photo). `object-fit: cover`, `object-position: 50% 45%`, `sizes="100vw"`.
- Section title repeats on every card visually, but only card 01 uses a real `<h2>`; cards 02–04 render it as `<p aria-hidden="true">` to keep one heading in the outline.
- Accordions: native `<details>/<summary>`, both closed initially, **exclusive** — a shared `name` per service makes the two rows a radio group, so opening one closes the other and the composition stays inside the pinned frame. Browsers without `name` support degrade to independent toggling. Inline chevron SVG (no chevron asset exists), rotated 180° on open. No height animation (Figma specifies only the two static states).
- Mode gate becomes three-way (`cards | scroll | static`), initialised to `cards` so phones SSR their final markup. Crossing `768px` must revert the GSAP context and remove the pin-spacer.
- No Payload schema or copy changes. No new image exports. No desktop/tablet layout changes. No `Button` changes (`variant="primary"` stays).

## FILE TOUCH LIST

- `src/components/studio/defaults.ts` — fix the four `stack-01` alt strings (currently "back layer", factually inverted and now surfaced as content alt text).
- `src/components/studio/StudioServiceDisclosure.tsx` *(new)* — `<details>/<summary>` + inline chevron + `grid-template-rows: 0fr → 1fr` open transition.
- `src/components/studio/StudioServiceCard.tsx` *(new)* — phone card; inherits none of the absolute-position panel CSS.
- `src/components/studio/StudioServices.tsx` — three-way `mode` state; card render path; widen gate.
- `src/app/(site)/globals.css` — re-scope `@media (max-width: 1023px)` `--scroll` block to `(min-width: 768px) and (max-width: 1023px)`; fold the 768–1023 CTA override into it; add `@media (max-width: 767px)` card block.

## EDGE CASES

- Resize across 768px in both directions: no orphaned pin-spacer, no duplicated ScrollTrigger.
- Landscape phone ≥768px lands on pinned deck (accepted; existing flex/max-height handling keeps it survivable).
- `<details>` content is `display: none` while closed — height transition requires `::details-content`; fallback is instant toggle.
- Long "What's included" items wrap; disclosure must grow, pushing the next card down without clipping.

## ACCEPTANCE

1. At 390×844: no `pin-spacer` in the DOM for this section; document scrolls normally through all four services.
2. Expanding both disclosures on service 01 pushes service 02 down with nothing clipped.
3. `<summary>` is Tab-reachable and toggles on Enter/Space.
4. No `studio-services__progress` and no `aria-live` label in the cards path.
5. At 768×1024 and 1440×900: pinned crossfade byte-identical to today.
6. Reduced-motion at 1440px: static grid intact.
7. Card image alt text describes the photo, not a stack layer.

## NON-GOALS

Copy changes, Payload schema changes, new image exports, desktop/tablet layout, `Button` changes, mobile scroll-pin recreation.
