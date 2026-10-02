# Plan P4 — Values on references

Status: **implemented, not deployed** (2026-10-02). Tracker item: C1c. Blocks C6a/C6b (5e content import), which is paused until P4 ships.

## Goal

Stop storing a creature trait or quality/flaw once per value, for example:
- once per rating: Ward 8, Ward 9, Ward 10; Blast 1–5;
- once per target: Hatred - Elves, Hatred - Dwarfs.

Each becomes one entity. The value is entered where it is used: on the character for traits and on the item for qualities/flaws.

Why:
- The duplicates make the lists long and messy.
- They block the 4e ↔ 5e mapping. 5e changed or dropped many ratings (Tail, Horns, Tongue, Breath, Magic Resistance, Daemonic), so a 1-to-1 match between "Tail Attack 1" and "Tail" was not possible.

## Decisions (2026-10-02)

- **Merged:** families whose value does not change the meaning or effect of the rule. The value is only substituted into it: a rating (Ward 8, Bite 1) or a target (Hatred - Elves, Disease - Black Plague).
- **Kept as separate entities:** families where each value has its own rules or modifiers:
  - Size (size modifier);
  - Trained (a different rule per training; War gives +10 WS);
  - Mark of Chaos and the Lizardmen Marks (different rules and modifiers per god);
  - Breath (different damage and effect per type; the rating is still merged, so "Breath Fire" has a value);
  - the familiar traits (Deception - Fox etc.: the name is an ability);
  - one-offs with their own rules (Shapeshifter - Great Cat, Blighted - The Black Plague).
- **Groups of skills and talents are not affected.**
- Supersedes Q-PROPS ("one entity per value").

## Proposal

### Model

- A new reference type `IdValue {id, value}`, where `value` is short free text (max ~30 chars, may be empty).
  - It is free text because values include numbers (`8`), dice (`1d10`), compound values (`2 (1)`, `1 (5)`) and targets (`Elves`, `Orcs and Goblins`).
- `Character.traits`: `[]string` → `[]IdValue`.
  - The same trait may appear more than once with different values, e.g. Hatred (Elves) and Hatred (Dwarfs). The list has no uniqueness check today.
- `Item.properties` (per variant): `[]string` → `[]IdValue`.
  - The `unique` check stays on the id: an item cannot have Blast twice. No quality/flaw takes a target.
- `Trait` and `Property` get `hasValue: bool`.
  - The UI shows the value input only for these entities and prints `Name (value)`, e.g. "Ward (8)" or "Hatred (Elves)".
  - It is not validated against the reference (light validation): a value on an entity without `hasValue` is simply not shown.
- `full=true` responses carry the value next to each resolved trait or property.

### UI

- **Character editor, traits:**
  - a value input on each selected trait that has a value;
  - a way to add the same trait again with another value.
  - `SelectIdNumberTable`, which already does id + number for skills and talents, is the starting point.
- **Item editor, qualities/flaws:** a value input on each selected property that has a value.
- **Display:**
  - character view, print and CSV (traits, and the qualities on weapon and armour tables);
  - item view and the item list's qualities column.
- **Content editor:** a "Has value" checkbox on traits and qualities/flaws.
  - Descriptions refer to "Rating" or "the target" instead of a fixed value, e.g. "Roll 1d10 after any blow; on Rating or higher the blow is ignored".

### Migration (`db/scripts/migrate_values.py`)

For each family of public documents:
1. Keep one document as the base.
   - Rename it to the family name, e.g. "Ward" or "Hatred".
   - Set `hasValue: true`.
   - Rewrite its description generically, for each edition variant it has.
2. Rewrite every reference to the family's documents into `{id: base, value: V}`, with the value taken from the old name. This covers characters (traits) and items of all owners (properties).
3. Delete the other documents of the family.
4. Convert all other references to `{id, value: ""}`.

- **Custom (non-public) documents are not touched**, e.g. a user's "Fear 2" or "Prejudice - Humans". There are 39 custom traits and 10 custom qualities/flaws with a number in the name. They keep working with an empty value, and users can switch to the public entity themselves.
- The script works like the earlier migrations: `--dry-run`, typed confirmation, a check afterwards, and a backup before production.
- It aborts if any merged family's documents carry modifiers. None do today.

Scale (production dump 2026-10-01):
- 94 characters reference public rated traits, and 27 reference public targeted traits.
- 367 item variants reference public rated qualities, 260 of them on users' items.

### Families

**Traits, by rating:**

| Family | Documents (production) | Value |
|---|---|---|
| Armour | Armour 1 | 1 |
| Bite | Bite 1 | 1 |
| Breath Cold / Corrosion / Electricity / Fire / Poison / Smoke / Warpfire | Breath X 1 | 1 (the type stays in the name) |
| Burrow | Burrow 30 | 30 |
| Fear | Fear 1 | 1 |
| Flight | Flight 10 | 10 |
| Grim | Grim 1 | 1 |
| Horns | Horns 1 | 1 |
| Magic Resistance | Magic Resistance 1 | 1 |
| Many Heads | Many Heads 5 | 5 |
| Ranged | Ranged 1 | 1 |
| Tail Attack | Tail Attack 1 | 1 |
| Tentacles | 2 Tentacle 1 | `2 (1)` (count, then damage; 5e uses the count only) |
| Terror | Terror 1 | 1 |
| Tongue Attack | Tongue Attack 1 (5) | `1 (5)` |
| Ward | Ward 8, 9, 10 | 8 / 9 / 10 |
| Weapon | Weapon 5 | 5 |
| Web | Web 1 | 1 |

