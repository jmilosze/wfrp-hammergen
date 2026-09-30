# WFRP 5e — Design

Status: **requirements agreed (2026-09-30), design not started.** This file records requirements and decisions and will hold the feature design.

Inputs: [01-discovery.md](01-discovery.md) and its appendices.

---

## 1. Requirements (agreed 2026-09-30)

### Editions
- **R1** — 4e and 5e exist side by side, permanently. 4e behaviour stays as it is today.
- **R2** — All content (skills, talents, careers, items, qualities/flaws, spells, prayers, traits, mutations, runes) can be **browsed and searched for both editions**. Every content entity belongs to one edition.

### Characters
- **R3** — The user picks the edition when **creating** a character. It **cannot be changed** afterwards.
- **R4** — A **4e character** works exactly as today and **cannot use or attach any 5e content**.
- **R5** — A **5e character** gets the updated 5e character editor and sheet and can use all 5e content.
- **R6** — A 5e character can have **"allow 4e content"** switched on, either at creation or later in the editor. Once it is on, it **cannot be switched off**.
- **R7** — With "allow 4e content" on, a 5e character can also use 4e content **where no 5e version of that item exists**.
- **R8** — 4e content on a 5e character appears on the sheet, but **no 4e content affects the character's calculated numbers** (talents, traits, items, mutations, skills, careers — none of them), at least initially.

