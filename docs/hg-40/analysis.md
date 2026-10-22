# HG-40 Career trappings: data analysis

Data analysis for HG-40; scope, decisions and the work plan are in [README.md](README.md).

Source: local `hammergenGo` (production snapshot), 2026-10-16. The per-entry mapping is in `db/data/hg-40/career-trappings-resolved.json` (one row per trapping atom: edition, career, level, original entry, normalised name, quantity, status, target trapping); the alias table used to build it is `db/data/hg-40/alias.py`. Both are gitignored, local only.

## Current scope: 5e careers only

Counts as first analysed, before decisions D2–D7; the current mapping is in [careers-5e.md](careers-5e.md) and [new-trappings.md](new-trappings.md).

The first step converts only the 64 public 5e career variants (256 levels, 667 entries, 765 atoms). All 64 are 5e variants of 4e documents; their 4e variants keep the free text for now.

| Status | Uses | Notes |
|---|---|---|
| Existing trapping (with ammo and the one armour set) | 556 | 170 different trappings |
| New trapping | 47 | 32 new trappings, listed below |
| Exists in 4e only | 1 | Davrich Lamp: add a 5e variant |
| Generic weapon | 10 | Melee Weapon (Any) ×3, Great Weapon ×2, Weapon (Any) ×2, 2 Quality Weapons, Ranged Weapon (Any One), Weapon (Crossbow, Handgun, Halberd, Spear, or Sword) |
| Family choice | 5 | Trade Tools (as Trade) ×2, Instrument ×2, Poison |
| Library, Workshop | 9 | Library (Theology ×2, Art, Law, Engineering); Workshop (as Trade) ×2; Large Workshop (Artist, Engineer) |
| Grimoire | 2 | |
| People | 73 | |
| Property | 29 | |
| Money and "worth" | 16 | 16 different phrasings, 7 of them "goods/jewellery worth" |
| Vehicles with crew, fleets | 7 | |
| Intangible, trophy, vague, magic item | 9 | Orders, Degree, Access to a Library, The Respect of the Village; Animal Skulls; Trained Animal; Magical Item, Rune Axe |
| "None" | 1 | Villager level 1 |

New trappings (5e variant; 28 of them will be needed in 4e later): Symbol of Rank (10 uses: Symbol of Rank, Quality Symbol of Rank, Sash, Rod of Office, Chains of Office, Copper Badge), Religious Relic (4), Handcart (2), Trade Tools - Carpenter (2), Trade Tools - Thief (2), and one use each: Trade Tools - Astrology, Cartographer, Engraver, Farrier, Tinker; Barding, Basket, Book - Herbs, a Book on another subject (Scholar's "Book"), Calling Card, Coach Horn, Coloured Powders, Fishing Rod, Garland, Herbs, Instruments of Torture, Licence (Wizard's Magic Licence), Lock Box, Lucky Charm, Printing Press, Riverboat, Scarf, Sextant, Sturdy Crate, Whistle, Wig, Wooden Training Sword.

Depending on the decisions, up to 7 more: a generic Grimoire, Library - Theology/Art/Law/Engineering, Large Workshop - Artist/Engineer.

Cases in the 5e text: 28 choices in 26 levels (11 between bundles, 1 with a quantity in an option, 3 choices inside parentheses), 25 fixed quantities, 10 dice quantities, 32 bundles, 29 entries with Quality (one Poor Quality), no data glitches. Levels with a non-trapping part: 96; levels with only non-trappings: 20.

## Full scope (both editions)

| | 4e | 5e |
|---|---|---|
| Public career variants (converted) | 177 | 64 |
| Levels | 706 | 256 |
| Comma-separated entries | 2010 | 667 |
| Atoms after splitting bundles ("X with Y", "X and Y") | 2247 | 765 |
| Non-public career variants (keep the free text) | 414 (326 with text) | 1 (no text) |

## Where the atoms go

