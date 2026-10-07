# TODO

Backlog of known bugs and improvements that are not part of the current work. Add the date and where it was found; move items out (or delete them) when done.

## Features

- [ ] **Read-only public links for your own characters and content** (characters, custom careers, items, etc.), so they can be shown to others, e.g. posted on Discord, without the viewer needing an account or edit rights. Today content is private, shared with linked users, or public (admin only). Needs a per-document "anyone with the link can view" option and a view page that works when logged out (a character also needs the content it references to be readable). *(2026-10-06)*
- [ ] **Content metrics per edition:** browsing, search and custom-content usage split by 4e/5e (API-side, see `docs/5e/02-design.md` §4.6a). Removed from the 5e scope (tracker A3). *(2026-10-07)*

## Validation

- [ ] **Move away from tag-based validation (`go-playground/validator`) to explicit per-type validation.** Struct tags only check single fields, so many invalid combinations get through. Example: a 4e talent can have `maxRank` 0 with both `attribute` and `attribute2` empty, i.e. a max rank of 0. Cross-field rules currently live in ad-hoc places (`extraCharacterValidation`, `ValidateEdition`). *(2026-10-01)*

## Modifiers

- [ ] **Rework how modifiers work.** Talents, traits and mutations share one `modifiers` block (size, movement, characteristics, effects). Everything that doesn't fit the linear "per take" numbers is a hard-coded effect type (Hardy, Strong Back, Sturdy) with its own calculation and description, and the effect enum and per-edition lists are duplicated in Go and TypeScript. Non-linear effects (Strong Back: +1, then +3 at the second take) and effects Hammergen doesn't model (Luck/Fortune, Fear) show the limits. *(2026-10-01)*

## Data

- [x] **4e Fleet-footed talent has no +1 Movement modifier** in the public data. *(found in 5e discovery, appendix C)*
- [x] **4e Size traits have wrong size modifiers** in the public data: *Size - Tiny* is −2 (should be −3; −2 is Little) and *Size - Monstrous* is +2 (should be +3; +2 is Enormous). *(2026-10-02, found while preparing 5e traits)*
- [x] **4e mutations with wrong modifiers** in the public data (4e book p. 185): *Beast Within* has −5 I, should be −5 Int (its description already says Int); *Crawling Skin* has −5 Int, should be −5 I (description says Int too, also wrong). The 5e variants have the correct modifiers. *(2026-10-03, found while preparing 5e mutations)*
- [ ] **4e Bless group contains Invoke talents** in the public data: *Invoke - Shallya*, *Invoke - Ranald*, *Invoke - The Night Prowler*, *Invoke - The Gamester*, *Invoke - The Deceiver* and *Invoke - The Protector* are in the Bless group instead of the Invoke group, so they are missing from Invoke. *(2026-10-04, found while preparing 5e talents)*
- [x] **4e Secret Signs - Knight group skill has a stale `group`** in the public data: it is stored as a member of *Secret Signs*, but group skills cannot belong to a group (the editor clears and hides it). Clear the field. *(2026-10-05, found while preparing 5e skills)*

## Backend

- [ ] **`go vet` warnings:** unkeyed `bson.E` struct literals in `internal/dependencies/mongodb/user.go`. *(2026-09-30)*

## Frontend

- [ ] **Reorganise the sidebar into Characters and Compendium.** *(2026-10-02)*
  - **Characters** stays a direct link at the top (lists characters).
  - **Compendium** is a collapsible section (not a pop-out menu) with sub-headings:
    - *Careers & Skills:* Careers, Skills, Talents
    - *Equipment:* Trappings, Qualities and flaws, Runes
    - *Magic & Faith:* Spells, Prayers
    - *Corruption & Creatures:* Mutations, Creature traits
  - Compendium opens automatically on any compendium page and remembers its open/closed state; same behaviour on mobile (slide-in sidebar).
  - Consider moving the 4e | 5e switch into the Compendium header while it only affects compendium content (characters stay 4e); move it back to the top when 5e characters arrive.
  - Name chosen over "Other" (confusing), "Library", "Game Content", "Reference", "Codex"/"Tome"; "Archives" ruled out (clashes with the *Archives of the Empire* sources).
- [ ] **Rethink the pickers (select tables)** used to choose content, e.g. trappings, skills, talents, traits or qualities and flaws in the character and item editors. *(2026-10-03)*
  - There are many different variants that don't look good together: `SelectTable` (checkbox), `SelectIdNumberTable` (number in the modal), `SelectIdValueTable` (value in the page table, "Add" for repeatable entries), plus the character editor's own pickers (`CharacterSkills`, `CharacterTalents`, `CharacterItems`, `CharacterCareer`).
  - Goal: one standard, convenient and better-looking picker pattern. Purely UX, so do it alongside the sidebar rework above.
- [ ] **Allow group skills and talents to belong to other groups** (e.g. *Lore - Local* in *Lore*, *Secret Signs - Knight* in *Secret Signs*). The skill and talent editors currently clear and hide the group field for group entries. Character generation (career skills/talents given as a group, random picks, the character editor) must then handle nested groups, i.e. resolve a group to the members of its sub-groups too. *(2026-10-05)*
- [ ] **Prettier:** about 40 files are not formatted (`npx prettier --check src`). *(2026-09-30)*
- [ ] **Test fixtures cast with `as …ApiData`** (`skill.test.ts`, `career.test.ts`), which hides type errors — e.g. a stale `visibility` field went unnoticed. *(2026-09-30)*
- [ ] **Open tabs after an API change:** check whether the maintenance page reloads the app when maintenance ends; tabs still running the old frontend break after a frontend/backend shape change. *(2026-09-30)*

## Tooling and deployment

- [ ] **`deployment/gcp/deploy.py` uses `--set-env-vars`**, which replaces all Cloud Run env vars and so drops `HAMMERGEN_MAINTENANCE_ENABLED` (turns maintenance off on deploy). Use `--update-env-vars` or add the flag to the config. *(2026-09-30)*
- [ ] **`make dev-restart` / `make test` run `docker compose down -v`**, which deletes the local MongoDB volume (and the `hammergenGo` dev data). *(2026-09-30)*
- [ ] **`docker-compose.yaml`:** remove the obsolete `version` attribute (compose warns about it). *(2026-09-30)*

## Tests

- [ ] **HTTP integration tests only cover properties** (`test/integration`); add other content types and characters. *(2026-09-30)*
