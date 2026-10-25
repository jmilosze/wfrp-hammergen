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
| `docs/` | `issues/` (backlog: functional, UI, technical), `architecture.md` (this file), `operations.md` (running, data, deploying) |
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
- `components/`: the parts of the pages, in folders. Shared kinds, used by several features: `ui/` (generic: buttons, links, alerts, `ModalWindow`, `ActionMenu`, `HelpButton`, `PageHeader`…), `form/` (inputs and checkboxes), `sheet/` (the paper character sheet look: `SheetTable`, `SheetCard`, `SheetList`…), `picker/` (choosing content: `ChecklistPicker`, `SelectTable`…), `edition/` (edition badges and switch), `editor/` (Save/Delete and visibility, shared by content and character editors), `wizard/` (`WizardFrame`: the frame of a step-by-step creator, with no knowledge of the steps; guided character creation), `filter/` (content filters: every filter of a content type is in its file, e.g. `itemFilters.ts`; its list page uses all of them through `composables/listFilters.ts`, a character editor picker the ones it needs through `idFilter`; `FilterSections` shows them). One folder per feature for the parts of its pages: `content/list/` (`ContentListPage`, `FilterSidebar`), `content/edit/` (`ContentEditorPage`, sources, modifiers, career levels…), `character/` (`edit/` for the editor's sections, `sheet/` for the character view, `guided/` for guided creation per edition, e.g. `guided/5e/GuidedCreation5e.vue`), `account/`. A component used by one feature lives in that feature's folder.
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
- Component tests (`<Component>.spec.ts` next to the `.vue` file) start with `// @vitest-environment happy-dom`, mount with `@vue/test-utils` and `componentStubs` (`src/testing.ts`), and mock `@iconify/vue` (Iconify would fetch icons over the network). They test what the user sees and does (rendered rows, clicks, typing, emitted events), not internals, and find elements by their text, ARIA attributes or components, never by styling classes (`findButton`, `buttonNames` in `src/testing.ts`).
- A model's `isEqualTo` is tested with `testIsEqualTo` (`src/testing.ts`): it changes each value of the model in turn, so a new field is covered without a new test; the model's ignored fields and order-insensitive arrays are passed as options. No per-field equality tests.
- Templates are type-checked strictly (`strictTemplates` in `tsconfig.json`): a component tag without an import, or an attribute, prop or `@event` a component doesn't declare, is an error, so typos and props left over from a rename fail `vue-tsc`. A component that wraps a native element and passes other attributes to it declares them as types only, e.g. `defineProps<{ … } & /* @vue-ignore */ ButtonHTMLAttributes>()` (`AppButton`, `IconButton`, `ButtonLink`, `NavLink`, `FormCheckbox`, `EditionBadge`). Attributes on plain elements that Vue's types lack (`data-sheet-label`, `data-print-desktop`, `popover`) are declared in `src/htmlAttributes.d.ts`.

## Editions (4e and 5e)

Both editions exist side by side permanently; 4e behaviour stays as it was before 5e.

### Content

- Every content document (MongoDB) has per-edition variants under one id: `{ _id, ownerid, visibility, editions: { "4e": {...}, "5e": {...} } }`. A document may have one or both variants. BSON keys are lowercase.
- A 4e item "has a 5e version" exactly when its 5e variant exists. Link a 5e variant to a 4e document only when the match is clearly 1-to-1 (renames are fine, e.g. Diceman → Dicer); for splits, merges or doubtful matches create a separate 5e-only document. Linking is permanent in practice.
- List endpoints take `?edition=` and return only that edition's variant; editors load the whole document. Full characters (`?full=true`) are resolved in each character's own edition and need no `?edition=`. The content editors have a 4e/5e toggle.
- Owner and visibility are shared by both variants. Public content is admin-only; users create custom content in either edition.
- Everything that differs between editions lives inside the variant: name, description, source and page, type, group membership, rules fields. Fields that exist in one edition only are optional (`omitempty`) on the shared Go/TS type, with per-edition rules in `ValidateEdition`.
- Sources: 5e core rulebook is source `44`. Content of either edition can use any source (4e books for 5e content; `44` for 4e content, e.g. the 4e variant of a trapping that only 5e careers have).
- Career trappings: each career level has `trappings` and `money` (both editions; `CareerLevel` in `career.go`, `content/careerTrapping.ts`). `trappings` is a list of entries, one per item of the book's list; an entry has one or more options (several are a choice of one); an option is one or more trappings that come together ("Bow with 10 Arrows"), each `{id, number, value}`: `number` is a number or dice with an optional modifier ("10", "1d10", "2d6+3"), `value` the note copied to the character's trapping (at most 40 characters, no brackets of its own). `money` is coins (`gold`, `silver`, `brass`) with a number or dice. `items` is the old free text: kept for careers that have it (shown only when not empty), not used by the generator. The public 5e careers have trappings as data (HG-40); 4e careers still have text (HG-59).
- Trapping content rules (for careers and in general):
  - People, groups, places and the like a career gives are generic trappings with the details in the note, not one trapping each: Retainer (a servant, aide, apprentice…), Command (people or a place the character leads or runs for others), Contact, Holding (a place the character owns or may use, e.g. a townhouse, a warehouse, a library), Reputation, Animal Companion, Magic Item. A place or vehicle the rulebook lists as a trapping keeps that trapping (Workshop, Large Workshop at double the cost, River Barge "with Crew"); a vehicle with crew it doesn't list is Command; one without crew is a trapping of its own (Riverboat, Handcart). The tools and workshop of a trade are one Trade Tools and one Workshop with the trade as note.
  - Quality versions are their own trappings named "Base (Quality)" ("Sword (Fine)", "Blanket (Ugly)"): the base's values and qualities plus the quality; each Quality doubles the price and makes it one step rarer, each Flaw halves the price and makes it one step commoner; Lightweight is −1 Enc; "Fine 2" counts as one Quality. Careers that give "a Quality X" get the Fine version.
  - A trapping the rulebook names only in careers has the source note "Career trapping" (`{"44": "Career trapping"}`); price, Enc and availability are then estimates from similar book trappings. New 5e trappings made for careers also get a 4e variant (with WFRP 4e "Career trapping" when a 4e career has them).
- Generation data (species skills/talents, Random Talents, class trappings) is one document per edition in the `other` collection: `generationProps` (4e) and `generationProps5e`, served by `api/wh/generation?edition=`. `generationProps5e` also has the species' fluent languages and, for guided creation, the Random Class and Career Table of each species (`careerTable`, ids are public 5e careers, so it lives in the data). Table rows are `{id, minRoll, maxRoll}`, maxRoll not included (`generation/shared/rollTables.ts`). The Species Table needs no ids from the data and is a constant (`generation/5e/species5e.ts`).

### Characters

- A character has a fixed `edition`, chosen when it is created; it cannot change, and there is no 4e → 5e conversion.
- 4e characters use 4e content and rules only, unchanged.
- 5e characters use 5e rules and 5e content. Species: only Human (stored as Human (Reikland)), Dwarf, Halfling, High Elf, Wood Elf.
- **Allow 4e content** (5e characters, one-way: can be turned on, never off; the API enforces it): the character may also use 4e content that has no 5e version. Such content is badged "4e" in pickers (with a 5e/4e/both filter) and marked "(4e)" on the sheet and CSV. 4e trappings count fully (encumbrance, damage, AP); 4e talents, traits and mutations are shown but their modifiers are not applied, and a warning lists the ignored modifiers; 4e skills show their value as usual; 4e careers can be current or past careers.
- The current career is optional (a character can have none).
- Trappings (equipped, carried, stored) are entries of item, number and value (`IdNumberValue`): the value is an optional note of up to 40 characters, e.g. Hand Weapon with "Axe", shown under the name in the editor (edited with the row's Note button, `NoteModal`) and as "Hand Weapon (Axe)" on the sheet and in the CSV (`printItemWithValue`, which never replaces a bracket of the item's name). On a narrow screen a row's buttons are in a ⋯ menu (`components/ui/ActionMenu.vue`). The same trapping can be listed more than once, with the same or different values: each Add in the trappings popup is a row of its own (the popup shows "×N" rows), and rows are never merged on save; moving one between Equipped, Carried and Stored joins an identical row there. Old characters have no values (stored only when not empty).
- The editor's skills, talents and trappings pickers mark (in the rows' notes, e.g. "Advanced · Int · Career · Species", and with a "Character" filter) what the current career, species and class give (`character/marks.ts`). Career skills (both editions) and 5e career talents come from the current level plus each lower level of the same career that is a past career (levels skipped when entering a career don't count); 4e career talents from the current level only (`careerTalentsFromLowerLevels` in the rules); career trappings from the current level only. A group gives all its members, a choice all its options. A species with Random Talents also marks the talents of the Random Talents table as "Species (Random)" (filtered as Species). The characteristics table highlights the career characteristics, counted like career skills (`careerAttributes`).
- Rules automation is "sheet values only": derived values are calculated; XP (current/spent) are typed-in numbers.

### 5e rule decisions

- Advances are stored as points in both editions; a 5e Advance is +5 (editor step 5).
- Career Advancement Tracker (`careerTicks`, 0–36): one running count for the current career; levels at 10/22/36; past careers keep no count; filled in by hand (the generator sets it).
- Size: five 5e steps, Small to Monstrous (no Tiny/Little). Wounds by size: Small 2 × TB; Average SB + 2 × TB + WPB; larger sizes multiples of that.
- Shields are armour in 5e (armour group Shield, AP, no locations); in 4e they stay melee weapons. 5e has no Parry or Engineering melee groups; armour groups differ per edition.
- 5e has no Resilience/Resolve; the sheet shows Fate and Fortune.
- Parameterised qualities are one entity per value, as in 4e (e.g. *Inflict (Prone)*).
- Talent max rank 999 means unlimited. 5e talents use only `maxRank` (no characteristic bonuses) and have no `tests`.
- Modifier effects: Hardy, Strong Back and Sturdy in both editions, with each edition's rules (4e Encumbrance limit: Strong Back +1 and Sturdy +2 per rank; 5e: Strong Back +1, or +3 when taken twice, and Sturdy doubles SB). Luck and Fear are not modelled.
- 5e sheet: Language skills in their own Known Languages block; a Shield row in armour.
- Ambitions and Appearance use the description and notes for now (HG-7).

### Character generator

- Species and career are chosen in the form, not rolled. Separate generators per edition (`generation/4e/generator4e.ts`, `generation/5e/generator5e.ts`) reuse the shared steps.
- Rule steps are split so guided creation and the generator share them: what the player can choose from, a random choice, and applying a choice without randomness; rolls the player keeps (quantities, money, Random Talents) are separate roll functions whose results are stored. Entries with options (trapping choices, "A,B" species talents) are settled as an option index per entry (`randomOptions` in `utils/random.ts`). 5e level 1 is `generation/5e/creation5e.ts`: `CreationChoices5e` holds every choice and kept roll, and `buildCharacter5e` makes the character from them. The 5e generator fills the choices at random (no creation bonuses, as species and career are chosen), builds level 1 and buys levels 2–4 on top; it settles the career's group skills and talents once for all levels, so higher levels keep level 1's specialisations. A Random Talents row is rolled at most once per character. The 4e-only steps are not split yet (HG-43). Guided creation for 5e: the new-character page swaps the sheet for a wizard (`components/wizard/WizardFrame.vue`, edition-free; the 5e steps in `components/character/guided/5e/`). Its state (`generation/5e/guided5e.ts`, `GuidedState5e`) keeps every roll until Start over, so going back never gives a new first roll; after each change the later choices are checked and only those that no longer fit are cleared and marked until the player opens their step. The career step offers the user's 5e careers that have a level 1. Finish turns the state into `CreationChoices5e` and builds the character with `buildCharacter5e`.
- The 5e generator uses 5e content only, even when the character allows 4e content.
- 5e level 1: characteristics are "kept in order" (2d10 + species, plus 6 points spread over the three level 1 career characteristics, added to the rolls); species Fate/Fortune; fluent languages +30; five species skills +5; eight career skill Advances with at most +15 per skill; species talents (choices and Random Talents) plus one career talent; class trappings (all carried; players equip them); 5e starting wealth.
- Career trappings (both editions, `generation/shared/trappings.ts`): a character of level N gets the trappings and money of career levels 1 to N next to the class trappings: one option of each choice, picked at random; quantities rolled; notes as the trappings' values; trappings that can't be carried go to Stored; money is added to the coins.
- 5e levels 2–4: per level, one career talent, one +5 Advance in each unlocked characteristic, the next level's trapping entries and money items (one tick each), the rest career skill Advances until the tracker reaches 10/22/36; XP spent with the 5e cost table plus 100 XP per level.
