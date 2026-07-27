# P0 — Design System Foundations

Authority micro-spec for implement → sweep → QA. Figma source: `6X4FDZeL0ux7dY4zucMhe5`. Do not expand beyond this document.

---

## GOAL

Lock Figma-canonical design tokens in `globals.css` (and keep `src/lib/tokens.ts` in parity) and ship reusable site primitives—`Button`, `Container`, `Section`, `Typography`—then wire `Navbar` and `Footer` to consume them without redesigning pages or adding dependencies.

Success = desktop token values match verified Figma paints/geometry; primary CTA and icon button match Figma metrics; layout/type primitives exist with stable APIs; existing mobile gutters and nav behavior are preserved; no new fonts or packages.

---

## INPUTS/OUTPUTS

### Inputs

- Verified Figma paints: Burgundy `#6B0F1A`, Cream `#F5EFE0`, Charcoal `#1A1A1A`, Champagne `#C9A96E`, Blush `#E8C4C0`, Sage `#7A8B6A`, White `#FFFFFF`, Sub text `#929292`.
- Verified desktop geometry: page gutter `56px`; section vertical padding `130px`; navbar height `130px`; body `16px` / line-height `1.6`.
- Verified CTA: rectangular primary height `50px`, horizontal padding `32px`, radius `0`, white fill; circular icon button `54px`, radius `100px`.
- Verified type roles (desktop max): hero `100px` Playfair; section heading `56px` Playfair Regular, line-height `1.15–1.2`; quote `88px` Playfair Italic; marquee `200px` Playfair Medium Italic; body `16px` Open Sans / `1.6`; decorative ampersand Pinyon Script.
- Existing stack: Next 16, React 19, Tailwind 4 CSS-first (`@import "tailwindcss"` + `@theme`), path alias `@/*` → `./src/*`.
- Existing fonts (keep only these): Playfair Display, Open Sans, Pinyon Script via `next/font/google` in `src/app/(site)/layout.tsx`.
- Existing chrome: `src/components/Navbar.tsx`, `src/components/Footer.tsx`; utilities `.container-x`, `.section-y`, section background classes in `globals.css`.

### Outputs

1. **Tokens** — Corrected `@theme` tokens + header comments in `src/app/(site)/globals.css`; mirrored constants in `src/lib/tokens.ts`.
2. **Primitives** (new files under `src/components/`):
   - `Button.tsx`
   - `Container.tsx`
   - `Section.tsx`
   - `Typography.tsx`
3. **Consumers** — `Navbar` booking CTA (and mobile booking CTA) use `Button`; `Footer` outer padding/wrapper uses `Container` (and `Section` only if it reduces duplication without layout change). No page redesigns.
4. **Optional minimal call-site fixes** — Replace ad-hoc CTAs that already duplicate primary geometry in chrome-adjacent UI (`ContactForm` submit, `not-found` home link) with `Button` using the correct variant for surface contrast. Do not restyle forms, grids, or marketing sections.

### Canonical token decisions (lock these)

| Token | Value | Notes |
| --- | --- | --- |
| `--color-primary` | `#6B0F1A` | Burgundy |
| `--color-accent` | `#C9A96E` | Champagne (keep name `accent`) |
| `--color-blush` | `#E8C4C0` | New |
| `--color-sage` | `#7A8B6A` | New |
| `--color-bg` | `#F5EFE0` | Cream |
| `--color-bg-surface` | `#FFFFFF` | White |
| `--color-text` | `#1A1A1A` | Charcoal — **change from `#1C1B1A`** |
| `--color-text-muted` | `#929292` | Sub text |
| `--color-text-on-dark` | `#FCFAF7` | Keep (not a Figma paint; needed for burgundy surfaces) |
| `--color-primary-dark` | `#3D0710` | Keep for hover |
| `--color-accent-dark` | `#A8854A` | Keep for hover |
| `--color-bg-warm` | `#FCFAF7` | Keep |
| `--spacing-container-x` | `56px` | Mobile override stays `24px` via `.container-x` / `Container` |
| `--spacing-section-y` | `130px` | **change from `120px`**; means **both** block start and end |
| `--spacing-nav-h` | `130px` | New explicit token; Navbar uses it |
| `--radius-none` | `0` | Rectangular CTAs |
| `--radius-circle` | `100px` | Icon buttons only — **rename semantic role**; retire misleading “pill = buttons” comment |
| `--radius-pill` | `100px` | Keep alias = `--radius-circle` for one release so existing `rounded-[var(--radius-pill)]` call sites do not break; do not use on rectangular CTAs |
| `--radius-card` / `--radius-input` | unchanged | Out of P0 visual redesign |

**Typography tokens (role-encoded, fluid; desktop max = Figma):**

