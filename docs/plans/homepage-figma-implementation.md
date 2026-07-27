# Homepage — Figma Implementation

Authority micro-spec for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `11:53` (Homepage). Desktop canvas **1440px**. Do not expand beyond this document. Treat the fetched design-to-code dump as **visual reference only** — do not paste generated React/Tailwind.

P0 authority (`docs/plans/p0-design-system-foundations.md`) and shipped primitives remain the source of truth for colors, type roles, spacing, `Button` / `Container` / `Section` / `Typography`. Do not overwrite P0 token work.

---

## GOAL

Ship a Figma-faithful `/` homepage: eight section compositions (image hero with overlaid Navbar, cream intro, image-mask marquee, featured-work intro + four full-bleed project bands, burgundy quote band, testimonial carousel, full-image final CTA, existing burgundy Footer), using P0 primitives, CMS-first content with labeled structural fallbacks, and committed local assets (never expiring Figma MCP URLs).

Success = desktop hierarchy/metrics match visual acceptance values below; mobile is intentionally redesigned (not scaled absolute positioning); accessibility + `prefers-reduced-motion` hold; no Payload schema/migration changes; no new npm dependencies.

---

## INPUTS/OUTPUTS

### Inputs

- Figma node `11:53` reference (agent-tools design dump): section order, copy, geometry, overlay opacities, asset URLs (download once before they expire).
- P0 tokens/primitives: `globals.css`, `src/lib/tokens.ts`, `Button`, `Container`, `Section`, `Typography`.
- Existing chrome: `Navbar` (`variant="light" | "dark"`), `Footer` (layout-owned).
- CMS: `getHomePage()` (`src/globals/HomePage.ts` / `src/lib/payload.ts`), Works via `featuredWork.works` (`src/collections/Works.ts`), media via `getMediaUrl` (`src/lib/cms/media.ts`).
- Image config: `next.config.ts` `images.localPatterns` allows `/assets/**` and `/api/media/file/**` only — static fallbacks **must** live under `public/assets/`.
- Stack: Next 16, React 19, Tailwind 4 CSS-first, fonts already loaded (Playfair Display, Open Sans, Pinyon Script). GSAP is already a dependency but **prefer CSS + React** for this slice; do not add packages.

### Outputs

1. Rebuilt `src/app/(site)/page.tsx` composing homepage sections (no leftover placeholder burgundy hero / TODO comments).
2. Homepage section components under `src/components/home/` (boundaries below).
3. Committed static fallback images under `public/assets/home/` (downloaded from Figma MCP asset URLs; never referenced as live `figma.com/api/mcp/asset/...` in code).
4. Minimal layout coordination so `/` overlays `Navbar` `variant="light"` on the hero; other routes keep current dark navbar behavior.
5. Small CSS additions in `globals.css` only as needed for marquee mask, carousel reduced-motion, homepage-specific utilities — do not regress P0 tokens.
6. This authority doc.

### Content sourcing strategy (CMS-first, no schema change)