### Generator
- **R9** — The generator for 5e characters uses **5e content only**.
### Rules for 5e characters
- **R11** — 5e characters use **5e rules only**, including where 5e changed the model (e.g. shields are armour, Resilience/Resolve don't exist). 4e rules apply only to 4e characters.
- **R12** — 5e characters can only be of the **five 5e species**: Human (Reiklander), Dwarf, Halfling, High Elf, Wood Elf. No Gnome, Ogre or regional variants.

### Custom content
- **R13** — Users can create custom content in either edition; the edition is chosen when the entity is created. No "copy a 4e entity as a 5e one" helper for now.

### Generator (cont.)
- **R10 (future, not now)** — Using supplement careers etc. with 5e rules. The expected route is converting that content to 5e one item at a time, not mixing editions in the generator.

### Carried over from the draft goals (still to confirm)
- 5e derived values (characteristics, skills, wounds, movement, encumbrance, fate/fortune) use 5e rules.
- 5e core content is available as public content.
- Users can create custom 5e content the same way they do for 4e.

## 2. Non-goals

- Changing a character's edition, or converting 4e characters to 5e (follows from R3).
- Automating table-top rules that Hammergen doesn't model today (combat, conditions, criticals, endeavours).
- 5e supplements (none exist yet).
- Mixed-edition content in the generator (R9).

## 2a. Delivery phases (agreed 2026-09-30)

Each phase ships on its own and is designed in detail before it starts.

1. **5e content** — every content type gets an edition; 5e variants of all core content are added to the DB (how is still open: Q-DATA); all content can be browsed and searched per edition (R2); users can create custom 5e content (R13).
2. **5e characters** — create/edit/view/print 5e characters (edition fixed at creation, R3) with 5e rules (R11, R12). Only 5e content can be used.
3. **Opt-in 4e content** — the one-way "allow 4e content" switch on 5e characters (R6–R8).
4. **5e generator** — automatic generation of 5e characters from 5e content only (R9).

---

## 3. Decisions

Each decision gets an entry here once made (date, choice, reasoning). IDs match the open questions in discovery §16.

| ID | Decision | Status | Options considered |
|---|---|---|---|
| Q-SCOPE | Keep 4e alongside 5e? | **decided 2026-09-30: both, permanently (R1)** | (a) both editions permanently; (b) 5e only for new characters, 4e read-only later |
| Q-EDITION | Where edition lives | **decided: every content entity and every character has an edition; a character's edition is immutable (R2, R3)** — how it's stored is still to design | (a) field on character only, content edition-agnostic; (b) field on every entity; (c) derived from source (each source belongs to an edition) |
| Q-COMPAT | 4e supplement content in 5e characters | **decided: opt-in per character, one-way; only where no 5e version exists; 4e talents/traits don't affect stats; not in generator (R6–R9)** | (a) allowed as-is; (b) allowed, with per-entity "usable in 5e" flag; (c) not allowed until converted |
| Q-OVERLAP | Same-named content in both editions | **decided: separate entities per edition (implied by R2/R7)** — how "has a 5e version" is determined is still open (see Q-VERSION) | (a) separate entities per edition; (b) one entity with per-edition fields/overrides |
| Q-SPECIES | 5e species list | **decided 2026-09-30: 5 core species only (R12)** | (a) 5 core species only; (b) + Gnome/Ogre from Bestiary; (c) + 4e regional variants |
| Q-ADV | 5e advance storage | open (leaning b) | (a) count of +5 advances (needs ×5 everywhere, can't represent +1); (b) points, as today — no model change, only XP lookup/editor step/validation differ |
| Q-TRACKER | Career Advancement Tracker | open | (a) store ticks; (b) compute from purchases; (c) ignore |
| Q-AMBITION | Ambitions / Appearance fields | open | (a) add fields; (b) keep in description/notes |
| Q-CONVERT | 4e → 5e conversion | **decided: no conversion; edition is fixed (R3)** | (a) none; (b) one-off "copy as 5e" helper; (c) full conversion |
| Q-SIZE | 5e size scale | open | (a) reuse 7-step scale; (b) 5e scale (Tiny/Small/Average/Large/Enormous/Monstrous) |
| Q-PROPS | Parameterised qualities (Inflict X, Blast N…) | open | (a) one entity per value (today); (b) rating/parameter field |
| Q-SHIELD | Shields | **decided 2026-09-30: armour for 5e, 4e unchanged (R11)** | (a) armour type for 5e only; (b) new model for both |
| Q-PRAYER | Prayer classification | open | (a) add deity + blessing/miracle type; (b) keep as is |
| Q-RULES | Level of rules automation | open | (a) sheet values only; (b) + XP accounting; (c) + validation (career access, spell XP, exclusive talents) |
| Q-DATA | 5e content entry | open | (a) manual via UI; (b) import script seeded from `data/careers-5e.json` etc. |
| Q-VERSION | How do we know a 4e item "has a 5e version" (R7)? | open | (a) explicit link from 5e entity to the 4e entity it replaces; (b) name match; (c) don't check — with the flag on, any 4e item is allowed |
| Q-4E-EFFECT | Which 4e content affects a 5e character's numbers (R8)? | **decided 2026-09-30: none initially (R8)** | Talents/traits: no. Still open: 4e items (Enc, weapon damage, armour AP), mutations (modifiers), skills (values), careers (career path/status), spells/prayers (no calculations) |
| Q-CUSTOM | Can users create custom content in either edition, and copy a 4e entity as the start of a 5e one? | **decided 2026-09-30: users create custom content in either edition (edition chosen on create); no "copy from 4e" helper for now (R13)** | (a) edition picked on create; (b) + "copy to 5e" |

---

## 4. Design areas (to fill in after decisions)

### 4.1 Data model (Go domain + MongoDB)
_To do._ Edition marker(s); character fields (Resilience/Resolve, Ambitions, Appearance, tracker); talent max-rank semantics and new modifier types (Fortune, Encumbrance, Sturdy, Fear); property model; shields/armour groups/penalties; species enum; sources; career income skill; generation props per edition.

### 4.2 API
_To do._ Validation aliases per edition; filtering by edition; generation props endpoint.

### 4.3 Frontend rules
_To do._ Edition-specific calculators for characteristics, skills, wounds, movement, size, encumbrance (incl. maximum), fate/fortune; XP cost tables.

### 4.4 Character editor and sheet
_To do._ 5e sheet layout (see discovery §12), print, CSV.

### 4.5 Character generator
_To do._ 5e creation steps (discovery §3), higher-level generation with tracker/100 XP rules, 5e generation props (species skills/talents, random talents, class trappings, careers table).

### 4.6 Content
_To do._ Source entry for 5e core; data entry/import plan; verification against the book.

### 4.7 Migration and rollout
_To do._ DB migrations, feature flag, release notes.

---

## 5. Risks

- Content volume: 64 careers × 4 levels, ~170 talents, ~150 spells, ~80 prayers, ~200 trappings, traits and mutations all need 5e data.
- Ambiguities/errata in the 5e PDF (discovery §15).
- Coupling: many frontend functions assume 4e (advance = +1, size scale, species lists); touching them risks 4e regressions — needs tests on both editions.