| Token | Fluid value | Role |
| --- | --- | --- |
| `--text-hero` | `clamp(2.75rem, 8vw, 6.25rem)` | 100px Playfair |
| `--text-section` | `clamp(2rem, 4vw, 3.5rem)` | 56px Playfair Regular |
| `--text-quote` | `clamp(2.5rem, 6vw, 5.5rem)` | 88px Playfair Italic |
| `--text-marquee` | `clamp(3.5rem, 12vw, 12.5rem)` | 200px Playfair Medium Italic |
| `--text-body` | `1rem` | 16px Open Sans |
| `--text-lead` | `1.25rem` | Keep supporting lead |
| `--text-sm` / `--text-xs` | keep | Utility scale |

Deprecate role-ambiguous aliases by mapping (do not delete yet if used): `--text-display` → same as `--text-hero`; `--text-h1` → `--text-section` (or keep `--text-h1` as alias of `--text-section`); `--text-h2` / `--text-h3` remain for secondary hierarchy until a later pass—do not invent new page typography in P0.

**Line heights:** body `1.6`; section heading `1.15` (token `--leading-section: 1.15`); default headings may use `1.2`.

### Component APIs (lock these)

**`Button`**

```ts
type ButtonVariant = "primary" | "inverse" | "icon";

type ButtonProps = {
  variant?: ButtonVariant; // default "primary"
  href?: string;           // if set, render Next.js <Link>; else <button>
  type?: "button" | "submit" | "reset"; // button only
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;   // required when variant="icon"
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children">;
```

- `primary`: white fill (`--color-bg-surface`), charcoal text, height `50px`, padding-inline `32px` (`px-8`), `border-radius: 0`, body font, no uppercase requirement (match Navbar booking, not ContactForm’s current caps).
- `inverse`: burgundy fill, `--color-text-on-dark` text, same geometry/radius `0` — for cream/light surfaces (ContactForm, not-found).
- `icon`: `54×54px`, `border-radius: 100px`, centered children; **must** have accessible name via `aria-label` (or visible text—prefer `aria-label` for icon-only).
- Focus: visible `:focus-visible` ring using `--color-accent` (or 2px outline offset 2px); do not remove outlines.
- Hover: slight opacity change (`hover:opacity-90`) consistent with Navbar; disabled: `opacity-70` + `pointer-events-none` / `disabled` attribute.
- Do not add size variants, loading spinners, or icon-position props in P0.

**`Container`**

```ts
type ContainerProps = {
  as?: "div" | "header" | "footer" | "main" | "section" | "nav";
  className?: string;
  children: React.ReactNode;
};
```

- Applies horizontal gutter: `56px` desktop, `24px` below `md` (767px), matching `.container-x`.
- No max-width by default (pages already set their own). Optional max-width stays out of API unless passed via `className`.

**`Section`**

```ts
type SectionTone = "cream" | "primary" | "surface" | "none";

type SectionProps = {
  as?: "section" | "div" | "header" | "footer";
  tone?: SectionTone; // default "none"
  padded?: boolean;   // default true → padding-block: var(--spacing-section-y) both sides
  className?: string;
  children: React.ReactNode;
};
```

- `tone` maps to existing `.bg-cream-section` / `.bg-primary-section` / `.bg-surface-section` (or equivalent Tailwind/`style` using tokens).
- Compose with `Container` inside consumers when content needs gutters; `Section` itself does **not** auto-wrap `Container` (avoids double-padding surprises).
- Update `.section-y` utility to `padding-block` (both sides) at `130px` so class and component stay aligned.

**`Typography`**

```ts
type TypographyVariant =
  | "hero"
  | "section"
  | "quote"
  | "marquee"
  | "body"
  | "lead"
  | "decorative";

type TypographyProps = {
  as?: keyof HTMLElementTagNameMap; // default by variant: hero→h1, section→h2, quote→blockquote, marquee→p, body→p, lead→p, decorative→span
  variant: TypographyVariant;
  className?: string;
  children: React.ReactNode;
};
```

- `hero`: `--text-hero`, `--font-heading`, weight 500, leading ~1.1
- `section`: `--text-section`, `--font-heading`, weight 400, leading `1.15`
- `quote`: `--text-quote`, `--font-heading`, italic, weight 400
- `marquee`: `--text-marquee`, `--font-heading`, italic, weight 500
- `body`: `--text-body`, `--font-body`, leading 1.6
- `lead`: `--text-lead`, `--font-body`
- `decorative`: `--font-decorative` (size via className or inherit; do not hardcode marquee-scale)

---

## CONSTRAINTS

- No new npm dependencies; no new font families (no Lato, Inter, PP Editorial Old, PP Hatton).
- CSS-first Tailwind 4: tokens live in `@theme` / utilities in `globals.css`; components use `className` + CSS variables, not inline style sprawl for token values.
- Alias imports: `@/components/...`, `@/lib/...`.
- Preserve Navbar mobile drawer behavior, body scroll lock, and `variant="light" | "dark"` API.
- Preserve Footer structure/content; only swap layout wrapper / shared button patterns where clearly duplicate.
- Do not redesign homepage or other routes; do not implement TODO sections (Intro, MarqueeStrip, etc.).
- Do not change Payload schemas, migrations, or admin UI.
- Accessibility: semantic elements (`button` vs `a`/`Link`); `aria-label` on icon-only controls; `:focus-visible` styles; do not rely on color alone for focus.
- Keep `prefers-reduced-motion` marquee rules intact.

