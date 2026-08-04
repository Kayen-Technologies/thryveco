# Homepage Intro Copy Align — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `47:75` (Section). Copy-only alignment; layout/CSS unchanged.

---

## GOAL

Align homepage intro section copy with Figma `47:75` in code fallbacks **and** Payload `home-page` CMS data so `/` renders the Figma text (not the older em-dash paragraph).

Success = live intro headline + body paragraphs + CTA match Figma; CMS Admin shows the same after migrate.

---

## INPUTS/OUTPUTS

### Figma copy (authority)

| Field | Text |
| --- | --- |
| Headline | `Growth should look as good as it performs.` |
| Body P1 | `We're a creative agency for brands that refuse to blend in. Aesthetic-forward, strategy-driven, and built for brands that want both.` |
| Body P2 | `We help ambitious brands build an online presence that feels as intentional as the products and experiences they create. By blending strategy, creative direction, content creation and social media management, we shape brands that are memorable, culturally relevant and impossible to overlook.` |
| CTA | `Book a Discovery Call` |

**Delta vs current:** P1 changes em-dash mid-sentence (`— aesthetic-forward`) to sentence break (`. Aesthetic-forward`). Headline / P2 / CTA already match.

### Outputs

1. `HOME_DEFAULTS.intro` body P1 updated.
2. Payload field defaults / seed strings that still carry the old P1 updated where they act as authorities.
3. Migration updates `home-page.intro.body` (and keeps headline/cta aligned) via Payload Local API.
4. This authority doc.

---

## CONSTRAINTS

- Copy only — no layout/CSS/image changes for intro.
- Body remains textarea with paragraphs joined by `\n\n` (existing `page.tsx` split).
- Dual artifacts only if schema changes — **not required** for this content patch.
- Do not change quote band or other sections that reuse the headline phrase unless Figma for those nodes also changed (NON-GOAL).

---

## EDGE CASES

1. CMS body already customized differently from old seed → migration should still set Figma intro body (user asked Payload alignment to Figma). Document that this overwrites custom intro body.
2. Empty intro body → set Figma body (fallback path currently uses `HOME_DEFAULTS`).
3. Apostrophe / dash variants of the old P1 in DB → overwrite whole body to Figma string, don’t rely on fragile string replace alone.

---

## ACCEPTANCE TESTS

1. `HOME_DEFAULTS.intro.body[0]` equals Figma P1.
2. After migrate: Payload `home-page.intro.body` contains Figma P1 + P2 separated by blank line; headline + ctaLabel match Figma.
3. `/` intro section renders Figma P1 (period + “Aesthetic-forward”), not em-dash version.
4. Intro image / button / layout unchanged.

---

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/homepage-intro-copy-align-micro-spec.md` | This authority |
| `src/components/home/defaults.ts` | Update intro body P1 |
| `src/migrations/20260804_143000_update_homepage_intro_copy.ts` | Seed/update CMS intro copy |
| `src/migrations/index.ts` | Register migration |
| Optional: `src/migrations/20260725_223100_seed_homepage_figma.ts` | Leave historical (do not rewrite past migrations) |

---

## NON-GOALS

- Changing intro layout, typography CSS, or image asset.
- Updating quote band / story / featured copy.
- Re-running full homepage media seed.
- Manual Admin-only edit without migration (must be reproducible for prod).