| Section | CMS source | Fallback / gap handling |
| --- | --- | --- |
| Hero image | `hero.heroImage` → `getMediaUrl` | `public/assets/home/hero.jpg` (downloaded) |
| Hero headline | `hero.headline` + `hero.headlineEmphasis` (champagne italic span when substring matches) | Figma: `Your Brand's New ` + emphasis `Creative Friend` |
| Hero tagline / hero CTA | **Do not render** (Figma hero has neither; booking lives in Navbar) | Leave CMS fields unused this slice |
| Intro copy | `intro.headline`, `intro.body` (split paragraphs on blank lines), `intro.ctaLabel` / `intro.ctaHref` | Figma copy defaults; CTA label default `Book a Discovery Call` |
| Intro portrait | **No CMS field** | Code-only: `public/assets/home/intro-portrait.jpg` |
| Marquee words | `marqueeWords[].word` — use first two for primary + trailing word when present | Defaults `Cultured`, `Intentional` |
| Marquee mask / fill image | **No CMS field** | Code-only: `public/assets/home/marquee-mask.jpg` (+ SVG/mask asset if needed) |
| Featured intro | `featuredWork.headline`; supporting body from `story.body` if set, else structural default | Figma headline/body defaults. **Do not render a separate Story section.** |
| Featured bands (≤4) | `featuredWork.works` (depth 2): `client` or `title`, `tagline` as category line, `tags[].tag`, `heroImage` or `coverImage`, link `/works/[slug]` | If empty: render **zero bands** (no invented case studies). Optional empty-state: intro copy only. |
| Quote band | `quoteBand.quote`, `quoteBand.attribution` | Figma quote + `Thryve & Co Creative Agency` |
| Testimonials intro | **No CMS fields** | Code-only structural defaults (Figma heading + subcopy) |
| Testimonial cards | `testimonials[]` (`quote`, `name`, `role`) | If empty: hide carousel section entirely (or show intro only — prefer hide whole section) |
| Final CTA copy | `finalCta.headline`, `finalCta.ctaLabel`, `finalCta.ctaHref` | Figma multi-line layout via CSS; `subtext` unused if Figma has no body |
| Final CTA background | **No CMS field** | Code-only: `public/assets/home/final-cta.jpg` |
| Footer | Existing layout `Footer` + site settings | Do **not** re-implement Figma footer inside the page |

Label all non-CMS string/image defaults in a single module e.g. `src/components/home/defaults.ts` (or colocated constants) with a comment: `// Structural Figma fallbacks until CMS populated / schema extended`.

### Asset handling strategy

1. **Before coding UI**, download every required Figma MCP asset URL from the design dump into `public/assets/home/` with stable names (examples):
   - `hero.jpg` ← `imgContainer`
   - `intro-portrait.jpg` ← `imgRectangle6`
   - `marquee-photo.jpg` / `marquee-mask.svg` ← `imgRectangle5` / `imgRectangle4`
   - `work-01.jpg`… only if used as **dev preview** — production featured bands must use CMS media when works exist; do **not** ship fake project photos as real case studies
   - `final-cta.jpg` ← `imgSection`
   - Optional decorative: ampersand raster only if Pinyon Script text amp is insufficient for quote band (prefer CSS `Typography variant="decorative"` / text `&`)
2. Use `next/image` with `fill` + `object-cover` for full-bleed photos; ensure paths are under `/assets/**`.
3. Prefer CMS `getMediaUrl` when media is populated; else static `/assets/home/...`.
4. Never invent alternate stock photos. Never leave live Figma MCP URLs in source.
5. Do not commit into `public/media/**` (gitignored Payload uploads).

### Component boundaries & APIs

Place under `src/components/home/`. Reuse P0 primitives; do not wrap one-off markup in abstractions used once beyond these section boundaries.