---

## EDGE CASES

1. **White primary on cream** — Unreadable; callers on light surfaces must use `variant="inverse"`. Document in component file comment.
2. **Icon button without label** — TypeScript should require `aria-label` when `variant="icon"` (or runtime dev warning if TS conditional types are too heavy—prefer compile-time).
3. **`href` + `disabled`** — If both passed, prefer non-navigating button or `aria-disabled` + prevent default; do not ship a focusable disabled link.
4. **Section padding stacking** — Nested `Section padded` must be avoided by consumers; implementer does not add negative-margin hacks.
5. **Font CSS variables** — `next/font` already binds `--font-heading|body|decorative` on `<html>`; `@theme` font tokens must remain compatible (do not hardcode conflicting family stacks that break variable injection).
6. **Existing `rounded-[var(--radius-pill)]` CTAs** — Migrating those call sites to `Button` removes incorrect pill radius on rectangular CTAs; any leftover pill usage is for true circles only.
7. **`.section-y` currently pads only `block-start`** — Changing to both sides will increase vertical space on pages using that class; this is intentional Figma parity. Accept visual delta; do not compensate with one-off page hacks in P0.
8. **`lib/tokens.ts` is currently unused** — Still update it so future TS imports cannot reintroduce `#1C1B1A` / `120px`.

---

## ACCEPTANCE TESTS

1. `--color-text` is `#1A1A1A` in `globals.css` and `lib/tokens.ts`; no remaining `#1C1B1A` in those sources.
2. `--spacing-section-y` is `130px`; `.section-y` / `Section` apply padding on **both** block edges.
3. Figma paints Blush and Sage exist as CSS tokens (`--color-blush`, `--color-sage`) and in `lib/tokens.ts`.
4. `--text-hero` / `--text-section` / `--text-quote` / `--text-marquee` exist with desktop maxima `6.25rem` / `3.5rem` / `5.5rem` / `12.5rem`.
5. `Button` primary: computed height 50px, padding-inline 32px, border-radius 0, background white.
6. `Button` icon: 54×54px, border-radius 100px; missing `aria-label` is a type error (or documented enforced prop).
7. `Button` exposes `:focus-visible` style distinct from default static state.
8. `Container` matches `.container-x` gutters (56px / 24px mobile).
9. `Navbar` desktop + mobile booking CTAs render via `Button` (`primary`); navbar height uses `130px` token.
10. `Footer` uses `Container` for horizontal gutter (no duplicate magic padding values).
11. `package.json` dependencies unchanged (no new packages).
12. Site layout still loads only Playfair Display, Open Sans, Pinyon Script.
13. `npm run lint` passes on touched files; `npm run build` succeeds (or pre-existing unrelated failures are noted, not “fixed” by scope expansion).
14. Mobile: navbar hamburger + drawer still function; container gutter remains 24px below md.

---

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/p0-design-system-foundations.md` | Authority (this file) |
| `src/app/(site)/globals.css` | Correct tokens; section padding; type roles; radius semantics; align `.section-y` |
| `src/lib/tokens.ts` | Mirror canonical colors/fonts/spacing constants |
| `src/components/Button.tsx` | Create |
| `src/components/Container.tsx` | Create |
| `src/components/Section.tsx` | Create |
| `src/components/Typography.tsx` | Create |
| `src/components/Navbar.tsx` | Consume `Button` (+ tokenized nav height); no redesign |
| `src/components/Footer.tsx` | Consume `Container`; minimal only |
| `src/components/ContactForm.tsx` | Optional: submit → `Button variant="inverse"` |
| `src/app/(site)/not-found.tsx` | Optional: CTA → `Button variant="inverse"` |

Do **not** touch: Payload collections/globals, migrations, homepage section TODOs, GSAP animations, email/contact API, `layout.tsx` font list (unless a one-line class wiring is required for a new utility—prefer none).

---

## NON-GOALS

- Building homepage sections (Intro, MarqueeStrip, Story, Featured Work, QuoteBand, Testimonials, Final CTA).
- Creating a full component library, Storybook, dark mode, or Figma Variables sync.
- Adding inconsistent fonts from Figma (Lato, Inter, PP Editorial Old, PP Hatton).
- Redesigning Navbar/Footer layout, logo placement, or mobile IA.
- Form design system (inputs, validation UI) beyond swapping the submit control to `Button`.
- Animation system work beyond preserving existing marquee CSS.
- Refactoring all pages to `Section`/`Typography` (primitives ship ready; broad adoption is P1).
- Changing CMS content, SEO metadata strategy, or themeColor unless required by token rename (keep `#6B0F1A`).
- Introducing `class-variance-authority`, Radix, or other styling/helper libraries.
