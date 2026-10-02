# WFRP 5th edition support

Working folder for adding Warhammer Fantasy Roleplay 5th edition to Hammergen. 5e is an evolution of 4e; the only 5e book so far is the core rulebook (`books/WFRP5_Core_Rulebook_01_09_26.pdf`).

| Document | Purpose | Status |
|---|---|---|
| [01-discovery.md](01-discovery.md) | What differs between 4e and 5e in the areas Hammergen covers, and what each difference means for Hammergen. Ends with open questions. | draft 1 |
| [02-design.md](02-design.md) | Decisions and feature design. | not started |
| [03-tracker.md](03-tracker.md) | Task list for discovery, decisions, design and implementation, plus a change log. | active |
| [plans/p1-edition-variants.md](plans/p1-edition-variants.md) | Plan: migrate content documents to the per-edition variant format; MongoDB layer only, no user-visible change. | done |
| [plans/p2-edition-api.md](plans/p2-edition-api.md) | Plan: `editions` map in the content API (optional `?edition` filter), `edition` on characters; no user-visible change. | done |
| [plans/p3-edition-ui.md](plans/p3-edition-ui.md) | Plan: global edition switch, lists per edition, editor 4e/5e toggle (C4, C5). | done |
| [appendices/a-careers-diff.md](appendices/a-careers-diff.md) | Career-by-career 4e vs 5e comparison (generated). | draft |
| [appendices/b-weapons-armour-diff.md](appendices/b-weapons-armour-diff.md) | Weapon and armour table comparison (generated). | draft |
| [appendices/c-talents.md](appendices/c-talents.md) | 5e talents with 4e names, max ranks and modelled mechanics. | draft |
| [data/careers-5e.json](data/careers-5e.json) | 5e careers extracted from the PDF (class, species, advance scheme, income skill, 4 levels). Unverified. | draft |

## How the comparisons were made

- 5e data comes from the PDF text and page layout (fonts and coloured markers for the career advance schemes). It was spot-checked, not fully verified — see tracker D16.
- 4e data comes from the public, core-source (`source` `1`) entries in the production dump `db/hammergen_29_09_2026`, i.e. what Hammergen users see today, not directly from the 4e book.
- Rules statements cite 5e page numbers; 4e behaviour is taken from the Hammergen code where it implements the rule.

## Conventions

- Keep discovery factual; put choices in the design doc and record them in the tracker's decision table.
- Question IDs (`Q-…`) are shared between the three documents.
