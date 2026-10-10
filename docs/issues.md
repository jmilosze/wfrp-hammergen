# Issues

Backlog of known bugs, improvements and feature ideas. It persists between work sessions: pick an issue by its ID, and keep this file current.

- One entry per issue: `### HG-<n> Title`, then a line with the area and the date it was added, then a short description (what, why, any decisions already made).
- IDs are never reused. New issues take the next free number.
- When an issue is done, delete its entry (git history keeps it). When it is partly done, update the description.
- Out-of-scope problems found while working on something else go here, not into the code as TODO comments.

Next free ID: **HG-25**

## Features

### HG-1 Read-only public links for your own characters and content
Feature · 2026-10-06

Let a user share a character or custom content (careers, items, …) with anyone through a link, e.g. posted on Discord, without the viewer needing an account or edit rights. Today content is private, shared with linked users, or public (admin only). Needs a per-document "anyone with the link can view" option and view pages that work when logged out; a character also needs the content it references to be readable.

### HG-2 Usage metrics per edition (4e vs 5e)
Feature · 2026-10-07

Measure how much each edition is used: content browsing and search, custom content, characters created/viewed/edited/printed, the "Allow 4e content" switch, generator runs; plus a report. Decided approach: API-side structured events (via the existing `slog` → Cloud Logging, then log-based metrics or BigQuery), possibly complemented by counts from the database. Open points: client-only actions (print, CSV export) never reach the API (accept, or add a small event endpoint); some requests don't carry the edition (resolve it from the entity); log counts/edition/action only, no personal data. No 4e baseline was taken before 5e launched.

### HG-3 4e supplement content in 5e
Feature · 2026-10-10

Check how 4e supplement careers, species and qualities map to 5e (5e rulebook appendix on compatibility) and whether some should get 5e versions. Today 5e characters can use them through "Allow 4e content". Rule for adding 5e versions: link (add a 5e variant to the 4e document) only when the match is clearly 1-to-1; otherwise create a new 5e-only document.

### HG-4 Survey user data
Feature · 2026-10-10

How many characters use Gnome/Ogre/regional species, Resilience/Resolve, runes and supplement content. Input for deciding what to convert to 5e next.

### HG-5 Translated content (e.g. Polish, Spanish)
Feature · 2026-10-10

Not planned yet; keep the content model compatible. Translations would be a per-language overlay of the text fields of a variant (`editions.5e.i18n.pl.name`, …), not extra variants: rules data (numbers, enums, ids) must stay identical across languages. Missing translation falls back to the default language.

### HG-6 Career income skill in the editor
Feature · 2026-09-30

Careers have an `incomeSkill` (skill id, both editions); the API checks it is a level 1 skill, but there is no UI to set it and existing careers have none. Add it to the career editor, and consider making it required for 5e careers.

### HG-7 5e Ambitions and Appearance fields
Feature · 2026-10-07

The 5e sheet has Ambitions and Appearance; Hammergen uses the description and notes for them for now. Add proper fields if users ask for them.

### HG-8 Maximum Encumbrance on the sheet
Feature · 2026-10-07

Neither edition shows the maximum encumbrance. 5e modifier effects Strong Back (+1, +3 when taken twice) and Sturdy (SB counted twice) already exist for its calculation.

### HG-9 More rules automation (XP accounting, validation)
Feature · 2026-10-07

Today only sheet values are calculated; current/spent XP are typed-in numbers (XP costs are used only by the generator), and nothing checks career access, spell XP or exclusive talents. Possible next steps: XP accounting when buying advances, then validation.

## Validation

### HG-10 Explicit validation instead of struct tags
Backend · 2026-10-01

Move away from tag-based validation (`go-playground/validator`) to explicit per-type validation. Tags only check single fields, so invalid combinations get through, e.g. a 4e talent with `maxRank` 0 and both `attribute` and `attribute2` empty. Cross-field rules currently live in ad-hoc places (`extraCharacterValidation`, `ValidateEdition`). Keep validation light: basic checks only, no cross-reference or decision-tree validation.

## Modifiers

### HG-11 Rework how modifiers work
Backend + Frontend · 2026-10-01