| Status | 4e | 5e | Notes |
|---|---|---|---|
| Existing trapping | 1337 | 543 | 220 different 4e trappings, 170 different 5e trappings |
| Ammo of the weapon in the same entry ("Pistol with 10 Shots", "and Ammunition") | 25 | 12 | Existing: Bolt, Arrow, Bullet and Powder, Small Shot and Powder |
| Armour set ("Plate Armour", "Gromril Suit") | 19 | 1 | Existing pieces: breastplate, bracers, leggings, helm |
| Existing in the other edition only | 173 | 1 | Add a variant, see below |
| New trapping | 194 | 47 | 63 new documents, see below |
| Grimoire (no spells) | 14 | 2 | New generic grimoire? |
| Choice from a family: "Trade Tools" / "(as Trade)" / "(Any)", "Instrument", "Poison" | 26 | 5 | OR over the existing family members |
| Generic weapon: "Weapon (Any)", "Melee Weapon (Any)", "Great Weapon", "2 Quality Weapons" | 28 | 10 | 19 different phrasings |
| Library, Workshop (not covered by an existing one) | 28 | 9 | `Library - Magic` and `Workshop - <trade>` already are trappings |
| People: apprentices, servants, units, gangs, networks, followers | 185 | 73 | not trappings |
| Property: townhouse, temple, lair, warehouse, estate, office | 71 | 29 | not trappings |
| Vehicle with crew, fleets: "Sailing Ship and Crew", "Fleet of Coaches and Horses" | 21 | 7 | not trappings |
| Money and "worth": "20 GC", "3d10 Shillings", "Jewellery worth 50 GC", "Goods worth 2d10 Pennies" | 26 | 16 | not trappings, maybe coins |
| Magic/runic item: "Magical Item", "Runic Wargear" | 27 | 2 | not pickable |
| Intangible: "Orders", "Shame", "Degree", "Sense of Humour", "Keys of Secrets" | 33 | 4 | not trappings |
| Trophies: "Troll’s Head", "Dragon’s Head", "Animal Skulls" | 17 | 1 | not trappings |
| Vague: "Trained Animal", "Herd of Rhinox", "Ingredients", "Daemonic Familiar" | 13 | 1 | not trappings |
| "None", "The Clothes on your Back" | 5 | 1 | empty list |
| Parse fragments of data glitches | 5 | 1 | fix the text first |

Levels with at least one non-trapping part: 264 of 706 (4e), 96 of 256 (5e). Levels with only non-trappings: 57 (4e), 20 (5e).

## Cases in the text

| Case | 4e | 5e | Examples |
|---|---|---|---|
| Choice "A or B" (top level) | 70 entries in 59 levels | 28 entries in 26 levels | Main Gauche or Sword-breaker; Brush or Chisel or Quill Pen |
| — options with different quantities | 4 | 1 | Riverboat or 2 Wagons |
| — options that are bundles | 3 | 11 | Bow with 10 Arrows or Pistol with 10 Shots; 2 Bolas or Crossbow with 10 Bolts or Lasso |
| Choice inside parentheses | 11 | 3 | Weapon (Crossbow, Handgun, Halberd, Spear, or Sword); Gromril Helm (Open or Closed); Hand Weapon (Cleaver or Mallet) |
| Fixed quantity | 35 | 25 | 3 Healing Poultices; 2 Sets of Clothing; 5 Throwing Knives |
| Dice quantity | 16 | 10 | 1d10 Rags; 1d10 Lucky Charms; Clothing and 1d10 Bandages |
| Bundle "X with Y", "X containing Y", "X and Y" | 99 | 32 | Riding Horse with Saddle and Tack; Sling Bag containing Trade Tools (Artist); Storm Lantern and Oil |
| Quality | 92 | 30 | Quality Clothing; Best Quality Courtly Garb; Poor Quality Blanket; Quality Trade Tools (Engineer) |
| Parameter in parentheses | 133 | 66 | Book (Law); Trade Tools (Carpenter); Hand Weapon (Boat Hook); Religious Symbol (Ulric) |
| Placeholder "Any" / "as Trade" | 17 | 10 | Trade Tools (as Trade); Workshop (as Trade); Melee Weapon (Any) |
| Data glitches | 6 | 0 | `Staf`, `Black Inqusitor’s Attire`, `est Quality Courtly Garb`, `2\r\nWarehouses`, trailing spaces |

Distributed adjectives need care when splitting: "Blue or Green or Turquoise Robes" (Robes), "Sturdy Boots and Cloak" (Boots + Cloak), "Plate Bracers and Leggings".

## New trappings

63 new documents: 28 in both editions, 31 4e only, 4 5e only (91 variants). Counts are career-level uses.

| Trapping | 4e | 5e |
|---|---|---|
| Symbol of Rank (also Sash, Baton of Rank, Copper Badge, Chains/Rod of Office) | 39 | 10 |
| Riverboat | 11 | 1 |
| Licence (magic, pilot) | 11 | 1 |
| Book, other subjects (poetry, philosophy, war, fencing manual, phrase book, gazetteer, Starwatcher’s Handbook, rare books, plain "Book") | 10 | 1 |
| Religious Relic | 9 | 4 |
| Alchemical Laboratory (also Test Tubes and Alembic) | 7 | |
| Barding | 6 | 1 |
| Lucky Charm (also Charms, Trinkets and Charms) | 6 | 1 |
| Sextant | 6 | 1 |
| Leather Apron | 5 | |
| Trade Tools - Farrier / Smith / Carpenter / Thief / Cartographer / Engraver / Astrology / Tinker / Bowyer / Butcher / Cook (11 trades) | 25 | 10 |
| Artillery Piece | 4 | |
| Scarf | 4 | 1 |
| Sea Chest | 3 | |
| Wig | 3 | 1 |
| Both editions, 1–2 uses each: Coach Horn, Coloured Powders, Fishing Rod, Garland, Handcart, Herbs, Instruments of Torture, Lock Box, Printing Press, Whistle, Wooden Training Sword | 1–2 each | 1–2 each |
| 4e only: Badger (mount), Book - Alchemy, Book - Recipes, Chainaxe, Coin Mould, Copper/Silver/Gold Sickle, Crystal Pendulum, Divining Rod, Hammock, Hawk, Incense, Ithilmar Ore, Orrery, Quiver, Runescribing Kit, Scythe, Slate, Sundial, Thermometer, Tripod, Tuning Fork | 1–2 each | |
| 5e only: Basket, Book - Herbs, Calling Card, Sturdy Crate | | 1 each |

