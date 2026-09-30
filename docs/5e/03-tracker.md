# WFRP 5e — Tracker

Status legend: ✅ done · 🟡 in progress · ⬜ not started · ⏸ blocked

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
| D16 | Verify `careers-5e.json` against the book (advance schemes, statuses, skills, talents, trappings, income skill) | ⬜ | spot-checked Adviser and Soldier only |
| D17 | Compare non-weapon trappings (containers, clothing, tools, food, animals/vehicles, poisons, herbs, prosthetics, magic items, hirelings) with DB | ⬜ | |
| D18 | Compare spell texts/ranges/durations for same-named spells | ⬜ | only names and CN compared |
| D19 | Compare prayer texts for same-named blessings/miracles | ⬜ | only names compared |
| D20 | Compare skill descriptions | ⬜ | list/characteristics compared only |
| D21 | Compare mutation effects with DB modifiers | ⬜ | |
| D22 | Look for published 5e errata / FAQ; check discovery §15 items | ⬜ | |
| D23 | Check how 4e supplement content maps to 5e (Appendix I compatibility) — e.g. supplement careers, species, qualities | ⬜ | input for Q-COMPAT |
| D24 | Survey user data: how many characters use Gnome/Ogre/regional species, Resilience/Resolve, runes, supplement content | ⬜ | input for migration planning (Q-SCOPE, Q-SPECIES, Q-CONVERT now decided) |

## Phase 1 — Decisions

All open; see [02-design.md §3](02-design.md#3-decisions).

| # | Decision | Status | Date | Outcome |
|---|---|---|---|---|
| Q-SCOPE | Keep 4e alongside 5e | ✅ | 2026-09-30 | Both, permanently |
| Q-EDITION | Where edition lives | ✅ | 2026-09-30 | Every entity and character has an edition; character edition immutable |
| Q-COMPAT | 4e supplement content in 5e | ✅ | 2026-09-30 | Opt-in, one-way per character; only where no 5e version; 4e talents/traits don't affect stats; not in generator |
| Q-OVERLAP | Same-named content across editions | ✅ | 2026-09-30 | Separate entities per edition |
| Q-SPECIES | 5e species list | ✅ | 2026-09-30 | 5 core species only |
| Q-ADV | Advance storage | ⬜ | | |
| Q-TRACKER | Career Advancement Tracker | ⬜ | | |
| Q-AMBITION | Ambitions / Appearance | ⬜ | | |
| Q-CONVERT | 4e → 5e conversion | ✅ | 2026-09-30 | None (edition is fixed) |
| Q-SIZE | Size scale | ⬜ | | |
| Q-PROPS | Parameterised qualities | ⬜ | | |
| Q-SHIELD | Shields | ✅ | 2026-09-30 | Armour in 5e (5e rules only for 5e characters); 4e unchanged |
| Q-PRAYER | Prayer classification | ⬜ | | |
| Q-RULES | Rules automation level | ⬜ | | |
| Q-DATA | Content entry approach | ⬜ | | |
| Q-VERSION | How to know a 4e item has a 5e version | ⬜ | | |
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
| C1 | Edition on every content entity (model, DB, API validation) | ⬜ | Q-EDITION |
| C2 | 5e-specific content model changes (talent max ranks/modifiers, qualities & flaws, shields as armour, armour groups/penalty, species, career income skill, prayer classification) | ⬜ | depends on Q-PROPS, Q-PRAYER, Q-SIZE |
| C3 | 5e core source | ⬜ | |
| C4 | Browse/search/filter content by edition in lists (R2) | ⬜ | |
| C5 | Create/edit custom content with edition chosen on create (R13) | ⬜ | |
| C6 | Enter/import 5e core content (careers, skills, talents, items, qualities/flaws, spells, prayers, traits, mutations) | ⬜ | Q-DATA; seed: `data/careers-5e.json` |
| C7 | Tests | ⬜ | |

### Phase 3.2 — 5e characters (5e content only)

| # | Item | Status | Notes |
|---|---|---|---|
| H1 | Character edition, fixed at creation (R3); 4e characters unchanged (R4) | ⬜ | |
| H2 | 5e character fields (no Resilience/Resolve; Ambitions/Appearance/tracker per decisions) | ⬜ | Q-AMBITION, Q-TRACKER |
| H3 | 5e derived values (characteristics, skills, wounds, movement, size, encumbrance incl. max, fate/fortune) | ⬜ | Q-ADV, Q-SIZE |
| H4 | 5e character editor restricted to 5e content | ⬜ | |
| H5 | 5e sheet, print, CSV | ⬜ | discovery §12 |
| H6 | Tests (both editions) | ⬜ | |

### Phase 3.3 — Opt-in 4e content for 5e characters

| # | Item | Status | Notes |
|---|---|---|---|
| O1 | One-way "allow 4e content" switch (R6) | ⬜ | |
| O2 | Offer 4e content where no 5e version exists (R7) | ⬜ | Q-VERSION |
| O3 | Show 4e content on sheet without affecting numbers (R8) | ⬜ | |
| O4 | Tests | ⬜ | |

### Phase 3.4 — 5e generator

| # | Item | Status | Notes |
|---|---|---|---|
| G1 | 5e generation props (species skills/talents, random talents, class trappings, careers table) | ⬜ | |
| G2 | 5e creation steps (discovery §3) | ⬜ | |
| G3 | Higher-level generation (tracker ticks, 100 XP per level, 5e XP costs) | ⬜ | |
| G4 | Tests | ⬜ | |

### Release

| # | Item | Status | Notes |
|---|---|---|---|
| X1 | Release plan per phase (flag, docs, announcement) | ⬜ | |

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
