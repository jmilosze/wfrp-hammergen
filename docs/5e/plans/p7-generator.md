# Plan P7 — 5e character generator

Status: **implemented** (2026-10-09); browser walkthrough passed on a local API against the 2026-10-07 production snapshot. `generationProps5e` imported locally only; staging and production import pending. Tracker items: G1–G4.

## Goal

The 5e editor gets back a "Generate character" section and Generate buttons that follow the 5e rules (pp. 22–44, 191, 196): a level 1–4 5e character from a chosen species, career and level, using 5e content only (R9). The 4e generator stays as it is.

## Decisions (2026-10-09)

- **Separate 5e generator**, like the editor and sheet: its own entry point and 5e steps; shared helpers (group resolution, dice, name and description generation) are reused.
- **Species and career are chosen**, not rolled, as in 4e. So the species (+1 Fortune) and career (level-2 trappings) bonuses for keeping a random result are not used, nor the +1 Fate for keeping all three.
- **Characteristics are always "kept in order"**: 2d10 + species value, then **+6 points** spread randomly over the three level-1 career characteristics. The points are not Advances (no XP, no tracker ticks): they are added to the rolls.
- **Levels 2–4**: per career level, buy career advances until the tracker reaches that level's ticks (10, 22, 36): 1 career talent, one +5 advance in each characteristic unlocked so far, and the rest as career skill advances. XP is spent with the 5e costs (p. 191) plus 100 XP per career level; the tracker field and spent XP are set.
- **5e generation data** is a separate document, `generationProps5e` (same shape as the 4e `generationProps`), served with `?edition=5e`.

## 5e creation steps (level 1)

| Step | 5e rule | Generator |
|---|---|---|
| Species | chosen | selected in the form (five species, R12) |
| Characteristics | 2d10 + species value; keep in order: +6 points over the 3 level-1 career characteristics | rolls + 6 points randomly (in steps of 1) over those three |
| Fate, Fortune, Movement | fixed per species (Human 4/3, Dwarf 2/2, Halfling 2/3, High Elf 1/2, Wood Elf 1/2) | set from the species |
| Fluent languages | +30 (6 Advances) in one or two Language skills per species | from the generation data |
| Species skills | +5 in any five of the species' list | five picked at random |
| Career skills | 8 Advances over the 10 level-1 career skills, max 3 Advances (+15) per skill at creation (species advances count towards the max) | random allocation within the limit |
| Species talents | fixed, "A or B" choices, Random Talents (d100 table, re-roll duplicates) | picked/rolled |
| Career talent | 1 from career level 1 | picked at random |
| Trappings | Clothing, Dagger, Pouch + class trappings (p. 39) | from the generation data; career trappings are free text and are not added as items (as in 4e) |
| Wealth | Brass: 20 d + 2d10 per Standing; Silver: 10/– + 1d10 per Standing; Gold: 2 GC + 1 per Standing | rolled |
| Status | career level's status | as in 4e |
| Name, description | — | 4e name/description generators for the species (Human uses the Reikland lists) |
| Tracker, XP | level 1: 0 ticks, 0 XP spent | set |

## Stages

### 1. 5e generation data (G1)

Extract from the 2026-10-01 book and verify:
- species skills (pp. 26–35) and fluent languages;
- species talents (fixed, "A or B", number of Random Talents);
- the Random Talents table (p. 23, 40 entries);
- the Beginning Trappings table (p. 39; everyone gets Clothing, Dagger, Pouch).

Map names to 5e skill, talent and item ids (choices like "Coolheaded or Savvy" use the 4e encoding: comma-separated ids; group skills like Stealth (Any) use the group). Data file `docs/5e/data/generation-5e.json`.

### 2. API and import

- `GET api/wh/generation?edition=5e` returns the `generationProps5e` document; without the parameter (or with 4e) the existing document, so the 4e generator is unchanged.
- Import script `db/scripts/import_5e_generation.py` (dry run, confirmation, check afterwards, idempotent), run locally, then on staging and production with a production backup.

### 3. 5e generator (G2, G3)

`services/wh/character/generation/5e/` with `generateCharacter5e(context)` (`generator5e.ts`):
- level 1 steps from the table above;
- levels 2–4: tracker-driven advances, 5e XP costs (characteristics 125/175/250/…, skills 50/75/100/…, talents 100) and 100 XP per level;
- reuses `resolveEntityGroups`, dice helpers, `generateName`, `generateDescription`.

### 4. Editor

The 5e editor gets back:
- the "Generate character" section (species: five 5e species; career list: 5e careers open to the species; level 1–4);
- the Generate buttons for name, description, fate/fortune, status/standing;
- "Add species skills/talents" and "Add class items" with the 5e data.

### 5. Tests (G4)

Vitest with fixed dice/selection functions: characteristics (+6 points on career characteristics only), species/career skill limits (max +15), species and career talents, class trappings, wealth formulas, fate/fortune, and levels 2–4 (tracker ticks 10/22/36, XP spent).

### 6. Browser walkthrough

Generate 5e characters of each species at levels 1 and 4; check the sheet (skills ≤ +15 at level 1, tracker, XP), the "Add species …" buttons and Generate buttons; check the 4e generator is unchanged.

## Implementation notes (2026-10-09)

- Data: `docs/5e/data/generation-5e.json` (5e names) → `db/scripts/import_5e_generation.py` → `generationProps5e` in `other`. Random Talents are stored as half-open ranges `[minroll, maxroll)` ending at 101, as in the 4e document.
- API: `GET api/wh/generation?edition=5e`; the response adds `speciesLanguages`.
- Frontend: `services/wh/character/generation/` has one file per creation topic, in `shared/` (both editions: groups, characteristics, skills, talents incl. Random Talents, trappings, status, name, description, generation data) and `4e/`/`5e/` (generator, characteristics, fate, wealth, skills, talents, experience; 5e also advancement). Each topic file holds its generation step and its editor Generate/Add action (2026-10-09).
- Levels 2–4: if no career talent is below its maximum rank, that tick goes to a skill Advance. Characteristic and skill costs above +75 use the +75 cost.
- Editor: "Generate character" section (species, level, 5e careers open to the species with all four levels), Generate buttons (name, fate/fortune, status/standing, description), "Add species skills/talents", "Add class items". The `hideGenerate` prop of the skills, talents and items pickers was removed (no longer used).
- Tests: `*.spec.ts` next to each module in `services/wh/character/generation/5e/`.

## Out of scope

- Random species or career (and their bonuses).
- Spellcaster/priest recommended minimum (Second Sight, Petty Magic, Bless…): not added automatically.
- Ambitions (Q-AMBITION).

## Open questions

None at the moment.
