# WFRP 5e — Tracker

Status legend: ✅ done · 🟡 in progress · ⬜ not started · ⏸ blocked · ✘ dropped from scope

Update this file as work progresses. Keep each item small enough to finish in one sitting; link PRs/commits in the Notes column.

---

## Phase 0 — Discovery

| # | Item | Status | Notes |
|---|---|---|---|
| D1 | Inventory what Hammergen models today (entities, derived values, generator) | ✅ | discovery §1 |
| D2 | Species differences | ✅ | discovery §2 |
| D3 | Character creation differences | ✅ | discovery §3 |
| D4 | Advances, XP costs, career progression | ✅ | discovery §4 |
| D5 | Skills differences | ✅ | discovery §4.3 |
| D6 | Talents: full list, renames, max ranks, mechanics | ✅ | appendix C |
| D7 | Careers: extract 5e data, compare with 4e core | ✅ | appendix A, `data/careers-5e.json` (machine-extracted) |
| D8 | Weapons and armour comparison | ✅ | appendix B |
| D9 | Qualities and flaws | ✅ | discovery §7.2 |
| D10 | Magic: spell format, lores, talents, names/CN comparison | ✅ | discovery §8 |
| D11 | Religion: blessings, miracles, names comparison | ✅ | discovery §10 |
| D12 | Creature traits | ✅ | discovery §11 |
| D13 | Corruption and mutations | ✅ | discovery §9.6 |
| D14 | Character sheet comparison | ✅ | discovery §12 |
| D15 | Derived attributes (wounds, movement, size, encumbrance, fate/fortune) | ✅ | discovery §9 |
| D16 | Verify `careers-5e.json` against the book (advance schemes, statuses, skills, talents, trappings, income skill) | ✅ | 2026-10-06, against the 2026-10-01 PDF: advance schemes read from the page icons for all 64 careers (all match); skills, talents, trappings, status, species, income skill and tagline re-extracted with fonts and compared with the first extraction (only the book's own updates and extraction noise differed); file rewritten from the new PDF |
| D17 | Compare non-weapon trappings (containers, clothing, tools, food, animals/vehicles, poisons, herbs, prosthetics, magic items, hirelings) with DB | ✅ | 2026-10-06, done while preparing `data/items-5e.json` (C6a) |
| D18 | Compare spell texts/ranges/durations for same-named spells | ✅ | 2026-10-03, done while preparing `data/spells-5e.json` (C6a) |
| D19 | Compare prayer texts for same-named blessings/miracles | ✅ | 2026-10-03, done while preparing `data/prayers-5e.json` (C6a) |
| D20 | Compare skill descriptions | ✅ | 2026-10-05, done while preparing `data/skills-5e.json` (C6a) |
| D21 | Compare mutation effects with DB modifiers | ✅ | 2026-10-03, done while preparing `data/mutations-5e.json` (C6a); 4e modifier errors fixed (see `docs/todo.md`) |
| D22 | Look for published 5e errata / FAQ; check discovery §15 items | ✅ | 2026-10-06: the 2026-10-01 book update (`books/WFRP5_Core_Rulebook_06_10_26.pdf`) compared with the imported data and applied (see log) |
| D23 | Check how 4e supplement content maps to 5e (Appendix I compatibility) — e.g. supplement careers, species, qualities | ⬜ | input for Q-COMPAT |
| D24 | Survey user data: how many characters use Gnome/Ogre/regional species, Resilience/Resolve, runes, supplement content | ⬜ | input for migration planning (Q-SCOPE, Q-SPECIES, Q-CONVERT now decided) |

## Phase 1 — Decisions

All open; see [02-design.md §3](02-design.md#3-decisions).

| # | Decision | Status | Date | Outcome |
|---|---|---|---|---|
| Q-SCOPE | Keep 4e alongside 5e | ✅ | 2026-09-30 | Both, permanently |
| Q-EDITION | Where edition lives | ✅ | 2026-09-30 | Every entity and character has an edition; character edition immutable |
| Q-COMPAT | 4e supplement content in 5e | ✅ | 2026-09-30 | Opt-in, one-way per character; only where no 5e version; 4e talents/traits don't affect stats; not in generator |
| Q-OVERLAP | Same-named content across editions | ✅ | 2026-09-30 | One document per item with per-edition variants (option B, design §4.1a); users copy public items to add their own variants; lists return one variant |
| Q-SPECIES | 5e species list | ✅ | 2026-09-30 | 5 core species only |
| Q-ADV | Advance storage | ✅ | 2026-10-07 | Points, as today; only XP lookup, editor step and creation limits differ |
| Q-TRACKER | Career Advancement Tracker | ✅ | 2026-10-07 | Store ticks: one running count (0–36) for the current career, manual like XP |
| Q-AMBITION | Ambitions / Appearance | ✅ | 2026-10-07 | Not now: description and notes |
| Q-CONVERT | 4e → 5e conversion | ✅ | 2026-09-30 | None (edition is fixed) |
| Q-SIZE | Size scale | ✅ | 2026-10-06 | Revised after the 2026-10-01 book update: 5e has five steps (Small to Monstrous), no Tiny/Little; 5e Small talent not imported (removed from the book) |
| Q-PROPS | Parameterised qualities | ✅ | 2026-10-02 | Parameters that do not change the rules (ratings, targets) become a value on the reference (P4); parameters with their own rules or modifiers (Size, Trained, Mark of Chaos, Breath type) stay separate entities. Was (2026-09-30): one entity per value |
| Q-SHIELD | Shields | ✅ | 2026-09-30 | Armour in 5e (5e rules only for 5e characters); 4e unchanged |
| Q-PRAYER | Prayer classification | ✅ | 2026-09-30 | Keep as is (no deity/type field), both editions |
| Q-RULES | Rules automation level | ✅ | 2026-10-07 | Sheet values only for now; XP typed in as in 4e; no validation |
| Q-DATA | Content entry approach | ✅ | 2026-09-30 | One-off import script for public 5e content; then editor with 4e/5e toggle |
| Q-I18N | Future translations — keep model compatible | ⬜ | | Overlay of text fields per variant, not a variant axis |
| Q-ANALYTICS | How to measure 4e vs 5e usage | ✅ | 2026-09-30 | API-side structured events; DB counts can complement |
| Q-VERSION | How to know a 4e item has a 5e version | ✅ | 2026-09-30 | 5e variant exists on the item |
| Q-4E-EFFECT | Which 4e content affects 5e stats | ✅ | 2026-09-30 | None initially — 4e content is shown but never affects 5e numbers |
| Q-CUSTOM | Custom content per edition / copy to 5e | ✅ | 2026-09-30 | Custom content in either edition; no copy-from-4e helper for now |

## Phase 2 — Design

| # | Item | Status | Notes |
|---|---|---|---|
| S1 | Data model | ⬜ | design §4.1 |
| S2 | API | ⬜ | design §4.2 |
| S3 | Frontend rules | ⬜ | design §4.3 |
| S4 | Editor and sheet | ⬜ | design §4.4 |
| S5 | Generator | ⬜ | design §4.5 |
| S6 | Content plan | ⬜ | design §4.6 |
| S7 | Migration and rollout | ⬜ | design §4.7 |

## Phase 3 — Implementation

Delivered in four phases (see [02-design.md §2a](02-design.md#2a-delivery-phases-agreed-2026-09-30)). Each is broken down further once its design is done.

### Phase 3.1 — 5e content in the DB

| # | Item | Status | Notes |
|---|---|---|---|
| C1a | Migrate content documents to `editions.4e` + MongoDB layer reads/writes new format (no API/UI change) | ✅ | [plans/p1-edition-variants.md](plans/p1-edition-variants.md); migrated and deployed local → staging → production 2026-09-30; production backup `db/hammergen_30_09_2026_before_p1` |
| C1b | `edition` in API (per-variant routes), `edition` on characters, frontend passes edition | ✅ | [plans/p2-edition-api.md](plans/p2-edition-api.md); deployed to local, staging and production 2026-09-30 (character edition in `object.edition`); production backup `db/hammergen_30_09_2026_before_p2` |
| C1c | Values on references: one entity per trait/quality family whose parameter (rating or target) does not change its rules; the value is stored on the character/item reference | ✅ | [plans/p4-values.md](plans/p4-values.md); blocks C6. Staging restored from `db/hammergen_01_10_2026` and migrated 2026-10-02; production migrated 2026-10-02, backup `db/hammergen_02_10_2026_before_p4`; names with placeholders (`rename_value_families.py`) on staging and production 2026-10-03, backup `db/hammergen_03_10_2026_before_rename`; new build deployed to production |
| C2 | 5e-specific content model changes (talent max ranks/modifiers, qualities & flaws, shields as armour, armour groups/penalty, species, career income skill) | ✅ | design §4.1; done: career income skill, 5e career species, talents (max rank, no tests, Strong Back/Sturdy effects), qualities and flaws (no model change), shields and armour/melee groups; prayers unchanged (Q-PRAYER); size scale unchanged (Q-SIZE) |
| C3 | 5e core source | ✅ | source `44` "WFRP 5e"; the editor's source picker offers Custom + WFRP 5e for 5e, all 4e sources for 4e (no API check) |
| C4 | Browse/search/filter content by edition in lists (R2) | ✅ | [plans/p3-edition-ui.md](plans/p3-edition-ui.md); global 4e/5e switch |
| C5 | Content editor with 4e/5e toggle (create/edit either or both variants; R13) | ✅ | [plans/p3-edition-ui.md](plans/p3-edition-ui.md); missing variant pre-filled from the other one; delete removes the whole document |
| C6a | Extract and verify 5e core data (careers, skills, talents, items, qualities/flaws, spells, prayers, traits, mutations) | ✅ | All types imported to staging and production by 2026-10-06. Careers: `data/careers-5e.json` (verified, D16) → `data/careers-import-5e.json` (64 careers joined to the core 4e careers incl. 5 renames Advisor → Adviser, Bawd → Knave, Huffer → Pilot, Seaman → Sailor, Road Warden → Roadwarden; 4e descriptions kept, Ulthuan remarks dropped; skills/talents referenced by 5e name and resolved per database). Career choices ("A or B") are choice group skills/talents as in 4e: 29 (8 existing 4e groups given a 5e variant incl. Channelling - Wind of Magic and Arcane Magic - Wind of Magic, 21 new 5e-only with fixed ids), members get the group in their 5e group list; "(Any One)", "(All)", "(as Trade)" → the group. Skills, talents (with choice groups) and careers imported to staging and production 2026-10-06, production backup `db/hammergen_06_10_2026_before_5e_careers`. Traits: `data/traits-5e.json` regenerated 2026-10-03 for values (89 traits: 86 joined to 4e, 3 5e-only). Mutations: `data/mutations-5e.json` (55: 49 joined to 4e incl. the six Extra Mouth and six Patchy Feathers locations, 6 5e-only Spiny Protrusions locations); `db/scripts/fix_4e_mutations.py` (merge duplicate Panicked Urgency, rename to Profane Urgency / Thrill Hunter) run on staging and production 2026-10-03, production backup `db/hammergen_03_10_2026_before_mutation_fix`; its Patchy Feathers split (one mutation per hit location) run on staging and production 2026-10-03, production backup `db/hammergen_03_10_2026_before_patchy_feathers`; 5e mutations imported to staging and production 2026-10-03, production backup `db/hammergen_03_10_2026_before_5e_mutations`. Qualities and flaws: `data/properties-5e.json` (36: 34 joined to 4e incl. 4e Shield (Rating) → 5e Shield armour quality, 2 5e-only: Inflict (Condition), Parry); imported to staging and production 2026-10-03 (`import_5e.py --type property`), production backup `db/hammergen_03_10_2026_before_5e_properties`. Prayers: `data/prayers-5e.json` (79: all joined to 4e; renamed in 5e: Manann's Bounty → Manalt's Bounty, Stay Lucky → Cheat the Odds, Rich Man, Poor Man, Beggar Man, Thief → Trickster's Glamour, You Ain't Seen Me, Right? → You Saw Nothing); imported to staging and production 2026-10-03 (`import_5e.py --type prayer`), production backup `db/hammergen_03_10_2026_before_5e_prayers`. Spells: `db/scripts/fix_4e_spells.py` (merge duplicate Goodwill and Acquiescence) run on staging and production 2026-10-03, production backup `db/hammergen_03_10_2026_before_spell_merge`; `data/spells-5e.json` (146: 140 joined to 4e incl. 4 renames T'Essla's Arc → Coruscating Arc, Fat of the Land → Fare of the Land, Pha's Protection → Phâ's Protection, Curse of Ill-Fortune → Curse of Ill Fortune; 6 5e-only: Halétha's Joy, Shepherd's Eye, Glamour, Make Hale, Festering Inflammation, Miasma of Pestilence); imported to staging and production 2026-10-03, production backup `db/hammergen_03_10_2026_before_5e_spells`. Talents: `data/talents-5e.json` (354: 166 base talents, Small not imported per Q-SIZE, 15 groups incl. Impassioned Zeal plus Etiquette - Guilder, 174 members; 327 joined to 4e, 27 new 5e-only members); imported to staging and production 2026-10-04, production backup `db/hammergen_04_10_2026_before_5e_talents`. Skills: `data/skills-5e.json` (360: 45 base skills, Sail no longer a group so its ship members stay 4e-only; 18 groups incl. sub-groups Lore - Local, Secret Signs - Guilder, Secret Signs - Knight, Language - Guilder, which are not members of their parent group; 336 joined to 4e incl. 9 renames Art - Tatoo → Tattooing, Entertain - Fortune Telling → Fortunetelling, Language - Thief → Thieves Tongue, Lore - Empire → The Empire, Lore - Daemonology → Daemons, Melee - Two Handed → Two-handed, Secret Signs - Hedge Witch → Hedgefolk, Trade - Boatbuilding → Boatbuilder, Trade - Blacksmith → Smith; 24 new 5e-only members); imported to staging and production 2026-10-05 (`import_5e.py --type skill`), production backup `db/hammergen_05_10_2026_before_5e_skills`; `db/scripts/fix_4e_skills.py` (clear the stale 4e group of group skill Secret Signs - Knight) run on staging and production 2026-10-05, production backup `db/hammergen_05_10_2026_before_skill_fix`. Trappings: `db/scripts/fix_4e_items.py` (merge duplicate public Blanket and Match, keeping the copies used by generation props) run on staging and production 2026-10-06, production backup `db/hammergen_06_10_2026_before_item_merge`; `data/items-5e.json` generated (468: 234 joined to 4e, 52 5e-only, 182 copies of unmatched public 4e Other items; renames incl. Chainmail → Mail, Leather Skullcap → Leather Coif, Davrich Lamp → Feinkopf Lamp, Winds of Magic robes → Wizard's Robes; 4e shields → 5e Shield armour; 4e Black Lotus → Black Lotus (Sap)); imported to staging and production 2026-10-06 (`import_5e.py --type item`), production backup `db/hammergen_06_10_2026_before_5e_items` |
| C6b | One-off import script: add `editions.5e` to matching public documents, create 5e-only public documents | ✅ | `db/scripts/import_5e.py --type trait|mutation|property|prayer|spell|talent|skill|item|career` (`--update` replaces changed variants; 5e-only entries may carry a fixed `id`; careers resolve skill/talent names in the target database). Q-DATA; name matching + rename table; link only clear 1-to-1 matches. Traits: `db/scripts/import_5e.py --type trait` (sets `hasValue` per variant); imported to staging and production 2026-10-03 (production backup `db/hammergen_03_10_2026_before_5e_traits`) |
| C7 | Tests | ✘ | skipped 2026-10-07 |

### Phase 3.2 — 5e characters (5e content only)

| # | Item | Status | Notes |
|---|---|---|---|
| H1 | Character edition, fixed at creation (R3); 4e characters unchanged (R4) | ✅ | [plans/p5-characters.md](plans/p5-characters.md); character list to follow the global edition switch (today fixed to 4e via `CHARACTER_EDITION`); hide "create" for an edition without character support |
| H2 | 5e character fields (no Resilience/Resolve; Ambitions/Appearance/tracker per decisions) | ✅ | [plans/p5-characters.md](plans/p5-characters.md); Q-AMBITION, Q-TRACKER |
| H3 | 5e derived values (characteristics, skills, wounds, movement, size, encumbrance incl. max, fate/fortune) | ✅ | [plans/p5-characters.md](plans/p5-characters.md); Q-ADV; five size steps; wounds by size as p. 361 (Small 2 × TB) (Q-SIZE) |
| H4 | 5e character editor restricted to 5e content | ✅ | [plans/p5-characters.md](plans/p5-characters.md) |
| H5 | 5e sheet, print, CSV | ✅ | [plans/p5-characters.md](plans/p5-characters.md); discovery §12 |
| H6 | Tests (both editions) | ✅ | [plans/p5-characters.md](plans/p5-characters.md) |

### Phase 3.3 — Opt-in 4e content for 5e characters

| # | Item | Status | Notes |
|---|---|---|---|
| O1 | One-way "allow 4e content" switch (R6) | ✅ | [plans/p6-allow-4e.md](plans/p6-allow-4e.md) |
| O2 | Offer 4e content where no 5e version exists (R7) | ✅ | [plans/p6-allow-4e.md](plans/p6-allow-4e.md); Q-VERSION |
| O3 | Show 4e content on sheet (R8, Q-4E-EFFECT) | ✅ | [plans/p6-allow-4e.md](plans/p6-allow-4e.md); trappings count fully, talents/traits/mutations without modifiers (Q-4E-EFFECT) |
| O4 | Tests | ✅ | [plans/p6-allow-4e.md](plans/p6-allow-4e.md) |

### Phase 3.4 — 5e generator

| # | Item | Status | Notes |
|---|---|---|---|
| G1 | 5e generation props (species skills/talents, random talents, class trappings, careers table) | ✅ | [plans/p7-generator.md](plans/p7-generator.md) |
| G2 | 5e creation steps (discovery §3) | ✅ | [plans/p7-generator.md](plans/p7-generator.md) |
| G3 | Higher-level generation (tracker ticks, 100 XP per level, 5e XP costs) | ✅ | [plans/p7-generator.md](plans/p7-generator.md) |
| G4 | Tests | ✅ | [plans/p7-generator.md](plans/p7-generator.md) |

### Analytics (runs alongside the phases)

| # | Item | Status | Notes |
|---|---|---|---|
| A1 | Decide approach and metric list | ✘ | removed from the 5e scope 2026-10-09; moved to `docs/todo.md` |
| A2 | Baseline 4e usage before 5e launches | ✘ | removed from the 5e scope 2026-10-09; moved to `docs/todo.md` |
| A3 | Content browsing/search/custom-content metrics per edition | ✘ | removed from the 5e scope 2026-10-07; moved to `docs/todo.md` |
| A4 | Character create/view/edit/print metrics per edition, "allow 4e content" switch | ✘ | removed from the 5e scope 2026-10-09; moved to `docs/todo.md` |
| A5 | Generator runs per edition | ✘ | removed from the 5e scope 2026-10-09; moved to `docs/todo.md` |
| A6 | Report/dashboard | ✘ | removed from the 5e scope 2026-10-09; moved to `docs/todo.md` |

### Release

| # | Item | Status | Notes |
|---|---|---|---|
| X1 | Release plan per phase (flag, docs, announcement) | ⬜ | |
| X2 | Update site texts that say "4th Edition" only (e.g. `<meta name="description">` in `index.html`, About page) | ✅ | 2026-10-09: meta description, home page (text + 5e announcement banner), How To, About source books (4th/5th Edition lists), Updates entry, 4e generator hint |

---

## Log

| Date | Change |
|---|---|
| 2026-09-30 | Discovery draft 1: docs created, careers/talents/weapons comparisons generated. |
| 2026-09-30 | Q-ADV reworded: advances stored as points, no model change. |
| 2026-09-30 | Requirements R1–R10 agreed; Q-SCOPE, Q-EDITION, Q-COMPAT, Q-OVERLAP, Q-CONVERT decided; Q-VERSION, Q-4E-EFFECT, Q-CUSTOM added. |
| 2026-09-30 | R11 (5e rules only for 5e characters) and R12 (5e species only) agreed; Q-SPECIES, Q-SHIELD decided. |
| 2026-09-30 | R8 widened: no 4e content affects a 5e character's numbers (initially); Q-4E-EFFECT decided. |
| 2026-09-30 | R13 (custom content in either edition, no copy helper for now) agreed; Q-CUSTOM decided. |
| 2026-09-30 | Delivery phases agreed: 5e content → 5e characters → opt-in 4e content → 5e generator; implementation section restructured. |
| 2026-09-30 | R14 analytics (4e vs 5e usage) added; Q-ANALYTICS open; analytics workstream added. |
| 2026-09-30 | Q-ANALYTICS decided: API-side events. |
| 2026-09-30 | Content model brainstorm (design §4.1a): Q-OVERLAP reopened, leaning to per-edition variants in one document; Q-I18N added. |
| 2026-09-30 | Option B chosen (Q-OVERLAP, Q-VERSION decided); public items admin-only, users copy to add variants; list endpoints return one variant. |
| 2026-09-30 | Option B edge cases resolved; Q-PROPS decided (one entity per value). |
| 2026-09-30 | Q-DATA decided (import script, then editor toggle); Q-PRAYER and Q-SIZE deferred. |
| 2026-09-30 | Option B reconsidered against A-with-`replaces` and confirmed; non-1-to-1 cases become unlinked 5e-only items. |
| 2026-09-30 | Plan P1 (edition-variant format migration, backend + frontend) drafted. |
| 2026-09-30 | Plan P1 trimmed to DB format migration + MongoDB layer only (no API/UI/5e changes); agreed, not started. |
| 2026-09-30 | P1: maintenance mode deployed; migration script `migrate_editions.py` added, `find_duplicates.py`/`replace_duplicate.py` switched to `editions.4e`; tested on a restored prod dump. |
| 2026-09-30 | P1: MongoDB layer reads/writes `editions.4e` (characters keep `object`); DB-layer tests against real Mongo added; integration tests pass; old API on original prod dump vs new API on migrated dump gave identical responses (3,467 requests, 39 users). |
| 2026-09-30 | P1 done: migration run on local, staging (6,871 docs) and production (6,876 docs), new backend deployed, smoke tested. |
| 2026-09-30 | Design §4.1a keys corrected to `"4e"`/`"5e"`. Plan P2 (C1b) drafted: `?edition=` query param, per-edition routes only (option A), 5e writes rejected until C2/H1. |
| 2026-09-30 | P2 implemented: `?edition=` required on content/character routes, `edition` in responses, 5e writes rejected, `migrate_character_editions.py`, frontend passes `UI_EDITION` (`4e`); current vs new API on the production backup gave identical responses apart from `edition` (3,467 requests, 39 users). |
| 2026-09-30 | P2 revised: content API uses the `editions` map (optional `?edition` filter on reads, editions in payload on writes, PUT merges variants); `full=true` and career search require `edition`; characters keep `{edition, object}`; no 5e write guard. Frontend and backend now ship together. |
| 2026-09-30 | P2 revised design implemented: `editions` map in content API, `edition` on characters; current vs new API on the production backup identical after mapping `object` ↔ `editions["4e"]` (3,467 requests, 39 users); UI list/view/edit/copy/delete checked against the new API. |
| 2026-09-30 | P2 deployed to production (top-level character `edition`). Follow-up: character edition moved into the character object (`object.edition`), `migrate_character_editions.py` now renames the field; current vs new API on the production backup identical apart from the edition's position (3,467 requests). |
| 2026-09-30 | P2 done: character edition follow-up deployed; all characters have `object.edition` on local, staging and production. |
| 2026-09-30 | Q-PRAYER decided: prayers keep their current shape in both editions; removed from C2. |
| 2026-09-30 | Q-SIZE decided: 5e uses the 4e 7-step size scale and wound formulas (book's "Small" read as "Tiny"); 5e Small talent not imported (no species, career or Random Talent grants it). |
| 2026-09-30 | C2 started: edition-specific fields modelled as optional fields on the shared type plus `ValidateEdition` (design §4.1); career `incomeSkill` added. |
| 2026-09-30 | Career `incomeSkill` is in both editions (4e has one too), optional; when set it must be a level 1 skill. No UI until after the 5e work. |
| 2026-09-30 | C2: 5e careers restricted to the five 5e species (`Career.ValidateEdition`). |
| 2026-10-01 | C2: talent max rank — 999 = unlimited in both editions (limit raised from 99, fixes saving 4e Magnum Opus/Wealthy); 5e uses `maxRank` only. Still open for talents: `tests` in 5e, new effect types. |
| 2026-10-01 | C2 talents: 5e talents have no `tests`; modifier effects are edition-dependent (5e adds Strong Back and Sturdy; 4e Hardy only) for talents, traits and mutations; Luck/Fear not modelled. |
| 2026-10-01 | C2 qualities and flaws: no model change; Inflict values as separate entries; 5e trappings offer only 5e qualities/flaws in the editor (no API check). |
| 2026-10-01 | C2 armour: 5e shields are armour (new Shield group); armour groups per edition (5e adds Leather); 5e melee groups drop Parry and Engineering. Quick Armour not supported; penalties in descriptions. |
| 2026-10-01 | C2 done (5e content model changes; details in design §4.1). |
| 2026-10-01 | C3 done: 5e core rulebook added as source 44 ("WFRP 5e"); source picker is edition-dependent. |
| 2026-10-01 | Plan P3 (C4/C5) agreed: global edition switch (default 4e), one-edition lists, editor 4e/5e toggle saving all variants, "Add version" pre-filled from the other variant, delete removes the selected variant, copy copies all variants; characters stay 4e. |
| 2026-10-01 | C4/C5 done: browser walkthrough on a local test API passed (lists per edition, create, add pre-filled 5e version, save both in one PUT, copy all variants, delete whole document, 5e talent rules/validation, 5e item groups, characters stay 4e). |
| 2026-10-02 | 5e trait import (C6a/C6b) paused after the first staging import. Decided to merge traits and qualities/flaws whose parameter does not change their rules (ratings like Ward 8, targets like Hatred - Elves) into one entity each, with the value on the reference: plan P4 (C1c). |
| 2026-10-06 | 5e core rulebook update (2026-10-01, `books/WFRP5_Core_Rulebook_06_10_26.pdf`) compared with the imported data; page numbers unchanged up to p. 365. Q-SIZE revised to five 5e steps. Changes applied via the data files and `db/scripts/update_5e_book_0610.py` (remove 5e Size - Tiny, Size - Little, Melee - Parry; rename Remedy - Wounded → Remedy - Infection). Run on staging and production 2026-10-06 (10 talents, 3 prayers, 13 spells, 5 qualities/flaws, 5 traits, 6 trappings re-imported with `--update`), production backup `db/hammergen_06_10_2026_before_5e_book_update`. Careers will be taken from the new PDF. |
| 2026-10-07 | Character decisions: Q-ADV points (as today), Q-TRACKER one running tick count for the current career (skulls at 10/22/36), Q-AMBITION not now (description/notes), Q-RULES sheet values only with XP typed in as in 4e. |
| 2026-10-07 | Plan P5 implemented (H1–H6): separate 4e/5e character pages (`?edition=` in URLs), rules modules `rules4e.ts`/`rules5e.ts`, `careerTicks`, 5e species check, 5e editor and sheet (tracker, Known Languages, Shield row, 5e CSV). Walkthrough passed locally; not deployed. |
| 2026-10-08 | P5 (5e characters) merged (PR #97, incl. `CharacterAttributes` merged back into one component) and deployed. |
| 2026-10-08 | Plan P6 (allow 4e content, O1–O4) implemented: `allow4e` on characters (one-way, 5e only), 4e fallback for full characters, 4e badges and 5e/4e filter in all pickers, 4e trappings counted, 4e talent/trait/mutation modifiers ignored with a warning in editor/sheet/CSV. Walkthrough passed locally; not deployed. |
| 2026-10-09 | P6 (allow 4e content) deployed, incl. the 4e badge wrapping fix. |
| 2026-10-09 | Usage metrics (A1–A6) removed from the 5e scope and moved to `docs/todo.md`. Next: the 5e character generator (G1–G4), then site texts (X2). |
| 2026-10-09 | Plan P7 (5e character generator, G1–G4) implemented: `generationProps5e` data and import script, `?edition=5e` on the generation endpoint, `generateCharacter5e` (level 1 creation, tracker-driven levels 2–4 with 5e XP costs), generate section and buttons in the 5e editor. Walkthrough passed locally; `generationProps5e` not yet imported to staging/production; not deployed. |
| 2026-10-09 | X2 site texts updated for 5th Edition (meta description, home page with announcement banner, How To, About source books, Updates entry). Not deployed. |
| 2026-10-09 | `generationProps5e` imported to staging (`test-go`) and production (`hammergen-go`, backup `db/hammergen_09_10_2026_before_generation_props_5e`). |