```ts
// Shared types (inline or home/types.ts)
type HomeMediaSrc = { src: string; alt: string };

// 1) HomeHero
type HomeHeroProps = {
  headline: string;
  emphasis?: string | null; // champagne italic substring
  image: HomeMediaSrc;
};
// Renders: 900px (desktop) full-bleed image, rgba(0,0,0,0.4) overlay, centered headline.
// Does NOT include Navbar markup — layout Navbar overlays this section.

// 2) HomeIntro
type HomeIntroProps = {
  headline: string;
  paragraphs: string[]; // from body split
  ctaLabel: string;
  ctaHref: string;
  image: HomeMediaSrc;
};
// Cream Section; Container; Typography section/body; Button primary (white rect — Figma on cream);
// portrait ~541×567 desktop, stacked on mobile.

// 3) HomeMarquee
type HomeMarqueeProps = {
  primaryWord: string;   // e.g. Cultured
  secondaryWord: string; // e.g. Intentional
  image: HomeMediaSrc;
  maskSrc?: string;      // optional CSS mask image
};
// Large italic Playfair Medium; image-mask / overflow treatment; horizontal motion via CSS.
// Respect prefers-reduced-motion: static centered composition, no infinite scroll.

// 4) FeaturedWorkSection
type FeaturedWorkItem = {
  slug: string;
  name: string;          // client uppercase display
  category: string;      // tagline / industry line
  tags: string[];
  image: HomeMediaSrc;
};
type FeaturedWorkSectionProps = {
  headline: string;
  body: string;
  works: FeaturedWorkItem[]; // 0–4
};
// Intro centered; then FeaturedWorkBand × N

// 5) FeaturedWorkBand (repeated pattern — allowed reusable)
type FeaturedWorkBandProps = FeaturedWorkItem;
// Desktop: 900px full-bleed; 20% black overlay; bottom meta row (name/category | tags | View Case Study link).
// Mobile: min-height ~70vh or 560px; stack meta; link full-width under tags.

// 6) QuoteBand
type QuoteBandProps = {
  quote: string;
  attribution?: string | null;
};
// Section tone primary; giant decorative & (Pinyon, ~10% cream opacity); Typography quote; attribution blush/cream tracking.

// 7) TestimonialCarousel ("use client")
type Testimonial = { quote: string; name: string; role?: string | null };
type TestimonialCarouselProps = {
  headline: string;
  body: string;
  items: Testimonial[];
};
// Center card opaque; side cards rotated/opacity ~0.3 (desktop). Prev/next Button variant="icon" with aria-labels.
// Keyboard: arrows when focused. aria-live polite for active quote. Reduced motion: no rotate animation; simple swap.

// 8) FinalCta
type FinalCtaProps = {
  headline: string; // may contain line breaks or be split in component to match 2+2 line Figma composition
  ctaLabel: string;
  ctaHref: string;
  image: HomeMediaSrc;
};
// Full-bleed image + 30% black overlay; white/cream panel (approximate Figma Subtract with CSS radius/clip — SVG subtract asset allowed if downloaded); underline CTA.
```

**Layout / Navbar coordination (required for fidelity):**

- On `/` only: `Navbar` `variant="light"` (white nav text + white primary CTA) positioned over the hero (`absolute`/`fixed` top of viewport, transparent background). Hero is the first paint under the nav (page or shell `relative`; hero `min-height` accounts for full viewport band).
- Other routes: keep current `variant="dark"` and normal flow.
- Implement via `usePathname` in Navbar **or** a thin layout branch — minimal change; do not redesign Navbar IA/drawer.
- Footer stays layout-owned; homepage does not duplicate it.

**page.tsx data flow:**

```ts
const page = await getHomePage();
// map CMS → section props with defaults.ts fallbacks
// featured works: only real Work docs; skip entries missing images if no static allowed — prefer skip band
```

---

## CONSTRAINTS

- No new npm dependencies. No new font families (no Lato / Inter / PP Editorial Old — map attribution/quote meta to Open Sans / Playfair).
- Reuse P0 `Button`, `Container`, `Section`, `Typography`. Intro CTA on cream uses Figma white rectangular = `Button variant="primary"` (charcoal on white fill). Final CTA text link may be a styled `Link`, not necessarily `Button`.
- Do **not** change Payload schemas, migrations, `payload-types.ts` generation requirements, or CMS admin fields.
- Do **not** overwrite unrelated P0 diffs (`tokens.ts`, primitive APIs, ContactForm/not-found) except homepage-needed layout/CSS.
- No Figma writes / MCP design mutations.
- No generic one-use design-system expansions (no Card kit, no new Button sizes).
- Images: committed `/assets/home/*` or CMS URLs only.
- Accessibility: one `h1` (hero); section headings `h2`; carousel controls labeled; focus-visible preserved; decorative images `alt=""` or meaningful alt from Media when CMS provides `alt`.
- Motion: any marquee/carousel animation disabled or instant under `prefers-reduced-motion`.
- Responsive: design mobile layouts explicitly (see below) — ban desktop absolute coordinates as the mobile layout strategy.

### Responsive behavior (required)