**Traits, by target:**

| Family | Documents (production) | Value | 5e values (import data) |
|---|---|---|---|
| Afraid | Afraid - Elves | Elves | |
| Animosity | Animosity - Elves | Elves | Orcs and Goblins |
| Blessed | Blessed - Rhya | Rhya | |
| Corruption | Corruption 1 | 1 | Minor, Moderate |
| Disease | Disease - The Black Plague | The Black Plague | Ratte Fever, Packer's Pox |
| Hatred | Hatred - Elves | Elves | Daemons of Khorne, Daemons of Slaanesh, Dwarfs, Living, Orcs and Goblins, Predators |
| Immunity | Immunity Fire, Immunity Poision | Fire, Poison | |
| Miracles | Miracles - Rhya | Rhya | |
| Prejudice | Prejudice - Elves | Elves | |
| Spellcaster | Spellcaster - Lore of Fire | Lore of Fire | Lore of Death, Necromancy |
| Venom | Venom Challenging | Challenging | Average, Difficult |
| Striding Gait (5e only) | — | | Mountains, Underground, Wetlands, Woodland |

Immunity to Psychology is a separate trait and is not part of Immunity.

**Qualities and flaws:**

| Family | Documents (production) | Value |
|---|---|---|
| Blast | Blast 1–5 | 1–5 |
| Crewed | Crewed 2 | 2 |
| Durable | Durable 1–4 | 1–4 |
| Experimental | Experimental 1, 2 | 1, 2 |
| Fine | Fine 1–4 | 1–4 |
| Optional Blast | Optional Blast 1 | 1 (stays separate from Blast: different rule) |
| Reload | Reload 1–6, 9 | 1–6, 9 |
| Reload Increase | Reload +1, +2 | 1, 2 (raises an existing Reload instead of setting it) |
| Repeater | Repeater 2–4, 1d10 | 2–4, `1d10` |
| Salvo | Salvo 2 | 2 |
| Shield | Shield 1–5 | 1–5 |
| Slash | Slash (1A), (2A) | 1, 2 |
| Spiderborn | Spiderborn 40–80 | 40–80 |
| Spread | Spread 1–5 | 1–5 |
| Warded | Warded 7–9 | 7–9 |

**Not merged:** Impale or Slash (2A) (a choice quality), and the conditional "Impale/Precise - when Prone or Surprised".

### Impact on the 5e import (C6)

- `docs/5e/data/traits-5e.json` gets regenerated with merged entries:
  - one Bite, Fly/Flight, Fear, Terror, Ward, Web, Hatred, Animosity, Disease, Spellcaster, Venom, Corruption and Striding Gait, each 4e and/or 5e, instead of one entry per value;
  - Swamp-strider stays joined to Striding Gait (Wetlands) only if Striding Gait is merged with it as the base. To be settled when regenerating.
- Tail, Horns, Tongue, Magic Resistance, Daemonic, Grim and Many Heads become clear 4e ↔ 5e joins. The value no longer differs between them.
- Staging already holds the first trait import (2026-10-02). Restore staging from production before migrating it, then re-import.

## Implementation notes (2026-10-02)

- **Backend:** `IdValue {id, value}` (value: max 20 characters, no `<>`) on `Character.traits` and `Item.properties` (`unique=Id`); `WhValue {wh, value}` in `full=true` responses; `hasValue` on `Trait` and `Property` (stored as `hasvalue`).
- **Frontend:**
  - `SelectIdValueTable` replaces `SelectTable` for traits (character editor) and qualities/flaws (item editor). The modal picks entities: "Add" for traits that take a value, a checkbox otherwise. Values are edited in the table on the page, with a remove button per row.
  - Names display as `Name (value)` through `printWithValue`.
  - A trait added more than once counts its modifiers once.
- **Migration:** `db/scripts/migrate_values.py`, tested on a copy of the production dump of 2026-10-01:
  - It merges 50 families and converts 248 characters and 918 items. A re-run changes nothing.
  - It aborts if a family document has a 5e variant (restore staging first).
  - Three private items listed several values of one family (e.g. "Blast 2, Blast 3, Blast 5"); each keeps its first value.
- **Still to do:**
  - Integration tests (`make test`) and an end-to-end check on migrated data.
  - Regenerate the 5e trait data and import (C6).

## Rollout

The API shape changes, so this ships in maintenance mode as P1/P2 did:
1. Run the migration locally, then on staging, then on production.
2. Deploy the API and frontend together.

Open tabs running the old frontend will break: see `docs/todo.md`.
