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
- **R8** — 4e content on a 5e character appears on the sheet, but **4e talents, traits and mutations do not affect the character's calculated numbers** (their modifiers are not applied). **Exception (2026-10-08): 4e trappings count fully** (encumbrance, damage, AP). 4e skills show their value as usual; 4e careers can be current or past careers. See [plans/p6-allow-4e.md](plans/p6-allow-4e.md).

### Generator
- **R9** — The generator for 5e characters uses **5e content only**.
### Rules for 5e characters
- **R11** — 5e characters use **5e rules only**, including where 5e changed the model (e.g. shields are armour, Resilience/Resolve don't exist). 4e rules apply only to 4e characters.
- **R12** — 5e characters can only be of the **five 5e species**: Human (Reiklander), Dwarf, Halfling, High Elf, Wood Elf. No Gnome, Ogre or regional variants.

### Custom content
- **R13** — Users can create custom content in either edition; the edition is chosen when the entity is created. No "copy a 4e entity as a 5e one" helper for now.

### Analytics
- **R14** — Hammergen measures how often people use 5e vs 4e (characters, content browsing/search, custom content, generator), so adoption of each edition can be compared over time.

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
| Q-OVERLAP | Same-named content in both editions | **decided 2026-09-30: option B — one document per item with per-edition variants under the same id (§4.1a)** | (a) separate entities per edition; (b) one entity with per-edition fields/overrides |
| Q-SPECIES | 5e species list | **decided 2026-09-30: 5 core species only (R12)** | (a) 5 core species only; (b) + Gnome/Ogre from Bestiary; (c) + 4e regional variants |
| Q-ADV | 5e advance storage | **decided 2026-10-07: (b) points, as today** | (a) count of +5 advances (needs ×5 everywhere, can't represent +1); (b) points, as today — no model change, only XP lookup/editor step/validation differ |
| Q-TRACKER | Career Advancement Tracker | **decided 2026-10-07: (a) store ticks** — one running count for the current career, editable; the generator fills it (see 5e character details below) | (a) store ticks; (b) compute from purchases; (c) ignore |
| Q-AMBITION | Ambitions / Appearance fields | **decided 2026-10-07: (b) for now** — use the existing description and notes | (a) add fields; (b) keep in description/notes |
| Q-CONVERT | 4e → 5e conversion | **decided: no conversion; edition is fixed (R3)** | (a) none; (b) one-off "copy as 5e" helper; (c) full conversion |
| Q-SIZE | 5e size scale | **revised 2026-10-06: (b) the 5e scale.** The 2026-10-01 book update states five steps: Small, Average, Large, Enormous, Monstrous (halflings are Average). 5e has no Tiny or Little: their 5e Size traits were removed; 5e Size - Small keeps size −1. Wounds by size (p. 361): Small 2 × TB, Average SB + 2 × TB + WPB, larger sizes a multiple of that (as 4e for these steps). The 5e Small talent is gone from the book (it was never imported). Earlier decision (2026-09-30, superseded): same 7 steps as 4e, reading the book's "Small" as "Tiny" | (a) reuse 7-step scale; (b) 5e scale (Tiny/Small/Average/Large/Enormous/Monstrous) |
| Q-PROPS | Parameterised qualities (Inflict X, Blast N…) | **decided 2026-09-30: one entity per value, as today (e.g. Inflict (Entangled 50))** | (a) one entity per value (today); (b) rating/parameter field |
| Q-SHIELD | Shields | **decided 2026-09-30: armour for 5e, 4e unchanged (R11)** | (a) armour type for 5e only; (b) new model for both |
| Q-PRAYER | Prayer classification | **decided 2026-09-30: keep as is (b) in both editions** — no deity or blessing/miracle field; no current benefit. Revisit if Bless/Invoke rules are automated (Q-RULES) or for the 5e generator (phase 4) | (a) add deity + blessing/miracle type; (b) keep as is |
| Q-RULES | Level of rules automation | **decided 2026-10-07: (a) sheet values only, for now** — derived values are calculated; current/spent XP stay typed-in numbers as in 4e (the 4e editor does no XP accounting; XP costs are used only by the generator); no validation of career access, spell XP or exclusive talents | (a) sheet values only; (b) + XP accounting; (c) + validation (career access, spell XP, exclusive talents) |
| Q-DATA | 5e content entry | **decided 2026-09-30: initial one-off import script adds 5e variants to existing public documents and creates 5e-only public documents; afterwards all content (public by admins, custom by users) is created/edited in the editor with the 4e/5e toggle** | (a) manual via UI; (b) import script seeded from `data/careers-5e.json` etc. |
| Q-VERSION | How do we know a 4e item "has a 5e version" (R7)? | **decided 2026-09-30: an item "has a 5e version" when its 5e variant exists (follows from option B)** | (a) explicit link from 5e entity to the 4e entity it replaces; (b) name match; (c) don't check — with the flag on, any 4e item is allowed |
| Q-4E-EFFECT | Which 4e content affects a 5e character's numbers (R8)? | **decided 2026-10-08: trappings count fully (Enc, damage, AP); talents, traits and mutations are shown without their modifiers; skills show their value; careers allowed; spells/prayers have no calculations** (earlier: none) | |
| Q-CUSTOM | Can users create custom content in either edition, and copy a 4e entity as the start of a 5e one? | **decided 2026-09-30: users create custom content in either edition (edition chosen on create); no "copy from 4e" helper for now (R13)** | (a) edition picked on create; (b) + "copy to 5e" |
| Q-ANALYTICS | How to measure 4e vs 5e usage (R14) | **decided 2026-09-30: API-side (b) — more precise and easier to tailor than GA4 in a single-page app; DB counts (c) can complement it** | (a) GA4 custom events with an `edition` parameter (gtag is already in `index.html`) — measures interactions, undercounted by ad blockers, needs consent consideration; (b) server-side structured events via the existing `slog` → Cloud Logging, turned into log-based metrics/BigQuery — accurate, no client tracking, counts API calls; (c) DB-derived counts (characters/custom content per edition over time; creation time is in the ObjectId, but there is no last-modified time today) — adoption, not interaction. Likely a combination, e.g. (c) + (a) or (b) |
| Q-I18N | Future: translated content (e.g. Polish, Spanish) | not now — keep the content model compatible | Translations as a per-language overlay of text fields, not as extra variants (see §4.1a) |

**5e character details (decided 2026-10-07):**
- **Species:** a 5e Human uses the existing Human (Reiklander) code; the other four species use their base codes (R12).
- **Known Languages:** the view/print sheet shows Language skills in their own block; the editor keeps them with all skills.
- **Maximum Encumbrance:** not shown for now (in either edition).
- **Shields:** the 5e sheet's armour block gets a Shield row (5e shields are armour with no hit location).
- **Order of work:** 5e character editor and sheet first (filled in by hand), the 5e generator after.
- **Separate pages per edition:** 4e and 5e characters get their own editor and sheet pages (4e pages unchanged), shared building blocks where the editions agree, and one rules module per edition; the character model and API format stay one type. URLs carry `?edition=5e` (missing = 4e). Details: [plans/p5-characters.md](plans/p5-characters.md).
- **Career Advancement Tracker storage:** one running tick count (0–36) for the **current career**, a manual field like XP (the generator fills it). The sheet shows it as one row of boxes with the level 2/3/4 skulls after 10/22/36 ticks (pp. 23, 196, 376). It starts at 0 on a career change; past careers keep no count.

---

## 4. Design areas (to fill in after decisions)

### 4.1 Data model (Go domain + MongoDB)

**Edition-specific fields (decided 2026-09-30).** Both variants of a content type share one Go/TS type. Fields that exist in only one edition are added to that shared type as optional fields (`omitempty`, so the other edition's documents and responses are unchanged), and per-edition rules live in `ValidateEdition(e)` (the `EditionValidator` interface), which the service applies to every variant after tag validation. Where a type's structure really diverges between editions (likely talents, possibly items), separate per-edition types are decided when that type is modelled.

Done so far:
- **Career income skill:** `incomeSkill` (skill id) in both editions (4e has it too; it was missing from Hammergen). Optional in both for now — existing and user careers have none and must keep working; when set, it must be one of the career's level 1 skills. No UI yet: it will be added after the 5e work, when making it required for 5e can be reconsidered.
- **Career species (5e):** a 5e career may only list Human, Halfling, Dwarf, High Elf and Wood Elf (R12); 4e keeps all seven. Enforced in `Career.ValidateEdition`. The editor's species options for 5e come with C5.
- **Talent max rank:** 999 means unlimited in both editions (as already used by 4e Magnum Opus and Wealthy); the API and editor limit is raised from 99 to 999. A 5e talent uses only `maxRank`: no characteristic bonuses (`attribute`/`attribute2` none), and at least 1 unless it is a group. Enforced in `Talent.ValidateEdition`.
- **Talent tests:** a 5e talent has no `tests` (5e has no Tests line; such bonuses are in the description as Advantage).
- **Modifier effects by edition:** new effects Strong Back (Enc limit +1, +3 when taken twice) and Sturdy (SB counted twice for the Enc limit), 5e only; 4e keeps Hardy only. Checked by `Modifiers.ValidateEdition` for talents, traits and mutations; the editors offer the effects of the edition (`modifierEffectsByEdition`). Their calculation comes with the 5e Enc limit (H3). Luck is not modelled: Fortune stays a number the player enters, as in 4e; Fear (Frightening) is not modelled either.
- **Qualities and flaws:** no model change. Parameterised qualities get one entry per value, as in 4e (e.g. each *Inflict (…)*). When building a 5e trapping, the editor offers only 5e qualities and flaws (it lists them with `edition=5e`, C5); the API does not check the edition of referenced ids.
- **Shields and armour groups:** a 5e shield is an item of type Armour in the new **Shield** armour group (AP, no locations, the 5e *Shield* quality); 4e shields stay melee weapons. Armour groups per edition: 4e Soft Leather, Boiled Leather, Mail, Plate, Soft Kit, Brigandine, Other; 5e **Leather** (new), Mail, Plate, Shield, Other. Melee groups: 5e has no Parry or Engineering. Checked by `Item.ValidateEdition` for the item's own type; editors and list filters offer the edition's groups. Not supported: Quick Armour. Armour penalties go in the description, as in 4e.
- **Sources (C3):** the 5e core rulebook is source `44` ("WFRP 5e"). The editor offers Custom and WFRP 5e for 5e content and the 43 4e books (plus Custom) for 4e (`sourcesByEdition`); the API only checks that the id exists.

_To do._ Edition marker(s); character fields (Resilience/Resolve, Ambitions, Appearance, tracker); talent max-rank semantics and new modifier types (Fortune, Encumbrance, Sturdy, Fear); property model; shields/armour groups/penalties; species enum; sources; career income skill; generation props per edition.

### 4.1a Content model for two editions — brainstorm (2026-09-30)

Preference: the content editor has a **4e/5e toggle**, and both edition variants of an item live under **the same id**.

**Option A — separate documents per edition, linked.** Each document has an `edition`; a 5e document can point to the 4e one it replaces (`counterpartId`). The toggle loads the linked document.
- ✔ Smallest change: existing documents just get `edition: 4`; code paths and API stay as they are.
- ✔ Each document has its own owner/visibility.
- ✘ The link has to be maintained, and "has a 5e version" (R7) depends on it being set.
- ✘ Careers must reference edition-specific skill/talent ids, so every 5e career needs its own id lists.
- ✘ The toggle is really navigation between two records.

**Option B — one document, per-edition variants. Chosen 2026-09-30.** Sketch:

```
{ _id, ownerid, visibility,
  editions: {
    "4e": { name, description, source, ...all rule fields as today... },
    "5e": { name, description, source, ...5e rule fields... }
  } }
```
- ✔ The toggle maps directly onto the document.
- ✔ R7/Q-VERSION is free: 4e content is offered to an opt-in 5e character only when `editions.5e` is missing.
- ✔ Characters and careers keep referencing one id; the character's edition picks the variant. A 5e career variant can list the same skill/talent ids as the 4e one.
- ✔ Browse/search per edition = "variant exists" query.
- ✘ Every content type changes shape (Go domain, Mongo mapping, API validation, TS types) and all existing content needs a one-off migration `object` → `editions.4e`.
- ✘ Owner and visibility are shared by both variants: only the owner (admin for public content) can add the 5e variant of an item. Users cannot attach their own 5e variant to a public 4e item — they create a separate 5e-only item instead.
- ✘ Everything that differs must live inside the variant, including the item **type** (4e Shield is a melee weapon, 5e Shield is armour), `source` (page numbers differ) and group membership.
- ✘ Adding a 5e variant later silently switches opt-in 5e characters that used the 4e variant to the 5e one (probably desirable — R7 — but their numbers change).
- Characters are **not** variant documents: a character has one fixed edition (R3), so it gets an `edition` field instead.

**Decisions on option B (2026-09-30)**
- Public items stay admin-only, both variants included. A user who wants a 5e variant of a public item **copies** it to their own item and adds the variant there. The copy has a new id, so characters that reference the public item are not affected.
- List endpoints return **only the requested edition's variant**; the full document (both variants) is only needed by the editor.

**Reconsidered and confirmed (2026-09-30)**
Because Cubicle 7 releases are often inconsistent (bugs, re-releases with different rules — the 4e "v2" items — and possible splits/merges that don't map 1-to-1), option A with a many-to-many `replaces: [4e ids]` list on 5e documents was reconsidered. It would make links editable data and support splits/merges. **Option B was kept** because it is simpler. Rule for anything that doesn't map cleanly 1-to-1 (splits, merges, re-releases, doubtful matches): **create a new 5e-only item without linking**. Accepted consequence: an opt-in 5e character may then see the old 4e item alongside the new 5e item(s). Linking is permanent in practice, because undoing it means splitting a document and changing one variant's id, so only link when the match is clearly 1-to-1.

**Edge cases (resolved 2026-09-30)**
- One-to-many: the 4e *Sail* group document gets a 5e variant that is a plain (non-group) skill; its 18 ship specialisations keep only a 4e variant. `isGroup`/group membership live inside the variant like every other field.
- Items in one edition only (4e *Leather Breastplate*, 5e *Sword*) are documents with a single variant.
- Renames (Diceman/Dicer, Strider/Striding Gait…) are simply different names in the two variants.
- Parameterised qualities stay one entity per value, as today (Q-PROPS): *Blast 3*, *Reload 2*, and for 5e *Inflict (Entangled 50)*, *Inflict (Entangled 45)*, *Inflict (Entangled 35)*, *Inflict (Entangled your Strength)*, *Inflict (Prone)*, *Inflict (Deafened)*, *Inflict (Ablaze)*.
- List endpoints return only the requested edition's variant; a Mongo aggregation `$project: { object: "$editions.5e" }` keeps today's `{id, ownerId, visibility, object}` response shape.

**Compatibility with future translations (Q-I18N)**
Language should **not** be another variant axis next to edition: most fields are rules data (numbers, enums, ids) that must stay identical across languages, and duplicating them per language would let them drift. Instead, translations overlay only the **text** fields of a variant:

```
editions: {
  "5e": { name, description, ...rules...,
         i18n: { "pl": { name, description }, "es": { name, description } } } }
```
Missing translation → fall back to the default language. Text fields besides name/description need listing per type (spell/prayer range/target/duration, career level names and trappings, item descriptions, talent specialisation text). This works with both A and B; B keeps each item's editions and languages in one place.

### 4.2 API
_To do._ Validation aliases per edition; filtering by edition; generation props endpoint.

### 4.3 Frontend rules
_To do._ Edition-specific calculators for characteristics, skills, wounds, movement, size, encumbrance (incl. maximum), fate/fortune; XP cost tables.

### 4.4 Character editor and sheet
_To do._ 5e sheet layout (see discovery §12), print, CSV.

### 4.5 Character generator
_To do._ 5e creation steps (discovery §3), higher-level generation with tracker/100 XP rules, 5e generation props (species skills/talents, random talents, class trappings, careers table).

### 4.6 Content
Initial 5e public content comes from a **one-off import script** (Q-DATA): it matches 5e entries to existing public 4e documents (by name plus a rename table, e.g. Diceman → Dicer, Advisor → Adviser) and adds `editions.5e` to them, and creates new documents for 5e-only entries. Input data is extracted from the 5e PDF (e.g. `data/careers-5e.json`) and must be verified against the book first. After the import, all content is maintained through the editor's 4e/5e toggle.

_To do:_ Source entry for 5e core; data entry/import plan; verification against the book.

### 4.6a Analytics
Approach: API-side structured events (Q-ANALYTICS). Points to cover in the design:
- Actions that never reach the API are invisible (print, CSV export and other purely client-side steps). Either accept that or add a small event endpoint for them.
- Some requests don't carry the edition (e.g. get by id); the event needs the edition resolved from the entity.
- Privacy: log counts/edition/action, not personal data; decide whether to keep a pseudonymous user id for "unique users" metrics.
- Storage and reporting: Cloud Logging log-based metrics vs a BigQuery sink vs a Mongo collection.

_To do:_ Events and metrics to capture (e.g. character created/viewed/edited/printed per edition, content lists browsed/searched per edition and type, custom content created per edition, generator runs, "allow 4e content" switched on), where they are stored, and how they are reported.

### 4.7 Migration and rollout
_To do._ DB migrations, feature flag, release notes.

---

## 5. Risks

- Content volume: 64 careers × 4 levels, ~170 talents, ~150 spells, ~80 prayers, ~200 trappings, traits and mutations all need 5e data.
- Ambiguities/errata in the 5e PDF (discovery §15).
- Coupling: many frontend functions assume 4e (advance = +1, size scale, species lists); touching them risks 4e regressions — needs tests on both editions.