| Band | Desktop (≥1024 / 1440 ref) | Mobile (<768) |
| --- | --- | --- |
| Hero | Height `900px`; headline max `--text-hero` (~100px); centered | Height `min(100svh, 720px)` or ~100svh; headline fluid; keep brand emphasis |
| Intro | 2-col: text 573 / image 541, gap, py 130, px 56 | Stack image below or above text; full width; py reduced (~80px); CTA full-width optional |
| Marquee | ~809px tall; 200px italic words; mask composition | Shorter band; scale words via `--text-marquee`; single-column; no horizontal off-screen trap for a11y |
| Featured intro | Centered max ~879px | Full gutter width |
| Work bands | 900px tall; 3-column bottom meta (56 / center / right link) | Stack: name+category, tags, link; height ≥560px |
| Quote | 696px; quote 88px; giant & | Reduce quote fluid; & scaled down / clipped overflow hidden |
| Testimonials | Fan of 5 cards + icon buttons | One card full width; hide or collapse side cards; buttons below |
| Final CTA | ~1392px; centered panel ~727×927 | Shorter; panel inset with gutters; type scales to ~24–28px |

Breakpoints should align with existing `md` (767px) container gutter switch where practical.

### Visual acceptance values (desktop)

| Token / metric | Value |
| --- | --- |
| Canvas | 1440px reference |
| Hero height | `900px` |
| Hero overlay | `rgba(0,0,0,0.4)` |
| Hero headline | Playfair; `100px` fluid max; regular + **Medium Italic** champagne `#C9A96E` emphasis |
| Nav height | `130px` (P0 `--spacing-nav-h`) |
| Page gutter | `56px` desktop / `24px` mobile |
| Section Y | `130px` where Figma uses padded cream sections |
| Intro heading | `56px` Playfair Regular, leading ~1.2 |
| Intro body | `16px` Open Sans, leading `1.6`, charcoal |
| Intro CTA | `50×` height, `32px` inline pad, radius `0`, white fill |
| Intro image | ~`541×567` |
| Marquee type | `200px` Playfair Medium Italic; secondary word ~`opacity: 0.2` |
| Work band height | `900px`; overlay `rgba(0,0,0,0.2)` |
| Work meta | `16px` Open Sans; name uppercase; category `opacity: 0.7`; tags uppercase; case-study link underline cream border |
| Quote band bg | `#6B0F1A`; quote cream `#F5EFE0` / on-dark; quote size `88px` italic |
| Decorative & | Pinyon; ~`820px` / ~10% cream opacity (clip in section) |
| Attribution | ~16px; blush/cream; letter-spacing ~0.1em |
| Testimonial card | `303×384`, radius `20px`, white, soft shadow |
| Side cards | ~`opacity: 0.3`; rotate ≈ ±5.5° / ±11° |
| Carousel controls | `54px` circle icon buttons |
| Final CTA overlay | `rgba(0,0,0,0.3)` |
| Final CTA panel type | Playfair ~`40px` charcoal on light panel |
| Colors | Burgundy `#6B0F1A`, Cream `#F5EFE0`, Charcoal `#1A1A1A`, Champagne `#C9A96E`, Sub `#929292`, Warm white `#FCFAF7` |

---

## EDGE CASES

1. **Empty CMS home global** — All sections still render using structural defaults except featured bands and testimonials (those omit when no items).
2. **Empty `featuredWork.works`** — Show featured intro copy only; no placeholder clients (Casa Muse etc. must not appear as fake CMS data).
3. **Work missing image** — Skip that band or omit image-less entries; do not invent art.
4. **`headlineEmphasis` not found in headline** — Render full headline in white/cream without champagne split (no crashed slice).
5. **Intro `body` single paragraph** — One `<p>`; if `\n\n` present, multiple paragraphs.
6. **Navbar on non-home** — Must remain readable (`dark`); homepage overlay must not leak `position: absolute` onto other routes.
7. **Double Footer** — Page must not render a second Footer.
8. **Hero CMS CTA fields** — Ignoring them must not break types; do not show conflicting second booking CTA in hero.
9. **Carousel with 1 item** — Hide prev/next or disable; no infinite NaN indexes.
10. **Reduced motion** — Marquee static; carousel instant swap; no large rotating side-card animation.
11. **Asset download failure** — Blocker for visual QA; implementer must obtain assets before claiming done.
12. **White CTA on cream** — Intentional per Figma; do not “fix” by switching to `inverse` unless contrast audit fails WCAG on real paint — Figma wins for this band.
13. **Story group** — Do not add a standalone story section; only optionally reuse `story.body` / ignore `story.image` unless later confirmed as intro portrait substitute (default: static intro asset).

