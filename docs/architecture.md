# Architecture

Hammergen is a Warhammer Fantasy Roleplay (WFRP) character generator and content database for the 4th and 5th editions, at https://hammergen.net. Users browse public content (careers, skills, talents, trappings, spells…), create custom content, and create, generate, view, print and export characters.

## Repository layout

| Path | What |
|---|---|
| `src/api-go` | Go backend (API) |
| `src/frontend` | Vue 3 + TypeScript frontend (Vite, Tailwind v4, Vitest) |
| `db/scripts` | Python (pymongo) scripts for data imports and fixes |
| `db/data` | Data files used by the scripts (gitignored, local only) |
| `db/*.sh` | Backup and restore helpers (`mongodump`/`mongorestore`) |
| `deployment` | GCP deploy config (`gcp/*/config.json` are gitignored) and Docker files |
| `.github/workflows` | Lint/test on PRs; manual deploy of backend and frontend |
| `books/` | Rulebooks as PDF and text (gitignored; see `AGENTS.md`) |
| `docs/` | `issues.md` (backlog), `architecture.md` (this file), `operations.md` (running, data, deploying) |
| `roadmap.md`, `notes.md` | Long-term tech wishes; rules notes on magic |

## Backend (`src/api-go`)

- `cmd/wfrp`: entry point. `internal/config/config.go`: settings from `HAMMERGEN_*` env vars (envconfig, with defaults).
- `internal/http`, `internal/dependencies/gin`: HTTP server and routes (gin). Content endpoints are `api/wh/<type>`; characters `api/wh/character`; generation data `api/wh/generation`.
- `internal/services`: business logic (`wh.go` for all content and characters, `user.go`).
- `internal/domain/warhammer`: domain types (one file per type), validation (`go-playground/validator` tags plus per-edition `ValidateEdition`), conversion of characters to full characters (`ToFull`).
- `internal/dependencies/mongodb`: MongoDB access (driver v2). Other dependencies: JWT, Mailjet email, reCAPTCHA, and mock email/captcha for local work.
- Validation is deliberately light: basic per-field checks and a few cross-field rules; no cross-reference validation (e.g. ids are not checked to exist).

## Frontend (`src/frontend/src`)

