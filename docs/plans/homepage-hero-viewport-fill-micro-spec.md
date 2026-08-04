# Homepage Hero Viewport Fill — Micro-Spec

Authority for implement → sweep → QA. Supersedes the **fixed desktop height 900px** acceptance in `homepage-hero-video-micro-spec.md` for layout height only. Figma `111:95` remains visual reference for composition (nav overlay, headline, overlay, media framing) — not a locked pixel height on tall viewports.

Designer note (2026-08): hero looks cropped / not full-screen → make hero fill the first viewport.

---

## GOAL

Make the homepage hero fill the first browser viewport on all breakpoints so the media + headline read as a full-bleed first screen, with subject framing adjusted so the top of the hero media is not uncomfortably cropped.

Success = first paint shows hero edge-to-edge to the bottom of the visible viewport (no strip of the next section); nav still overlays; headline remains centered and legible; reduced-motion / video behavior unchanged.

---

## INPUTS/OUTPUTS

### Inputs

- Existing `.home-hero*` in `src/app/(site)/globals.css`; `HomeHero.tsx` structure (nav spacer + content + scroll cue).
- Tokens: `--spacing-nav-h: 130px`, `--hero-height` (currently mobile `min(100svh, 640px)`, tablet `700px`, desktop `900px`).
- Desktop layout currently hardcodes `grid-template-rows: var(--spacing-nav-h) 770px` (assumes 900 total).

### Outputs

1. `.home-hero` height uses viewport units (`100svh` + `100dvh`), scoped on the class (not global `--hero-height`, which Studio still uses).
2. Remove `.home-hero` negative `margin-top` under overlay nav — Navbar is already `absolute`; pull-up + `main.overflow-clip` cropped the top of the media.
3. `.home-hero__layout` uses fluid content row (`minmax(0, 1fr)`) at desktop — drop hardcoded `770px`.
4. Retune `object-position` upward enough that the subject’s head/camera stay in frame under `object-fit: cover` on common crops.
5. Headline vertical placement stays proportional via `clamp` on tall viewports.
6. This authority doc.

---

## CONSTRAINTS

- CSS-only / token changes in `globals.css` (+ this doc). No TSX changes unless layout markup is proven broken.
- Do not rebuild Navbar, other homepage sections, CMS schema, or video playback logic.
- Overlay Navbar stays absolute; home hero must not use negative nav margin (clips under `overflow-clip`).
- Keep `object-fit: cover`, dark overlay, scroll cue, Ken Burns / reduced-motion rules.
- No new npm deps; no Tailwind paste from Figma.

---

## EDGE CASES

1. **Short viewports** (e.g. landscape phone, short laptop): hero still `100svh`/`dvh` but headline must not collide with scroll cue — existing clamps / absolute headline OK if still readable.
2. **Mobile URL bar**: `100dvh` with `100svh` fallback so chrome resize doesn’t leave a gap or overshoot badly.
3. **Very tall monitors**: hero grows with viewport; do not cap at 900px.
4. **Ken Burns scale**: zoom still starts from cover framing; object-position must keep subject readable at scale 1 and ~1.06.
5. **`--hero-height` shared with Studio**: do not change the global token for this slice — override height only on `.home-hero`.
6. **Negative margin + overflow-clip**: do not reintroduce `margin-top: calc(-1 * var(--spacing-nav-h))` on home hero while `main` has `overflow-clip`; it clips the top of the media.

---

## ACCEPTANCE TESTS

1. Desktop ≥1024, viewport taller than 900px: `.home-hero` height equals viewport (svh/dvh); no visible strip of intro below the fold on first load.
2. Desktop 1440×900-class: still fills viewport; composition readable (nav + centered two-tone headline + scroll cue).
3. Tablet / mobile: hero fills first screen; hamburger/light overlay nav usable.
4. Media: subject head/upper body not clipped at the top under typical cover crops (object-position retuned).
5. `prefers-reduced-motion: reduce`: static poster only; no video; no Ken Burns.
6. Video path (when present): still covers full hero bleed.
7. Other homepage sections visually unchanged aside from where the fold starts.

---

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `src/app/(site)/globals.css` | Viewport `--hero-height`; fluid desktop layout rows; retune `object-position` |
| `docs/plans/homepage-hero-viewport-fill-micro-spec.md` | This authority |
| `docs/plans/homepage-hero-video-micro-spec.md` | One-line note: height acceptance superseded by this doc |

Optional: `HomeHero.tsx` only if CSS cannot fix layout without markup.

---

## NON-GOALS

- Pixel-matching Figma frame height 900 / content 770 on tall screens.
- Changing headline copy, fonts, colors, or nav CTA.
- New hero CTA, cards, or secondary marketing in the first viewport.
- Re-encoding hero video/image assets (framing via CSS only this slice).
- Other page heroes (About, Studio, Works, etc.).