---

## ACCEPTANCE TESTS

1. `/` shows all eight compositions in Figma order: Hero → Intro → Marquee → Featured (intro + bands) → Quote → Testimonials (if data) → Final CTA → Footer (layout).
2. Desktop hero height ≈ `900px` with image + 40% black overlay; headline centered; emphasis champagne italic when configured.
3. Navbar on `/` is light-on-image overlay (white links); booking CTA uses P0 `Button` primary; mobile drawer still works.
4. Intro is cream, uses `Section`/`Container`/`Typography`/`Button`; portrait present from CMS-or-fallback asset under `/assets/home/`.
5. Marquee uses Playfair italic at marquee scale; motion stops under `prefers-reduced-motion`.
6. Featured bands are full-bleed ~900px; each links to `/works/[slug]`; metadata row matches hierarchy; max 4.
7. With zero featured works in CMS, no fake project names/images appear.
8. Quote band burgundy with large decorative ampersand and italic quote.
9. Testimonials carousel: icon buttons have `aria-label`; focusable; only real CMS testimonials.
10. Final CTA full-bleed image + light panel + discovery CTA link.
11. No `https://www.figma.com/api/mcp/asset/` URLs in repo source.
12. `package.json` dependencies unchanged.
13. No edits to `src/globals/HomePage.ts`, collections, or migrations.
14. P0 token values untouched in spirit (charcoal `#1A1A1A`, section Y `130px`, etc.).
15. `npm run lint` clean on touched files; `npm run build` succeeds (or pre-existing unrelated failures noted).
16. Mobile: intro stacks; work meta stacks; testimonial shows one primary card; no horizontal page scroll caused by marquee/carousel.
17. Single `h1` on the page (hero).

---

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/homepage-figma-implementation.md` | Authority (this file) |
| `src/app/(site)/page.tsx` | Rebuild homepage composition |
| `src/app/(site)/layout.tsx` | Only if required for pathname-based nav variant — prefer Navbar-internal pathname |
| `src/components/Navbar.tsx` | Overlay + `light` on `/`; preserve drawer |
| `src/components/home/HomeHero.tsx` | Create |
| `src/components/home/HomeIntro.tsx` | Create |
| `src/components/home/HomeMarquee.tsx` | Create |
| `src/components/home/FeaturedWorkSection.tsx` | Create |
| `src/components/home/FeaturedWorkBand.tsx` | Create |
| `src/components/home/QuoteBand.tsx` | Create |
| `src/components/home/TestimonialCarousel.tsx` | Create (client) |
| `src/components/home/FinalCta.tsx` | Create |
| `src/components/home/defaults.ts` | Create — Figma structural fallbacks |
| `public/assets/home/*` | Create — downloaded images (and optional mask SVG) |
| `src/app/(site)/globals.css` | Minimal homepage/marquee/carousel motion utilities only |
| `next.config.ts` | Only if a new local pattern is required (prefer stay on `/assets/**`) |

Do **not** touch: Payload schemas/migrations, `Footer.tsx` structure (unless a one-line bugfix), unrelated pages, email/contact API, P0 primitive public APIs (consume as-is).

---

## NON-GOALS

- Payload schema additions (`intro.image`, `finalCta.backgroundImage`, testimonials intro group, marquee image, `featuredWork.subtext`, etc.) — **flag only**; implement without them.
- Seeding CMS with Casa Muse / SÓLÉ / etc. case studies (content ops, not this slice).
- Redesigning Navbar/Footer IA, logo, or site-wide chrome beyond homepage overlay behavior.
- Standalone Story section, Journal embeds, contact form on homepage.
- GSAP-driven homepage timeline (allowed later; this slice prefers CSS/React).
- New dependencies, Storybook, dark mode, Figma Variables sync.
- Pixel-perfect SVG recreate of Final CTA “Subtract” if a CSS panel achieves the same hierarchy (downloaded subtract asset optional).
- Works detail pages, Studio/About/Journal builds.
- Changing booking destination semantics beyond CMS/site settings hrefs.
- Committing files under `public/media/`.
