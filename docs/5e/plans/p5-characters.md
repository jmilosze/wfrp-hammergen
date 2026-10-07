# Plan P5 — 5e characters (editor and sheet)

Status: **implemented** (2026-10-07); browser walkthrough passed on a local API against a copy of production (5e character created by hand; editor, sheet, tracker, Known Languages, Shield row and 5e CSV checked; 4e sheet and editor unchanged). Not deployed. Tracker items: H1–H6 (H6: a few cheap unit tests for the 5e formulas). Generator (G1–G4) and "allow 4e content" (O1–O4) are separate, later plans.

## Goal

Users can create, edit, view, print and export **5e characters by hand**, with 5e content and 5e rules for the calculated values. 4e characters keep working exactly as today (R1, R4).

## Decisions this plan is built on

- Characters already store an `edition`; it is fixed at creation (R3, Q-EDITION). Today the frontend always uses `CHARACTER_EDITION = "4e"`.
- 5e characters use 5e content only (R5); "allow 4e content" comes later (O1–O4).
- Species: only the five 5e species (R12). A 5e Human uses the existing Human (Reikland) code `0001`, keeping its label; the others use their base codes (`0100` Halfling, `0200` Dwarf, `0300` High Elf, `0400` Wood Elf).
- Advances are stored as points, as today (Q-ADV); one 5e Advance is +5.
- Career Advancement Tracker: one running tick count (0–36) for the current career, a manual field like XP (Q-TRACKER).
- No Ambitions/Appearance fields: description and notes (Q-AMBITION).
- Sheet values only: derived values are calculated; current/spent XP are typed in; no validation of career access, XP or exclusive talents (Q-RULES).
- Size: five steps, Small to Monstrous; wounds by size as p. 361 (Q-SIZE).
- Sheet: Known Languages block in view/print only (the editor keeps languages with all skills); a Shield row in the armour block; no Maximum Encumbrance for now.
- The editor and sheet ship first; the generator follows (G1–G4).
- Character URLs carry the edition as a query parameter, `?edition=5e`; a missing parameter means 4e (2026-10-07).
- **Separate pages per edition** (2026-10-07): 4e and 5e get their own editor and sheet pages, so 5e can grow features 4e does not get. Building blocks that are the same in both editions are shared.
- Tests (H6): a few cheap unit tests (5e formulas, Go species check).

## What already works

- API: characters are stored with `object.edition`; list/get filter by edition; `Character.ToFull` resolves references using the character's edition variant of each content document. Creating a character with `edition: "5e"` is accepted today.
- Content: all 5e content is imported (C6), including careers with income skill, choice groups and 5e species lists.
- Editor lists (`useWhList(..., CHARACTER_EDITION)`) and the view (`getElementForDisplay(id, CHARACTER_EDITION)`) already pass an edition; they need the character's edition instead of the constant.
- Shared components that already take an edition: `CharacterModifiersBlock`, `CharacterModifierEffectTable` (Hardy, Strong Back, Sturdy for 5e).

## Structure

### Pages: one per edition behind a small switch

The routes stay the same. A thin route component reads the edition and renders the edition's page:

| Route | Edition from | 4e page | 5e page |
|---|---|---|---|
| `/character/:id` (edit; `create`) | `?edition`, or the global 4e/5e switch on create | `EditCharacter4e.vue` | `EditCharacter5e.vue` |
| `/view/character/:id` | `?edition` | `ViewCharacter4e.vue` | `ViewCharacter5e.vue` |

- The 4e pages are today's `CreateCharacter.vue` and `ViewCharacter.vue`, renamed, with `CHARACTER_EDITION` replaced by `"4e"`. **No behaviour change for 4e.**
- The 5e pages start as copies of the 4e pages and are then changed for 5e; from then on the two develop independently.
- The character list (`ListCharacters.vue`) stays one page: it lists characters of the selected edition (`listElements(edition)`), "Create" creates a character in that edition, and its links add `?edition`.
- `CHARACTER_EDITION` is removed. Pages live in `views/Warhammer/Character/` (`EditCharacter4e.vue`, `EditCharacter5e.vue`, `ViewCharacter4e.vue`, `ViewCharacter5e.vue`, and the route components).

### Building blocks: shared where the same, separate where they differ

