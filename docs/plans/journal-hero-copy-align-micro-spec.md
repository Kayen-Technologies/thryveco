# Journal Hero Copy Align — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `170:47`.

**[Certain]** Live tagline is missing the colon after “care about” vs Figma.

## GOAL

Align Journal hero copy with Figma in code fallbacks, Payload schema defaults, and `journal-page` CMS data.

## FIGMA COPY

| Field | Text |
| --- | --- |
| Headline | `Thoughts, perspective & a little creative obsession.` |
| Tagline | `We write about the things we care about: aesthetics, strategy, social media, and everything happening in the creative world around us. Pull up a seat.` |

**Delta:** insert `:` after `care about`.

## CONSTRAINTS

- Copy only — no layout/CSS/image changes.
- Migration overwrites `journal-page.hero` headline + tagline to Figma (Payload alignment requested).

## ACCEPTANCE

1. `/journal` renders Figma tagline (with colon).
2. `JOURNAL_DEFAULTS` + `JournalPage` `defaultValue` match Figma.
3. Migration updates CMS; Admin shows same text.

## NON-GOALS

Hero layout/viewport work; journal entries; images.