Most of these appear in the books only in the career trappings line, so they have no price or Enc in the rules (5e Trade Tools: 3 GC, Enc 1, Workshop 80 GC).

Possibly more, depending on the decisions below:
- Generic Grimoire (both editions).
- Libraries: Theology, Engineering, Art, Law (and Science) next to `Library - Magic`; Large Workshop (Engineer, Artist) next to `Workshop - Apothecary - Large`.
- Splitting "Book (other subjects)" into one book per subject: about 8 more.

Existing trappings that need a variant in the other edition:
- 4e variant for 14 trappings that exist only in 5e (173 uses): Saddle and Harness (51, from "with Saddle and Tack"), Light Warhorse (32), Riding Horse (31), Row Boat (9), Cart (8), Wagon (8), Tattoo (8), Mule (6), Destrier (5), Draught Horse (5), Jewellery (5), Hunting Dog (3), Coach, Pony. 4e has no animals or vehicles among its trappings today.
- 5e variant for Davrich Lamp (1).

## Mappings to check

Judgement calls in the alias table (the owner should confirm or reject them):
- Livery → Courtly Garb (Servant); Spyglass → Telescope; Magnifying Glass, Eyeglass → Reading Lens; Forged Seal → Stamp - Engraved.
- Letter of Commission → Commission Papers; Forged Document, Warrant Papers, Letter of Appointment/Charter, Mercenary Contract → Legal Document.
- Every deity symbol, icon and cult medallion → Religious Symbol; every holy book or prayer book → Book - Religion; Tome of Forbidden Knowledge → Book - Magic; Journal, Captain’s Log → Book - Blank.
- Helmet, Headgear, Tall Sea Helm → Helm; Plate Helm (Open) → Open Helm; any hat (Feathered, Rain, Impressive, Porter Cap, Mortarboard) → Hat; coloured or ceremonial robes → Robes; travel/local/dark clothing → Clothing.
- Staff, Staf, Carved Staff → Quarterstaff; Spade for Shovel; Pewter Stein for Tankard; Cutlass → Sabre (4e).
- 5e versions of 4e-only items: Dwarf Axe → Hand Weapon, Dwarf Greataxe → Greataxe, Elf Bow → Bow, Leather Skullcap → Leather Coif, Great Helm → Helm.
- Alcohol → Flask of Spirits; Herbal Remedies → Healing Poultice; Hunk of Meat → Rations - 1 day.

## Format

The class trappings format (`{"id1,id2": "1d10"}`, one option chosen at random) can't hold choices between bundles (19 entries, 11 of them in 5e: "Bow with 10 Arrows or Pistol with 10 Shots"). Approved format (D1) of a career level, covering all cases and decisions D2, D3 and D10:

```json
"trappings": [
  { "options": [[{ "id": "<writing kit>", "number": "1" }]] },
  { "options": [[{ "id": "<coach>", "number": "1", "value": "with a Footman" }]] },
  { "selection": "choice",
    "options": [[{ "id": "<bow>", "number": "1" }, { "id": "<arrow>", "number": "10" }],
                [{ "id": "<pistol>", "number": "1" }, { "id": "<bullet and powder>", "number": "10" }]] }
],
"money": [{ "coin": "gold", "number": "20" }, { "coin": "silver", "number": "3d10" }],
"items": ""
```

- `trappings`: entries; an entry has one or more options; an option has one or more trappings with a quantity ("2" or "1d10"). A single trapping is an entry with one option. `selection` (entries with more than one option): `choice` (the player picks, the default; every "A or B" and "Weapon (Any)" in the 5e book) or `random` (one option is rolled; none in the 5e book, for users' careers and later data). The generator picks one option at random either way; guided character creation (HG-44, career level 1 only) lets the player pick for `choice` and rolls for `random`. Dice quantities are always rolled. The career page shows the options joined by "or", and marks random ones.
- A trapping in an option may have a `value`, a note that describes it ("with a Footman", "worth 2d10 Pennies"); the career page shows it next to the trapping, and the generator puts it into the value of the trapping on the character (D13, D17).
- `money`: coins (`gold`, `silver`, `brass`, as the character's coins) with a fixed or dice amount; the generator rolls them into the character's coins.
- There is no `notes` field (D20): people, groups, places and the like are generic trappings (Retainer, Command, Holding, …) with a value.
- `items`: the old free text, kept for users' own careers; empty for converted and new careers.
- Tracker ticks of a level (5e generator): number of entries + money items.

## Decisions

The open decisions are tracked in [README.md](README.md#open-decisions).