Talents, traits and mutations share one `modifiers` block (size, movement, characteristics, effects). Everything that doesn't fit the linear "per take" numbers is a hard-coded effect (Hardy, Strong Back, Sturdy) with its own calculation, and the effect enum and per-edition lists are duplicated in Go and TypeScript. Non-linear effects (Strong Back) and effects Hammergen doesn't model (Luck/Fortune, Fear) show the limits.

## Data

### HG-12 4e Bless group contains Invoke talents
Data · 2026-10-04

In the public 4e data, *Invoke - Shallya*, *Invoke - Ranald*, *Invoke - The Night Prowler*, *Invoke - The Gamester*, *Invoke - The Deceiver* and *Invoke - The Protector* are in the Bless group instead of the Invoke group, so they are missing from Invoke. Fix with a `db/scripts` fix script (see `fix_4e_skills.py`).

## Backend

### HG-13 `go vet` warnings
Backend · 2026-09-30

Unkeyed `bson.E` struct literals in `internal/dependencies/mongodb/user.go`.

## Frontend

### HG-14 Reorganise the sidebar into Characters and Compendium
Frontend · 2026-10-02

- **Characters** stays a direct link at the top.
- **Compendium** is a collapsible section (not a pop-out menu) with sub-headings: *Careers & Skills* (Careers, Skills, Talents), *Equipment* (Trappings, Qualities and flaws, Runes), *Magic & Faith* (Spells, Prayers), *Corruption & Creatures* (Mutations, Creature traits).
- Compendium opens automatically on any compendium page and remembers its open/closed state; same on mobile (slide-in sidebar).
- The 4e | 5e switch affects both characters and the compendium, so it stays at the top.
- "Compendium" was chosen over "Other", "Library", "Game Content", "Reference", "Codex"/"Tome"; "Archives" clashes with the *Archives of the Empire* sources.

### HG-15 One standard picker (select table)
Frontend · 2026-10-03

The pickers used to choose content (trappings, skills, talents, traits, qualities and flaws…) come in many variants that don't look good together: `SelectTable` (checkbox), `SelectIdNumberTable` (number in the modal), `SelectIdValueTable` (value in the page table, "Add" for repeatable entries), plus the character editor's `CharacterSkills`, `CharacterTalents`, `CharacterItems` and `CharacterCareer`. Goal: one convenient, better-looking pattern. Purely UX; do it with HG-14.

### HG-16 Group skills and talents inside other groups
Frontend + Data · 2026-10-05

Allow a group to belong to another group (e.g. *Lore - Local* in *Lore*, *Secret Signs - Knight* in *Secret Signs*). The skill and talent editors currently clear and hide the group field for groups. Character generation (career skills/talents given as a group, random picks) and the character editor must then resolve a group to the members of its sub-groups too.

### HG-17 Two `validAttributesFn`
Frontend · 2026-10-09

`services/wh/core/validators.ts` (field name in the message, used by characters) and `services/wh/core/attributes.ts` (used by modifiers) do the same check with different signatures and messages; keep one.

### HG-19 Test fixtures cast with `as …ApiData`
Frontend · 2026-09-30

`content/skill.spec.ts` and `content/career.spec.ts` cast fixtures, which hides type errors (e.g. a stale `visibility` field went unnoticed).

### HG-20 Open tabs after an API change
Frontend · 2026-09-30

Check whether the maintenance page reloads the app when maintenance ends. Tabs still running the old frontend break after a frontend/backend shape change.

## Tooling and deployment

### HG-21 `deploy.py` turns maintenance off
Tooling · 2026-09-30

`deployment/gcp/deploy.py` uses `--set-env-vars`, which replaces all Cloud Run env vars and so drops `HAMMERGEN_MAINTENANCE_ENABLED`. Use `--update-env-vars` or add the flag to the config.

### HG-22 `make dev-restart` / `make test` delete local data
Tooling · 2026-09-30

They run `docker compose down -v`, which deletes the local MongoDB volume (and the `hammergenGo` dev data).

### HG-23 Obsolete `version` in `docker-compose.yaml`
Tooling · 2026-09-30

Compose warns about the obsolete `version` attribute; remove it.

## Tests

### HG-24 HTTP integration tests only cover properties
Tests · 2026-09-30

`src/api-go/test/integration` only covers qualities/flaws; add other content types and characters. Note: these tests run against the `wfrp-mongodb` container on :8081, which writes to the local `hammergenGo` database.
