# TODO

Backlog of known bugs and improvements that are not part of the current work. Add the date and where it was found; move items out (or delete them) when done.

## Validation

- [ ] **Move away from tag-based validation (`go-playground/validator`) to explicit per-type validation.** Struct tags only check single fields, so many invalid combinations get through. Example: a 4e talent can have `maxRank` 0 with both `attribute` and `attribute2` empty, i.e. a max rank of 0. Cross-field rules currently live in ad-hoc places (`extraCharacterValidation`, `ValidateEdition`). *(2026-10-01)*

## Modifiers

- [ ] **Rework how modifiers work.** Talents, traits and mutations share one `modifiers` block (size, movement, characteristics, effects). Everything that doesn't fit the linear "per take" numbers is a hard-coded effect type (Hardy, Strong Back, Sturdy) with its own calculation and description, and the effect enum and per-edition lists are duplicated in Go and TypeScript. Non-linear effects (Strong Back: +1, then +3 at the second take) and effects Hammergen doesn't model (Luck/Fortune, Fear) show the limits. *(2026-10-01)*

## Data

- [x] **4e Fleet-footed talent has no +1 Movement modifier** in the public data. *(found in 5e discovery, appendix C)*
- [ ] **4e Size traits have wrong size modifiers** in the public data: *Size - Tiny* is −2 (should be −3; −2 is Little) and *Size - Monstrous* is +2 (should be +3; +2 is Enormous). *(2026-10-02, found while preparing 5e traits)*

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
- [ ] **Prettier:** about 40 files are not formatted (`npx prettier --check src`). *(2026-09-30)*
- [ ] **Test fixtures cast with `as …ApiData`** (`skill.test.ts`, `career.test.ts`), which hides type errors — e.g. a stale `visibility` field went unnoticed. *(2026-09-30)*
- [ ] **Open tabs after an API change:** check whether the maintenance page reloads the app when maintenance ends; tabs still running the old frontend break after a frontend/backend shape change. *(2026-09-30)*

## Tooling and deployment

- [ ] **`deployment/gcp/deploy.py` uses `--set-env-vars`**, which replaces all Cloud Run env vars and so drops `HAMMERGEN_MAINTENANCE_ENABLED` (turns maintenance off on deploy). Use `--update-env-vars` or add the flag to the config. *(2026-09-30)*
- [ ] **`make dev-restart` / `make test` run `docker compose down -v`**, which deletes the local MongoDB volume (and the `hammergenGo` dev data). *(2026-09-30)*
- [ ] **`docker-compose.yaml`:** remove the obsolete `version` attribute (compose warns about it). *(2026-09-30)*

## Tests

- [ ] **HTTP integration tests only cover properties** (`test/integration`); add other content types and characters. *(2026-09-30)*
