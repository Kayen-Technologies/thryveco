# Homepage Featured Work (Max 3) — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `433:1529` (Frame 60 = three full-bleed bands). Treat MCP output as visual reference — no Tailwind paste.

**[Certain]** Figma replaces prior Casa Muse / SÓLÉ / Aure / Lune homepage set with **three new** full-width bands (900px each). Not an image-only refresh of the old four.

---

## GOAL

Align homepage featured work with Figma `433:1529`: **exactly 3** full-bleed case-study bands (no compact grid), new projects + images, CMS-first via `home-page.featuredWork.works` (ordered, max 3), with committed assets and a migration that upserts Works + Media and links the homepage relationship.

Success = `/` shows Purple Square Interiors → Naya Moments → Mya Art Workshop as three stacked full bands; Admin cannot select more than 3; old fourth compact row gone.

---

## INPUTS/OUTPUTS

### Figma bands (order)

| # | Client / name | Category | Tags | Asset |
| --- | --- | --- | --- | --- |
| 1 | Purple Square Interiors | Interior Design Studio | Brand Identity, Content Strategy, Digital Marketing, Videography | `work-purple-square.jpg` |
| 2 | Naya Moments | Events Stylist | Brand Identity, Photography, Social Media Management, Videography | `work-naya-moments.jpg` |
| 3 | Mya Art Workshop | Art Studio | Brand Positioning, Content Strategy, Social Media Management, Videography | `work-mya-art.jpg` |

Layout: all **full** `FeaturedWorkBand` (no `featured-work-grid` / compact). Overlay meta unchanged structurally (name, category, tags, View Case Study).

### CMS

- `featuredWork.works`: relationship hasMany → works, **maxRows: 3**, admin copy “up to 3”
- Prefer this relationship as homepage source of truth (ordered). Fallback: `HOME_DEFAULTS.featured.items` (3 entries)
- Upsert Work docs: slugs `purple-square-interiors`, `naya-moments`, `mya-art-workshop` with client, industry/tagline, tags, coverImage + heroImage
- Do **not** delete old works (casa-muse, etc.) — they may remain on `/works`; they simply leave the homepage featured set

### Component / page

- `FeaturedWorkSection`: render all items as full bands when ≤3 (or always for homepage featured); drop compact split for this slice
- `page.tsx`: map `page.featuredWork.works` → FeaturedWorkItem[]; `.slice(0, 3)`; stop using `getWorks({ limit: 4 })` for this section

### Outputs

1. Assets under `public/assets/home/`
2. Schema: maxRows + admin description on `featuredWork.works`
3. Migration: seed media, upsert 3 works, set `featuredWork.works` IDs
4. Defaults + page + FeaturedWorkSection updates
5. This authority doc

---

## CONSTRAINTS

- Reuse `FeaturedWorkBand` full variant; no new npm deps
- Dual migration only if schema tables change — maxRows is config-only; content seed still needs a migration
- Cover + hero both get the new homepage frame (case study page shares cover until fuller CS content exists)
- Title-case tags in CMS to match existing band CSS (uppercase via styles OK)

---

## EDGE CASES

1. Empty `featuredWork.works` → defaults (3 items with static assets)
2. Relationship has >3 (legacy) → hard slice to 3 in page.tsx
3. Work missing cover → skip or fallback image from defaults by index
4. Old casa-muse etc. still published → OK on `/works`, not on homepage featured

---

## ACCEPTANCE TESTS

1. `/` featured section shows exactly 3 full-bleed bands in Figma order with new images
2. No compact grid / fourth band
3. Admin Featured Work: max 3; seeded selection present after migrate
4. Work docs exist for the three slugs with correct client/category/tags/images
5. Intro headline/body above bands unchanged unless Figma says otherwise (NON-GOAL this slice if unchanged)
6. Other homepage sections unchanged

---

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/homepage-featured-work-max3-micro-spec.md` | Authority |
| `public/assets/home/work-{purple-square,naya-moments,mya-art}.jpg` | Commit |
| `src/globals/HomePage.ts` | maxRows 3 + admin copy |
| `src/migrations/20260804_151500_homepage_featured_work_max3.ts` | Seed + link |
| `src/migrations/index.ts` | Register |
| `src/components/home/defaults.ts` | 3-item featured defaults |
| `src/components/home/FeaturedWorkSection.tsx` | All full bands |
| `src/app/(site)/page.tsx` | Drive from featuredWork.works, max 3 |

---

## NON-GOALS

- Full case-study page body content for the three new works
- Deleting old Work documents
- Changing featured intro headline/body (unless clearly different in parent frame — out of `433:1529`)
- Pixel-perfect 900px band height on all viewports (keep existing band CSS)
