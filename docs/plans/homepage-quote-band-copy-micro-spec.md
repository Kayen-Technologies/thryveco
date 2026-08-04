# Homepage Quote Band Copy — Micro-Spec

Authority for implement → sweep → QA. Figma: `6X4FDZeL0ux7dY4zucMhe5`, node `78:118`. Copy-only.

## GOAL

Align quote band with Figma: quote `Growth should look as good as it performs.` + attribution `Thryve & Co Creative Agency` in defaults and Payload `home-page.quoteBand`.

## INPUTS/OUTPUTS

- Store quote **without** wrapping quotation marks (`QuoteBand` already adds `&#8220;` / `&#8221;`).
- Update `HOME_DEFAULTS.quote`, schema attribution default, migration to overwrite CMS quoteBand.

## NON-GOALS

Layout/CSS/watermark changes. Other sections.

## ACCEPTANCE

`/` quote band shows Growth quote + Thryve attribution; Admin matches after migrate.