| Shared (both editions, as today) | Separate per edition |
|---|---|
| Pickers and tables: `CharacterSkills`, `CharacterTalents`, `CharacterItems`, `CharacterCareer`, spells/prayers/traits/mutations tables, `SelectTable`/`SelectId…Table`; characteristics block `CharacterAttributes` (the editor passes the species characteristics from the edition's rules and the advance step, 5 in 5e; merged back into one component 2026-10-08) | |
| `CharacterModifiersBlock` and `CharacterModifierEffectTable` (already take an edition) | Fate block (4e: Fate, Fortune, Resilience, Resolve; 5e: Fate, Fortune) |
| `ViewCharacterTable`, print composable, save/load composables (`characterEdit`, `characterList`) | 5e only: Career Advancement Tracker (editor input, sheet boxes), Known Languages block, Shield row |
| | Generate buttons: 4e page only, until the 5e generator |

Shared components receive the character's edition as a prop where they load content or depend on rules.

### Rules: one module per edition

- The calculations in `characterUtils.ts` and `attributes.ts` move into `services/wh/rules/rules4e.ts` and `rules5e.ts`, with the same function names (species characteristics, movement, size, wounds). `rules4e.ts` holds today's functions unchanged.
- `CharacterFull` is built with the rules module for the character's edition; CSV export is `characterFullToCsv4e` / `characterFullToCsv5e`.
- The character model stays **one** type with an `edition` field (Go `Character`, TS `Character`/`CharacterFull`): the API format is the same for both editions. New field: `careerTicks`.

| Value | `rules4e.ts` (today) | `rules5e.ts` |
|---|---|---|
| Species characteristic modifiers (2d10 + modifier) | 4e table | 5e table (discovery §2.1; changes: Dwarf I 10, Halfling T 10 and I 40) |
| Movement | per species | same values (Human 4, Dwarf/Halfling 3, Elves 5) |
| Size | 7 steps, clamp Tiny–Monstrous | 5 steps, clamp Small–Monstrous |
| Wounds | 4e size table | Small = 2 × TB; Average = SB + 2 × TB + WPB; Large ×2, Enormous ×4, Monstrous ×8; + TB per Hardy |
| Encumbrance totals | as today | as today (no maximum, decided) |
| Fate / Fortune | typed in | typed in (no Resilience/Resolve) |

## Changes

### 1. Model and API (H2)

- `Character` (Go and TS) gets `careerTicks int` (`careerTicks` in JSON, `careerticks` in BSON, `omitempty`), validated `gte=0,lte=36`. 4e characters do not use it.
- Resilience and Resolve stay in the model (4e uses them); 5e characters keep them at 0.
- `Character.ValidateEdition` (light validation, like careers): a 5e character's species must be one of the five codes above. Nothing else is checked (Q-RULES).

### 2. Edition plumbing and page split (H1)

- Route components and the page split described in Structure; 4e pages renamed without behaviour change.
- Character list per edition, `?edition` on links, create in the selected edition.
- The 5e pages load content lists and the full character with `"5e"`.

### 3. Rules modules (H3)

- Move today's functions into `rules4e.ts` (no change in results); add `rules5e.ts`.
- `CharacterFull` and the editor's calculated values use the edition's module.

### 4. 5e editor (H4) — `EditCharacter5e.vue`

- Fate block: Fate and Fortune.
- Characteristic and skill advances: the number inputs step by 5 (any value is still accepted).
- Career block: a "Career Advancement Tracker" number input (0–36) next to the current career, with a hint that levels 2/3/4 are reached at 10/22/36 ticks.
- Species select: the five 5e species.
- No 4e generate buttons.
- Edition shown as a read-only label.

### 5. 5e sheet, print and CSV (H5) — `ViewCharacter5e.vue`

- Header: Career Advancement Tracker as a row of boxes with the level 2/3/4 skulls after 10/22/36 ticks.
- Fate block: Fate and Fortune.
- **Known Languages**: Language skills in their own block (name, characteristic, advances, value), not repeated in the skills table.
- Armour: a **Shield** row (5e shields are armour items in the Shield group, with AP and no hit location).
- Wounds breakdown as today (SB, TB × 2, WPB, Hardy), with the 5e size rules.
- CSV (`characterFullToCsv5e`): the same blocks. Print uses the view, so it follows.

### 6. Tests (H6)

- Go: the 5e species check in `Character.ValidateEdition`; `careerTicks` bounds.
- Frontend (vitest): `rules5e.ts` wounds by size, size clamp, species modifiers; `rules4e.ts` keeps today's results (existing tests moved).

## Out of scope (later plans)

- 5e generator (G1–G4): species skills/talents, random talents, class trappings, careers table, 5e XP costs, tracker ticks for higher levels, 5e generate buttons.
- "Allow 4e content" switch and its rules (O1–O4).
- XP accounting, career access and other rule validation (Q-RULES).
- Ambitions, Appearance, Maximum Encumbrance.
- Site texts mentioning only 4th Edition (X2): after this plan ships.

## Order of work

1. Model and API: `careerTicks`, 5e species validation (Go + TS) and their tests.
2. Rules modules: move 4e functions to `rules4e.ts` (existing tests still pass), add `rules5e.ts` and its tests.
3. Page split and plumbing: route components, rename the 4e pages, list per edition, `?edition` links. Check 4e characters still edit, view, print and export exactly as before.
4. 5e editor.
5. 5e sheet, print, CSV.
6. Browser walkthrough on a local stack: create a 5e character by hand, add 5e content, check the sheet, print and CSV; check a 4e character is unchanged.
