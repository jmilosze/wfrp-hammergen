# HG-40 Career trappings as a list

Tracking folder for HG-40 (`docs/issues/functional.md`). Delete the folder when HG-40 is done.

Goal: each career level gets a list of trappings (ids with quantities, choices and dice) instead of free text. The list is edited with a picker, shown on the career page and added by the generator.

## Files

| File | What |
|---|---|
| `README.md` | Scope, decisions, work plan (this file) |
| [analysis.md](analysis.md) | Counts and cases from the data, 5e scope and both editions |
| [careers-5e.md](careers-5e.md) | Proposed list per level of every 5e career, with a review checkbox (generated) |
| [new-trappings.md](new-trappings.md) | Trappings to create, with their status (generated, then kept by hand) |

Data and scripts (gitignored, local only) are in `db/data/hg-40/`. Run from that folder:
- `dump.py`: reads the public careers and trappings from local `hammergenGo` into `careers.json` and `items.json`;
- `parse.py`, `norm.py`: split the text into entries (`entries.json`) and atoms (`atoms.json`);
- `final.py`: maps every atom with `match.py` (name matching), `alias.py` (hand-made aliases) and `cat.py` (categories) into `career-trappings-resolved.json`;
- `gen_docs.py`: regenerates `careers-5e.md` and `new-trappings.md`. It overwrites both, so copy any hand-kept statuses in `new-trappings.md` back after regenerating.

Corrections from the review go into `alias.py`, then rerun `final.py` and `gen_docs.py`.

## Scope

- Now: the 64 public 5e career variants. Their 4e variants (same documents) keep the free text for now.
- Later: the 177 public 4e careers (numbers in [analysis.md](analysis.md)).
- Users' own careers are not converted; they keep their free text, still shown and editable.

## Decided

- No "group" trappings: choices ("A or B") and dice ("1d10") are stored in the list itself.
- Converted public careers lose the free text. New careers have no free-text field. The field is shown only for levels that still have text.
- New 5e trappings are created as 5e-only documents; the 4e variant is added later when the 4e careers are converted (1-to-1 links).

## Open decisions

- [ ] **D1 Format.** Proposal in [analysis.md](analysis.md#format): a list of entries, each with options, each option a list of trappings with a quantity. Needed because of choices between bundles ("Bow with 10 Arrows or Pistol with 10 Shots", 11 in 5e).
- [ ] **D2 Non-trappings** (people, property, crews, intangibles; 121 uses in 5e): leave them out, or keep a short note per level.
- [ ] **D3 Money** (16 uses: "20 GC", "Goods worth 2d10 Pennies", "Jewellery worth 50 GC"): leave it out, or add it to the character's coins in the generator.
- [ ] **D4 Quality** (32 uses: "Quality Clothing", "Best Quality Courtly Clothes", "Poor Quality Blanket"). In 5e a Quality Trapping is one with more Item Qualities (Durable, Fine, Lightweight, Practical) than Flaws; each Quality doubles the price. In Hammergen, qualities belong to the trapping document, and a character stores only a trapping id and a count, so one character can't own "Clothing with Fine". Options:
  - map to the base trapping and drop "Quality" (Quality Clothing → Clothing);
  - create separate trappings such as "Clothing (Fine)" with the quality set (about 12 new ones in 5e);
  - store a quality mark on the career entry, shown on the career page; the generator still gives the base trapping.
- [ ] **D5 Generic weapons** (10 uses: "Melee Weapon (Any)", "Great Weapon", "Weapon (Any)", "2 Quality Weapons"): an explicit choice list per entry, or Hand Weapon.
- [ ] **D6 Grimoire** (2 uses): a generic grimoire trapping without spells, or leave it out.
- [ ] **D7 Libraries and workshops** (9 uses): create the missing ones as trappings (as `Library - Magic` and `Workshop - <trade>` already are), or treat them as property (D2). "Trade Tools/Workshop (as Trade)": a choice of all trades, or leave out.
- [ ] **D8 Generator**: add the current level's trappings only, or every level up to it.
- [ ] **D9 Aliases**: confirm the judgement calls listed in [analysis.md](analysis.md#mappings-to-check) (e.g. Livery → Courtly Garb (Servant), Spyglass → Telescope).

## Work plan

- [ ] 1. Agree D1–D9.
- [ ] 2. Review the mapping of all 64 careers in [careers-5e.md](careers-5e.md); fix `alias.py`, regenerate.
- [ ] 3. Backend: new field on `CareerLevel` (Go type, validation of ids and quantities, `omitempty`), tests.
- [ ] 4. Frontend model: `content/career.ts` (type, API mapping, `isEqualTo`, validation), tests.
- [ ] 5. Career editor: picker for entries and options, quantities; free-text field only when a level has text.
- [ ] 6. Career page: show the list (options joined by "or"), and the old text where there is one.
- [ ] 7. Generator (4e and 5e): add career trappings next to the class trappings; shared code with `generation/shared/trappings.ts`.
- [ ] 8. New trappings: write the 32 (+ decision-dependent) entries in `db/data/5e/items-5e.json` with rephrased descriptions; import locally (`import_5e.py --type item`).
- [ ] 9. Migration script `db/scripts/` (dry run, `yes`, verification, idempotent): fill the new field of the 5e variants from `career-trappings-resolved.json` and clear their text.
- [ ] 10. Run locally, check careers and the generator in the app.
- [ ] 11. Staging: import trappings, migrate, check.
- [ ] 12. Production: backup, deploy backend then frontend, import trappings, migrate, check.
- [ ] 13. Update `docs/architecture.md` (career trappings), HG-40 in the backlog (4e part left), delete this folder when HG-40 is done.
