# Homepage Marquee Sliding Clusters — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, nodes `365:386` / `365:373` (Social), `365:372` (Cultured), `365:371` (Curated). Treat MCP output as visual reference — no Tailwind paste.

**[Certain]** Current `HomeMarquee` keeps **one static photo** while words scroll. Figma now pairs **each word with its own photo** in a 686×353 cluster; photos must translate with the stage.

---

## GOAL

Ship a Figma-faithful homepage marquee: infinite horizontal scroll of **word+image clusters** (Social → Cultured → Curated), each cluster carrying its portrait (297×440) under Playfair Medium Italic 200px type with white invert over the photo. CMS-first via Payload; committed static fallbacks.

Success = images move with their words; three seeded items; Admin can reorder/edit; reduced-motion freezes scroll; no horizontal page overflow.

---

## INPUTS/OUTPUTS

### Figma composition (per cluster)

- Section: cream `#F5EFE0`, height ~809 (existing `--marquee-height` responsive caps OK)
- Cluster: 686×353; photo x259 y0 size 297×440; word centered ~x343 y120, Playfair Medium Italic 200px `#1C1B1A`
- Invert: white type clipped to photo bounds (same technique as today’s overlay, but **local to each cluster**)
- Sequence: **Social** → **Cultured** → **Curated** (loop)
- Neighbor words at 20% in artboards = inactive frame chrome — **do not** implement viewport-opacity fading this slice (NON-GOAL). Full-opacity clusters with local invert is authority.

### CMS

| Concern | Target | Fallback |
| --- | --- | --- |
| Items | `marqueeWords[]` extended: `word` + optional `image` upload | `HOME_DEFAULTS.marquee.items` |
| Legacy `marquee.image` | Keep field; use as fallback when an item has no image | `/assets/home/marquee-photo.jpg` |
| Words without CMS images | Seed 3 media files; link on migrate | Defaults paths |

### Component API

```ts
type MarqueeItem = { word: string; image: HomeMediaSrc };
type HomeMarqueeProps = { items: MarqueeItem[] };
```

Render: one scrolling stage (duplicated for loop). Each cluster = photo + base word + invert overlay word. Drop static photo, global clip-path mask, and secondary-word layers.

### Outputs

1. Schema: `marqueeWords[].image` upload → media; SQL column on `home_page_marquee_words`
2. Assets: `marquee-social.jpg`, `marquee-cultured.jpg`, `marquee-curated.jpg` under `public/assets/home/`
3. Migration: add column + seed media + set `marqueeWords` to Social/Cultured/Curated with image IDs
4. Rebuild `HomeMarquee` + CSS; wire `page.tsx` + `defaults.ts`
5. Regenerate `payload-types.ts`
6. This authority doc

---

## CONSTRAINTS

- Reuse existing BEM `.home-marquee*` / animation pause / IntersectionObserver off-screen pause
- No new npm deps; no MCP asset URLs in committed code
- Dual migration SQL + seed; production-parity (column before link)
- Keep cream section + overflow hidden on viewport
- Prefer extending `marqueeWords` over a second parallel array

---

## EDGE CASES

1. Empty `marqueeWords` → use `HOME_DEFAULTS.marquee.items`
2. Item missing image → fallback `marquee.image` then default social/cultured/curated by index / first default
3. Single item → still duplicate track for loop
4. `prefers-reduced-motion` → no animation; show first set centered (existing pattern)
5. Very long words → nowrap; cluster width may need min based on word (keep 686 Figma floor; allow grow if word wider)

---

## ACCEPTANCE TESTS

1. Desktop: Social / Cultured / Curated scroll; each has distinct photo traveling with the word
2. White invert readable where type overlaps that cluster’s photo
3. Seamless loop (no jump at seam)
4. Hover / off-screen pauses animation
5. Reduced-motion: static, no scroll
6. Admin: Home Page marquee words show image upload; seeded defaults after migrate
7. No horizontal document scroll from marquee overflow
8. Other homepage sections unchanged

---

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/homepage-marquee-sliding-clusters-micro-spec.md` | Authority |
| `src/globals/HomePage.ts` | Add `image` on `marqueeWords`; update defaults |
| `src/migrations/20260804_150000_homepage_marquee_items.ts` | Column + seed + link |
| `src/migrations/index.ts` | Register |
| `src/migrations/lib/seedHomepageMarqueeItems.ts` | Optional seed helper |
| `public/assets/home/marquee-{social,cultured,curated}.jpg` | Commit assets |
| `src/components/home/HomeMarquee.tsx` | Rebuild clusters |
| `src/components/home/defaults.ts` | `items` array |
| `src/app/(site)/page.tsx` | Pass items |
| `src/app/(site)/globals.css` | Per-cluster photo + invert; remove static/global mask |
| `src/payload-types.ts` | Regenerate |

---

## NON-GOALS

- Viewport-centered opacity fade for neighbor words
- SVG per-word mask exports from Figma (use CSS clip/overflow invert)
- Removing legacy `marquee.image` column this slice
- Changing intro / featured / other sections
- Exact 809px section height on all viewports (keep responsive height tokens)