- `views/`: route pages only. `Content/List` (content lists), `Content/Edit` (content editors, `EditCareer.vue`…), `Character` (character list, editors and sheets per edition: `EditCharacter4e/5e.vue`, `ViewCharacter4e/5e.vue`, chosen from the character's own edition, a new character uses the selected edition), `Home`, `About`, `User`.
- `components/`: the parts of the pages, in folders. Shared kinds, used by several features: `ui/` (generic: buttons, links, alerts, `ModalWindow`, `HelpButton`, `PageHeader`…), `form/` (inputs and checkboxes), `sheet/` (the paper character sheet look: `SheetTable`, `SheetCard`, `SheetList`…), `picker/` (choosing content: `ChecklistPicker`, `SelectTable`…), `edition/` (edition badges and switch), `editor/` (Save/Delete and visibility, shared by content and character editors). One folder per feature for the parts of its pages: `content/list/` (`ContentListPage`, filters), `content/edit/` (`ContentEditorPage`, sources, modifiers, career levels…), `character/` (`edit/` for the editor's sections, `sheet/` for the character view), `account/`. A component used by one feature lives in that feature's folder.
- `layout/`: the app shell around the pages: `NavBar.vue`, `SideBar.vue`, `AnnouncementBar.vue` and their data (below).
- `composables/`: Vue state helpers (auth, lists, editing, edition, 4e content lists…).
- `services/wh/`: Warhammer domain code, by area:
  - `core/`: what content and characters share: `api.ts` (API types and `createWhApi`/`defineContentApi`), `entity.ts` (base entity, visibility), `edition.ts` (edition types, variant helpers, 4e/5e filter), `validators.ts`, `species.ts`, `attributes.ts`, `characterModifiers.ts`, `source.ts`.
  - `content/`: one file per content type (career, item, itemproperty, mutation, prayer, rune, skill, spell, talent, trait).
  - `character/`: `character.ts` (editable model), `characterFull.ts` (sheet model), `size.ts`, `rules/` (`rules4e.ts`, `rules5e.ts`, `rules.ts` picks by edition), `csv/` (CSV export per edition), `generation/` (`shared/`, `4e/`, `5e/` generator code and the generation data API).
- `utils/`: generic helpers (random, clone, equality, currency…).
- `services/auth.ts`, `services/user.ts`: login and account.
- `layout/navigation.ts`: the navigation links (Characters, the Compendium content types grouped in sections), shared by the top bar (`NavBar.vue`, large screens) and the slide-in sidebar (`SideBar.vue`, small screens).
- `style.css`: the Tailwind theme. Tailwind's built-in palettes are switched off, so only the colours defined there exist (e.g. `bg-red-500` does nothing). Greys are one scale, `neutral-50`…`950`, plus `white`/`black`; every other colour is named by what it is for: `brand` (oxblood: top bar, dark buttons, accents; `brand-dark`, `brand-rule`), `parchment` (text on brand and light accent surfaces; `-light`, `-dark`), `link`, `editable` (the faint yellow of editable cells), `error`, `success`, `danger` (deleting; `-border`, `-hover`), `alert-error-*` and `alert-success-*` (`AlertBlock`), and the visibility icon colours `public-icon`, `shared-icon`, `shared-with-me-icon`. The comments in the file say where each is used; change a colour there to restyle everything that uses it.
- `layout/announcement.ts`: the text of the announcement bar above the navigation (`AnnouncementBar.vue`), linking to the Updates tab of About (`views/About/UpdateList.vue`). A visitor who opens Updates from the bar or dismisses it doesn't see it again until the text changes; `null` turns the bar off.

### Code organisation rules

- Imports from outside the importing file's folder use the `@/` alias (`@/components/ui/AppButton.vue`); same-folder imports use `./`.
- Route names are typed (`RouteName` in `router.ts`); the id of an entry not saved yet is `NEW_ID` (`isNew(id)`), never the `"create"` literal.
- One file per topic, named with a noun for the topic (`skills.ts`, `trappings.ts`, `groups.ts`). No verb file names (`generateX.ts`), no `utils`/`common`/`helpers` grab-bags, and not one file per function. Size alone never decides whether something gets its own file; small helpers go into the topic that uses them.
- A topic file holds everything about the topic: types, helpers, the generator step and the editor's Generate/Add action.
- Large data tables live in their own files (e.g. `generation/shared/data/names.ts`).
- Edition-specific code lives in `4e/` / `5e/` folders (or files) with the edition in the file name (`skills4e.ts`, `rules5e.ts`); shared code has no suffix.
- Tests: one `<module>.spec.ts` next to the module it tests. Test only exported functions that other code uses; helpers used by a single tested function are tested through it and not exported. Shared test helpers sit next to the specs (`fixtures*.ts`) or in `src/testing.ts`. ESLint forbids app code from importing specs, fixtures, `testing.ts` or `vitest`.
- Component tests (`<Component>.spec.ts` next to the `.vue` file) start with `// @vitest-environment happy-dom`, mount with `@vue/test-utils` and `componentStubs` (`src/testing.ts`), and mock `@iconify/vue` (Iconify would fetch icons over the network). They test what the user sees and does (rendered rows, clicks, typing, emitted events), not internals. `vue-tsc` also reports component tags used without an import (`checkUnknownComponents` in `tsconfig.json`).

## Editions (4e and 5e)

Both editions exist side by side permanently; 4e behaviour stays as it was before 5e.

### Content

- Every content document (MongoDB) has per-edition variants under one id: `{ _id, ownerid, visibility, editions: { "4e": {...}, "5e": {...} } }`. A document may have one or both variants. BSON keys are lowercase.
- A 4e item "has a 5e version" exactly when its 5e variant exists. Link a 5e variant to a 4e document only when the match is clearly 1-to-1 (renames are fine, e.g. Diceman → Dicer); for splits, merges or doubtful matches create a separate 5e-only document. Linking is permanent in practice.
- List endpoints take `?edition=` and return only that edition's variant; editors load the whole document. Full characters (`?full=true`) are resolved in each character's own edition and need no `?edition=`. The content editors have a 4e/5e toggle.
- Owner and visibility are shared by both variants. Public content is admin-only; users create custom content in either edition.
- Everything that differs between editions lives inside the variant: name, description, source and page, type, group membership, rules fields. Fields that exist in one edition only are optional (`omitempty`) on the shared Go/TS type, with per-edition rules in `ValidateEdition`.
- Sources: 5e core rulebook is source `44`. 5e content can use any source (4e books included); 4e content any but `44` (`sourcesByEdition`).
- Generation data (species skills/talents, Random Talents, class trappings) is one document per edition in the `other` collection: `generationProps` (4e) and `generationProps5e`, served by `api/wh/generation?edition=`.

### Characters

- A character has a fixed `edition`, chosen when it is created; it cannot change, and there is no 4e → 5e conversion.
- 4e characters use 4e content and rules only, unchanged.
- 5e characters use 5e rules and 5e content. Species: only Human (stored as Human (Reikland)), Dwarf, Halfling, High Elf, Wood Elf.
- **Allow 4e content** (5e characters, one-way: can be turned on, never off; the API enforces it): the character may also use 4e content that has no 5e version. Such content is badged "4e" in pickers (with a 5e/4e/both filter) and marked "(4e)" on the sheet and CSV. 4e trappings count fully (encumbrance, damage, AP); 4e talents, traits and mutations are shown but their modifiers are not applied, and a warning lists the ignored modifiers; 4e skills show their value as usual; 4e careers can be current or past careers.
- The current career is optional (a character can have none).
- Rules automation is "sheet values only": derived values are calculated; XP (current/spent) are typed-in numbers.

### 5e rule decisions

- Advances are stored as points in both editions; a 5e Advance is +5 (editor step 5).
- Career Advancement Tracker (`careerTicks`, 0–36): one running count for the current career; levels at 10/22/36; past careers keep no count; filled in by hand (the generator sets it).
- Size: five 5e steps, Small to Monstrous (no Tiny/Little). Wounds by size: Small 2 × TB; Average SB + 2 × TB + WPB; larger sizes multiples of that.
- Shields are armour in 5e (armour group Shield, AP, no locations); in 4e they stay melee weapons. 5e has no Parry or Engineering melee groups; armour groups differ per edition.
- 5e has no Resilience/Resolve; the sheet shows Fate and Fortune.
- Parameterised qualities are one entity per value, as in 4e (e.g. *Inflict (Prone)*).
- Talent max rank 999 means unlimited. 5e talents use only `maxRank` (no characteristic bonuses) and have no `tests`.
- Modifier effects per edition: 4e Hardy; 5e also Strong Back and Sturdy. Luck and Fear are not modelled.
- 5e sheet: Language skills in their own Known Languages block; a Shield row in armour.
- Ambitions and Appearance use the description and notes for now (HG-7).

### Character generator

- Species and career are chosen in the form, not rolled. Separate generators per edition (`generation/4e/generator4e.ts`, `generation/5e/generator5e.ts`) reuse the shared steps.
- The 5e generator uses 5e content only, even when the character allows 4e content.
- 5e level 1: characteristics are "kept in order" (2d10 + species, plus 6 points spread over the three level 1 career characteristics, added to the rolls); species Fate/Fortune; fluent languages +30; five species skills +5; eight career skill Advances with at most +15 per skill; species talents (choices and Random Talents) plus one career talent; class trappings (all carried; players equip them); 5e starting wealth.
- 5e levels 2–4: per level, one career talent, one +5 Advance in each unlocked characteristic, the rest career skill Advances until the tracker reaches 10/22/36; XP spent with the 5e cost table plus 100 XP per level.
