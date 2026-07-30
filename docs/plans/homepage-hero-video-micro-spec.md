# Homepage Hero Video — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `111:95` (Container = Nav Bar `13:110` + Hero `13:109`). Desktop frame **1440×900**. Treat Figma MCP output as visual reference only — do not paste generated React/Tailwind.

**[Certain]** Current `Media` allows `image/*` only — CMS-seeded video is impossible without a schema change. Prior homepage plan’s “no schema/migration” constraint is superseded for this slice.

---

## GOAL

Ship a Figma-faithful homepage hero on `/`: full-bleed background **video** under a transparent overlay Navbar, dark overlay, centered two-tone Playfair headline (“Your Brand’s New” white + “Creative Friend” gold italic), with tablet/mobile responsive scaling. Video + poster image + headline copy must be CMS-first via Payload Home Page global, with committed static fallbacks and a migration that seeds/links media.

Success = desktop metrics match Figma; video autoplays muted with poster/image fallback; reduced-motion shows static poster; no other homepage sections changed.

---

## INPUTS/OUTPUTS

### Inputs

- Figma node `111:95` / `13:109`: desktop 1440×900; nav height 130; links x56/y57, Open Sans 16px white, 50px gaps; centered white monogram ~x720; Book a Call x1237/y40, 50px tall, white fill / charcoal text; hero content height 770; headline centered width ~804 at y225 (relative to hero content, not full frame); Playfair Display Regular 100px white + Playfair Medium Italic 100px `#C9A96E`; video still = founder in burgundy on cream sofa with dark overlay.
- Existing chrome: `Navbar` already overlays `/` (`isOverlayNav`), forces `variant="light"`, white monogram, “Book a Call” label, primary white button — **do not re-implement nav inside `HomeHero`**.
- Stack: `HomeHero` + `.home-hero*` in `globals.css`; tokens `--spacing-nav-h: 130px`, `--hero-height` (900 desktop / 700 tablet / min(100svh,640) mobile), `--text-hero*` / `--color-accent: #c9a96e`, `--font-heading` (Playfair with italic), `--font-body` (Open Sans).
- CMS: `globals/HomePage.ts` hero group (`headline`, `headlineEmphasis`, `heroImage`, unused `tagline`/`cta*`); `getMediaUrl`; seed helpers in `migrations/lib/seedHomepageMedia.ts`.
- Assets: commit poster + video under `public/assets/home/` (e.g. `hero.jpg` / `hero.mp4` or `hero.webm`). Never ship live Figma MCP URLs. Figma MCP does **not** export the actual video file — source video must be provided/committed by humans or existing brand assets before seed migration runs.

### Outputs

1. Updated `HomeHero`: `<video>` (when URL present) + poster/`next/image` fallback; keep emphasis substring split; keep nav-spacer + overlay; no CTA in hero.
2. CSS updates for video layer (`object-fit: cover`, new focal `object-position` for sofa/tablet subject — retire stationery 65% desktop bias), responsive headline/hero height.
3. Payload schema: `hero.heroVideo` upload → `media`; expand `Media.upload.mimeTypes` to allow hero video (`video/mp4`, optionally `video/webm`) **in addition to** `image/*`.
4. Migration (`.ts` + register in `migrations/index.ts`): add `home_page.hero_video_id` FK/index; upsert poster + video into Media from `public/assets/home/`; link `heroImage` + `heroVideo` + headline defaults on `home-page` global.
5. Regenerated `payload-types.ts`; wire `page.tsx` + `defaults.ts` for video URL + poster.
6. This authority doc.

### Content sourcing

