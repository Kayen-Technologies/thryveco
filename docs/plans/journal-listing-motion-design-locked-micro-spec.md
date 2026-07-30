# Journal Listing Motion — Design Locked Micro-Spec

Authority for implement → sweep → QA. Scope: `/journal` listing only (not article pages).

## GOAL

Bring the Journal index to Home/About motion craft: hero entrance, section title reveal, entry-card stagger + restrained hover. Design locked — no layout, copy, or grid structure changes. Editorial restraint (scan-first).

## INPUTS/OUTPUTS

**In:** `JournalHero`, `JournalEntriesSection`, `JournalEntryCard`, shared `Reveal`, GSAP, journal BEM in `globals.css`.

**Out:**
1. Hero: headline → tagline stagger; media wrapper scale settle
2. Entries section title: `Reveal`
3. Cards: stagger enter on grid; desktop hover image scale ≤ 1.04 + CTA underline/lift polish
4. Reduced-motion: static visible; no hover transform
5. This authority doc

## CONSTRAINTS

- Listing only — do not touch `/journal/[slug]` components
- Design locked: no new sections, filters, badges, or copy edits
- Reuse `Reveal` + GSAP; no new deps
- Editorial: y ≤ 36px, duration ~0.75–1s, ease `power2.out`, card stagger ≤ 0.12s
- Kill/revert GSAP contexts on unmount
- `hover: hover` for card image scale

## EDGE CASES

1. Empty entries → section already returns null
2. Many posts → stagger still once-on-enter; don’t pin
3. Reduced motion mid-session → skip init
4. Card is full-link — focus-within should match hover image/CTA

## ACCEPTANCE TESTS

1. `/journal` hero: headline then tagline fade/rise; media settles
2. “Latest entries” (or CMS title) reveals on scroll
3. Cards stagger in; desktop hover scales image; CTA underline/lift
4. Reduced motion: all static/visible
5. Build green; article pages unchanged

## FILE TOUCH LIST

| Path | Action |
| --- | --- |
| `docs/plans/journal-listing-motion-design-locked-micro-spec.md` | This authority |
| `src/components/journal/JournalHero.tsx` | Client + stagger + media settle |
| `src/components/journal/JournalEntriesSection.tsx` | Title Reveal + grid stagger |
| `src/components/journal/JournalEntryCard.tsx` | Hover class hooks if needed |
| `src/app/(site)/globals.css` | Media motion, card hover, reduced-motion |

## NON-GOALS

- Article page motion
- Watermark scrub, ken-burns, pinning
- Pagination / filters / redesign
- CMS schema or copy changes
