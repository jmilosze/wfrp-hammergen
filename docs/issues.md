# Issues

Backlog of known bugs, improvements and feature ideas. It persists between work sessions: pick an issue by its ID, and keep this file current.

- One entry per issue: `### HG-<n> Title`, then a line with the area and the date it was added, then a short description (what, why, any decisions already made).
- IDs are never reused. New issues take the next free number.
- When an issue is done, delete its entry (git history keeps it). When it is partly done, update the description.
- Out-of-scope problems found while working on something else go here, not into the code as TODO comments.

Next free ID: **HG-36**

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

### HG-27 Current Wounds on the character
Feature · 2026-10-14

The character only has its maximum Wounds, calculated from the characteristics, size and Hardy. Add the current Wounds (what is left after damage, counting down to 0) to the character model, editable in the editor and shown on the sheet next to the maximum, as the paper sheet's Current Wounds box. Decide how it behaves when the maximum changes (e.g. capped at the new maximum).

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

In the public 4e data, *Invoke - Shallya*, *Invoke - Ranald*, *Invoke - The Night Prowler*, *Invoke - The Gamester*, *Invoke - The Deceiver* and *Invoke - The Protector* are in the Bless group instead of the Invoke group, so they are missing from Invoke. Fix with a `db/scripts` fix script.

## Backend

### HG-13 `go vet` warnings
Backend · 2026-09-30

Unkeyed `bson.E` struct literals in `internal/dependencies/mongodb/user.go`.

## Frontend

### HG-15 One standard picker (select table)
Frontend · 2026-10-03

The pickers used to choose content (trappings, skills, talents, traits, qualities and flaws…) come in many variants that don't look good together: `SelectTable` (checkbox), `SelectIdNumberTable` (number in the modal), `SelectIdValueTable` (value in the page table, "Add" for repeatable entries), plus the character editor's `CharacterSkills`, `CharacterTalents`, `CharacterItems` and `CharacterCareer`. Goal: one convenient, better-looking pattern. Purely UX. The popups are already one component (`ChecklistPicker`, R5 of `docs/ui-refactoring.md`); what differs is the tables on the page.

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

### HG-28 "Shared by me" icon has no colour
Frontend · 2026-10-15

`components/content/list/visibilityKind.ts` uses `text-shared-by-me-icon`, but `style.css` defines the colour as `--color-shared-icon`. Tailwind's palettes are off, so the class produces nothing and the list rows' "Shared by me" icon takes the text colour. Rename one side to match.

### HG-30 Content list misses an edition switch during loading
Frontend · 2026-10-15

`useWhList.loadWhList` (`composables/whList.ts`) returns at once while a load is running, so switching edition while a list loads keeps the old edition's list. A failed load also leaves `apiError` set after a later successful load.

### HG-31 4e generator help text
Frontend · 2026-10-15

In `EditCharacter4e.vue` the generator help repeats "Generating will override all current entries…" twice and has the typo "sills" (skills).

### HG-34 Integer validation message
Frontend · 2026-10-15

`validIntegerFn` in `services/wh/core/validators.ts` says "This field an integer between … and …" (a verb is missing), shown under every whole-number field (XP, wealth, Sin, Corruption…).

### HG-32 Cache content lists for the session
Frontend · 2026-10-15

Every visit to a list page, and every opening of an editor, fetches the content lists again (the 5e character editor up to 16 lists plus generation data). Idea: a shared store per content type and edition that `useWhList` reads through, with one request shared by simultaneous callers. Drop a type (both editions) on save, copy and delete, and everything on login/logout (lists depend on the user). Changes from other tabs or linked accounts then show only after a reload; a stale-while-revalidate variant keeps data fresh but saves no requests. Cached entries are shared mutable models, so pages must not change them (`copyWh` pushes into the list today). Measure first (load time and size of the trappings list, opening a 5e character with 4e content) and decide whether it is worth it.

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

### HG-35 Decide on end-to-end tests (Playwright)
Tests · 2026-10-15

Decide whether to add a few Playwright smoke tests against the local stack: log in, create/save/delete content, generate/save/view a character, the print view. They would replace the manual browser checks done after UI changes and are the only tests that cover real dialogs, CSS and the real API. Costs: the API and MongoDB (with test data and a test account) must run during the tests, the tests are slower and flakier than unit and component tests, and CI would need the same setup. Component tests (Vitest, happy-dom) already cover component logic.