| Concern | CMS | Fallback |
| --- | --- | --- |
| Headline / emphasis | `hero.headline`, `hero.headlineEmphasis` | `HOME_DEFAULTS.hero` (“Your Brand's New Creative Friend” / “Creative Friend”) |
| Poster / static | `hero.heroImage` → `getMediaUrl` | `/assets/home/hero.jpg` |
| Background video | `hero.heroVideo` → `getMediaUrl` | `/assets/home/hero.mp4` (or webm) if committed; else poster-only |
| Book a Call / nav | Site settings + `Navbar` | Unchanged |
| Hero tagline / hero CTA fields | Do not render | Leave unused |

### Component API (target)

```ts
type HomeHeroProps = {
  headline: string;
  emphasis?: string | null;
  image: HomeMediaSrc;           // poster + image-only fallback
  videoSrc?: string | null;      // normalized media URL; omit → image only
};
```

Video element attrs (required when playing): `autoPlay` `muted` `loop` `playsInline` `poster={image.src}` + `aria-hidden="true"` (decorative under `<h1>`). Prefer `<source type="…">` from mime if known; otherwise `src` on `<video>`.

---

## CONSTRAINTS

- Exact desktop styling vs Figma `111:95` / `13:109`; reuse P0 tokens/primitives; no new npm deps.
- Navbar stays layout-owned; hero only reserves `--spacing-nav-h` spacer.
- Media seeding must follow existing upsert-by-filename + filesize-change pattern (`seedHomepageMedia.ts`).
- Schema change requires dual migration artifacts and production-parity (column exists before link).
- `getMediaUrl` for video URLs; do **not** pass video through `next/image`.
- `prefers-reduced-motion: reduce` → do not autoplay; show poster/`Image` only (pause/remove video or never mount playable video).
- No Tailwind paste from Figma MCP; CSS lives in existing `globals.css` BEM (`.home-hero*`).
- Do not commit into `public/media/**` (gitignored); seed from `public/assets/home/`.

---

## EDGE CASES

1. **Media mime gate**: uploads of `video/*` fail until `Media.ts` mimeTypes expanded — schema change is blocking.
2. **Missing video file at migrate time**: migration must fail loudly or skip video link and leave poster-only (prefer fail if filename listed in seed list; document required asset).
3. **CMS video null / broken URL**: render poster image path only; no empty `<video>`.
4. **Autoplay blocked** (browser policy): muted+playsInline required; still fail → poster remains visible via `poster` + sibling/`Image` underlay.
5. **iOS Safari**: `playsInline` mandatory; avoid `controls`; keep muted for autoplay.
6. **`prefers-reduced-motion`**: static poster; no looping playback.
7. **Emphasis mismatch**: if `headlineEmphasis` not substring of `headline`, render plain headline (existing behavior).
8. **Object-position**: founder/sofa framing differs from old stationery hero — tune cover position so subject stays readable under overlay on mobile crop.
9. **Large video files**: no project filesize limit configured today — keep hero encode lean (short loop, compressed mp4); warn if asset is multi‑MB heavy.
10. **Admin replaces media in place**: `getMediaUrl` cache-bust via `updatedAt` still applies to video `src`.

---

## ACCEPTANCE TESTS

1. Desktop 1440×900: hero total height 900 (130 nav + 770 content); transparent nav over video; white links Open Sans 16 / 50px gap; centered white monogram; white “Book a Call” 50px; headline ~804 wide, top 225px in content area; white Regular + gold Medium Italic `#C9A96E` Playfair ~100px.
2. Video covers full hero bleed, dark overlay `rgba(0,0,0,0.4)` (existing), text legible.
3. Video has `autoplay` + `muted` + `loop` + `playsInline` + poster when motion allowed.
4. Tablet (~768) and mobile: hero height/type scale via existing clamps; headline remains centered and wraps without clipping; hamburger nav (existing `< lg`) still usable over hero.
5. Payload Admin: Home Page hero can upload/select video + image; seeded defaults present after migrate.
6. With video unset: poster/`hero.jpg` still full-bleed (no blank hero).
7. `prefers-reduced-motion: reduce`: no autoplay loop; static poster visible.
8. Other homepage sections (intro → final CTA) visually unchanged.
9. Types/build: `payload-types` includes `hero.heroVideo`; app compiles; migration registered and up succeeds when assets exist.

---

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `src/components/home/HomeHero.tsx` | Video + poster/image fallback; extend props |
| `src/components/home/defaults.ts` | Add video fallback path; keep poster image |
| `src/app/(site)/page.tsx` | Pass `videoSrc` from `hero.heroVideo` |
| `src/app/(site)/globals.css` | `.home-hero__video` (+ reduced-motion); retune object-position |
| `src/globals/HomePage.ts` | Add `hero.heroVideo` upload field |
| `src/collections/Media.ts` | Allow `video/mp4` (+ optional `video/webm`) with `image/*` |
| `src/migrations/lib/seedHomepageMedia.ts` | Seed video; link `heroVideo` |
| `src/migrations/<timestamp>_homepage_hero_video.ts` | SQL `hero_video_id` + seed/link |
| `src/migrations/index.ts` | Register migration |
| `src/payload-types.ts` | Regenerate |
| `public/assets/home/hero.jpg` | Refresh poster still (founder/sofa) if current stationery shot is wrong |
| `public/assets/home/hero.mp4` (or `.webm`) | **Add** committed fallback/seed source |
| `docs/plans/homepage-hero-video-micro-spec.md` | This authority |

Optional touch if seed helper split preferred: new `migrations/lib/seedHomepageHeroVideo.ts` instead of overloading `seedHomepageMedia.ts`.

---

## NON-GOALS

- Rebuilding Navbar, Footer, or any non-hero homepage section.
- Rendering `hero.tagline` / `hero.ctaLabel` / `hero.ctaHref` in the hero.
- External CDN/URL-only video fields (use Media upload).
- Audio-on autoplay, video controls UI, multi-bitrate adaptive streaming.
- New design-system primitives or npm packages.
- Changing overlay routes beyond existing `/` light-nav behavior.
- Pixel-perfect absolute positioning on mobile (responsive redesign OK; desktop Figma metrics are authority).
- Extracting/exporting the real video binary from Figma MCP (not available — human-provided asset required).
