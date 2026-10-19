# HG-40 Career trappings as a list

Tracking folder for HG-40 (`docs/issues/functional.md`). Delete the folder when HG-40 is done.

Goal: each career level gets a list of trappings (ids with quantities, choices and dice) instead of free text. The list is edited with a picker, shown on the career page and added by the generator.

## Where we are (2026-10-19)

- All decisions are made ("Decided" below); nothing is open.
- Step 2, the career review, is in progress: 54 of 64 careers are ticked in [careers-5e.md](careers-5e.md). Not reviewed yet: Thief, Townsman, Villager, Warden, Warrior Priest, Watchman, Witch, Witch Hunter, Wizard, Wrecker.
- Counts for step 8: 61 new trappings, 39 quality versions, and 5e variants for 2 existing 4e trappings (Axe, Davrich Lamp).
- No code and no database writes yet. Next after the review: step 3 (backend); plan it with the owner before writing code.

## Files

| File | What |
|---|---|
| `README.md` | Scope, decisions, work plan (this file) |
| [analysis.md](analysis.md) | Counts and cases from the data, 5e scope and both editions |
| [careers-5e.md](careers-5e.md) | Proposed list per level of every 5e career, with a review checkbox (generated; ticks are kept) |
| [aliases-5e.md](aliases-5e.md) | Book text mapped to a trapping with another name, confirmed (D9; generated) |
| [new-trappings.md](new-trappings.md) | Trappings to create and quality versions, with Price, Enc and Status (generated; those three columns are kept) |

Data and scripts are in `db/data/hg-40/`. That folder is gitignored and exists only on the owner's machine: it is the only copy of the mapping (`alias.py`) and of the scripts, so keep it backed up. Run from that folder, in this order:
1. `python3 dump.py` (needs pymongo: `../../../.venv/bin/python`): reads the public careers and trappings from local `hammergenGo` into `careers.json` and `items.json`. Only needed when the database changed.
2. `python3 parse.py`, `python3 norm.py`: split the text into entries (`entries.json`) and atoms (`atoms.json`).
3. `python3 final.py`: maps every atom with `match.py` (name matching), `alias.py` (hand-made mapping) and `cat.py` (categories) into `career-trappings-resolved.json`, the input of the migration script.
4. `../../../.venv/bin/python gen_docs.py` (reads trapping prices from local `hammergenGo`): regenerates `careers-5e.md`, `new-trappings.md` and `aliases-5e.md`. It keeps the hand-kept marks: ticked "reviewed" boxes in `careers-5e.md`, and Price, Enc and Status in `new-trappings.md` (matched by career and trapping name). Anything else edited by hand in these files is overwritten.

Rerunning steps 2–4 without changes gives identical files (checked 2026-10-19).

How `alias.py` works: `A` maps book text (lower case) to targets for all careers (`I:` existing trapping, `N:` new trapping, `C:` category or note, `|q` quality); `CHOICES` maps (career, level, book text) to options for one 5e career level and wins over `A` (`#n` quantity or dice, `T:` note on the previous trapping, `C:NOTE=text` a level note); `VERSIONS` lists the quality versions; `BOOK_NAME_NOTE` the book names kept as trapping notes (D14); `SPLIT` splits one book entry into several. The file is appended to over time, so a later assignment overrides an earlier one. Corrections from the review go into `alias.py`, then rerun steps 3 and 4.

## Scope

- Now: the 64 public 5e career variants. Their 4e variants (same documents) keep the free text for now.
- Later: the 177 public 4e careers (numbers in [analysis.md](analysis.md)).
- Users' own careers are not converted; they keep their free text, still shown and editable.
- Related: HG-32 (cache public content on the frontend, `docs/issues/technical.md`); HG-40 makes the trappings list about 95 longer; HG-41 (faster rendering of long picker lists, `docs/issues/ui.md`).

## Decided

- No "group" trappings: choices ("A or B") and dice ("1d10") are stored in the list itself.
- Converted public careers lose the free text. New careers have no free-text field. The field is shown only for levels that still have text.
- New 5e trappings are created as 5e-only documents; the 4e variant is added later when the 4e careers are converted (1-to-1 links).
- D1 Format: [analysis.md](analysis.md#format). A level has `trappings` (entries → options → trappings with quantities and an optional note on the trapping), `money` (coins with fixed or dice amounts), `notes` (short items) and the old `items` text. An entry with several options is a `choice` (the player picks) or `random` (rolled). The generator always picks at random; guided creation (HG-44, career level 1 only) lets the player pick. All 5e book entries are choices.
- D2 Non-trappings: places, vehicles and animals become trappings of type Other, "Cannot be carried", like the existing Riding Horse, Cart and `Workshop - <trade>` (e.g. Townhouse, Temple, Warehouse, Sailing Ship, Kennel). People, intangibles and lands ("Squire", "Large Unit of Knights or Several Small Units of Knights", "The Respect of the Village", Fiefdom, Province) go into a short note per level. Mixed entries become the trapping with a note on it: "Townhouse with Servants" → Townhouse ("comes with Servants").
- D3 Money: kept on the career level as coins (gold crowns, shillings, pennies), each a fixed number or dice ("3d10"); the career page shows it and the generator rolls it and adds it to the character's coins. 5e: Trader 3d10/–, Merchant 20 GC, Master Merchant 100 GC, Merchant Prince 1000 GC, Grandee 200 GC, Noble Lord 500 GC, Wandering Trader 4d10/–.
- D3a "Worth" entries are trappings: "Jewellery worth 50 GC" → the existing Jewellery (price 0, its value varies), "Goods worth 2d10 Pennies" (Pedlar 1–4) → new Trade Goods, "Stolen Goods worth 1d10 Shillings" (Fence 1) → Trade Goods too (the note says they are stolen). The stated worth is a note on the trapping ("worth 50 GC", "stolen, worth 1d10 Shillings"); it is not added to the coins.
- D4 Quality: "Quality X" and "Poor Quality X" become separate trappings with the qualities or flaws set, e.g. "Clothing (Fine)" with Fine 1. A character stores only a trapping id and a count, so the quality must be part of the trapping. 15 base trappings, 32 uses in 5e.
- D4a Quality versions: weapons and Helm in four versions (Durable 1, Fine 1, Lightweight, Practical); trappings not used in Tests (clothing, Cloak, Hat, Robes, Uniform, Courtly Garb, Symbol of Rank) in a Fine 1 version (Fine 2 for Envoy 4's "Best Quality Courtly Clothes"); Trade Tools - Engineer (Practical); Blanket (Ugly) and Jewellery (Ugly, Mystic 1 "Cheap Jewellery"). Servant 4 "Fine Clothes" is Clothing (Fine), not the existing Fine Clothing. Judicial Champion's "2 Quality Weapons" is a choice of the Sword, Rapier, Foil, Pistol and Handgun versions (the guns with 10 Bullet and Powder); Pistol has no Lightweight version (Enc 0). "Quality X" with several versions is a choice between them. Lightweight only where it lowers Enc: equipped weapons count their full Enc, so Lightweight helps from Enc 1 (1 → 0); worn armour and clothing already count 1 less, so it helps only from Enc 2 (Helm 2 → 1). Price: each Quality doubles it, each Flaw halves it. 39 versions.
- D5 Generic weapons: an explicit choice list per career level (in `CHOICES`, `db/data/hg-40/alias.py`); the same is used for "Instrument" (Small/Medium/Large) and "Poison" (Hitman). Ranged options come with 10 ammunition, as the other careers' entries do ("Bow with 10 Arrows").
- D6 Grimoire: a generic Grimoire trapping (type Grimoire, no spells).
- D7 Libraries and workshops: the missing ones become non-carriable trappings (Library - Art/Engineering/Law/Theology, Workshop - Artist/Engineer - Large). "Trade Tools (as Trade)" and "Workshop (as Trade)" map to the existing Trade Tools - Artisan and Workshop - Artisan.
- D8 Generator: a character of level N gets the trappings (and money) of levels 1 to N. The book gives level 1 trappings at creation and expects the higher levels' trappings to be acquired while advancing; lacking them lowers Status ("Maintaining Status"). Trappings from the next level tick the Career Advancement Tracker (sheet, p. 191, p. 196): the 5e generator (`advancement5e.ts`) counts the trappings of level n+1 as ticks of the segment before level n+1, so fewer career skill Advances (and less XP) are needed. Checked: talent + characteristic Advances + next-level entries never exceed a segment (Grave Robber 1→2 and Witch Hunter 1→2 fill it exactly).
- D9 Aliases: [aliases-5e.md](aliases-5e.md) and the D5 choice lists confirmed 2026-10-18, with these changes: Seal of Office → Stamp - Engraved; new Magic Licence and Book (Scholar 1); Plumed Great Helm → Helm; Pots and Pans → Cooking Pot + Pan; Wardrobe of Costumes → 5 × Costume; Selection of Amulets → 1d6 × Amulet; 3 Herbal Remedies → three separate choices of the 11 5e Remedies (three entries, so three tracker ticks); Sack of Poisoned Bait → Sack + Rat Poison; Destrier without a saddle; Ceremonial Cloak → Cloak (Fine); Hiding Place → note; Alcohol → Flask of Spirits; Plate Armour → Breastplate, Bracers, Plate Leggings, Helm; Guild and fleets as notes. Later corrections from the career review (step 2) are in `alias.py` and show in [careers-5e.md](careers-5e.md).
- D10 Tracker ticks: one tick per book entry of the next level: a single trapping, a bundle ("Bow with 10 Arrows"), a choice, money ("20 GC") and each note item ("Squire", "Regiment of Soldiers"). The note is therefore a list of short items, one per book entry; a level's tick count is entries + money + note items. A note on a trapping ("Coach and Footman") is part of its entry and doesn't tick separately.
- D11 Fine Clothing: the 5e Courtier class trapping in `generationProps5e` becomes Clothing (Fine), and the 5e variant of Fine Clothing (`5f1cb495f3230369ab4eb3d3`, no qualities, 1 GC) is removed. The document keeps its 4e variant, which 4e careers use. No character has it today (local snapshot, 2026-10-18); check again in each environment before removing.
- D12 Troll Slayer (Slayer 1) "Hand Weapon (Dwarf Axe)" → Axe (the 5e variant of the 4e Axe); Giant and Dragon Slayer's Greataxe and Throwing Axe without a note.
- D13 Notes on the character: the generator copies the career notes of levels 1 to N (D8) into the character's `notes`, as they are, one line per career level under a "Career trappings:" heading (e.g. "Knight of the Inner Circle: Large Unit of Knights or Several Small Units of Knights; Squire"). A note on a trapping goes into the same line prefixed with the trapping ("Burgomeister: Coach: comes with a Footman"), because characters have no notes per trapping (HG-49). The text is not interpreted: a choice inside a note stays text for the player. Levels without notes get no line. The sheet shows `notes` already (Notes card on the second page, line breaks kept); players edit it in the character editor. Guided creation (HG-44) adds the level 1 notes the same way.
- D14 Book names as trapping notes: when the book's name says what the thing is and the trapping it maps to doesn't, the book's name becomes the trapping's note: Legal Document ("Letter of Appointment", "Orders", "Degree"), Symbol of Rank ("Rod of Office"), Courtly Garb (Servant) ("Livery"), Telescope ("Spyglass"), Hat ("Mortarboard"). Adjectives, purposes, synonyms and pure wording differences get no note ("Sturdy Boots", "Pole for Dead Rats", "Shovel", "Rope"). The list is `BOOK_NAME_NOTE` in `db/data/hg-40/alias.py`.
- D15 Tattoo: the 5e Tattoo (`6ac4ae0780c7a9f35b5112ea`, 5e only, used by Troll Slayer 1) changes from "Can be carried and worn" to "Cannot be carried" (carry type 2), so it never counts towards Encumbrance.
- D16 Hand Weapon variants: Axe (5e variant of the 4e Axe: Trapper, Villager 2, Troll Slayer, choices of Fencer, Knight 2, Soldier 2), Hand Pick (new: Prospector) and Boat Hook (Weapon) (new: Boathand, Riverguide, Sailor 2, Dockhand, Wrecker 2) have all the stats of Hand Weapon; their description says they are a Hand Weapon variant. The 5e Boat Hook and Pick (Tool) stay tools (Tomb Robber gets Pick (Tool)).

## Open decisions

None.

## Work plan

- [x] 1. Agree D1–D16.
- [ ] 2. Review the mapping of all 64 careers in [careers-5e.md](careers-5e.md); fix `alias.py`, regenerate.
- [ ] 3. Backend: new field on `CareerLevel` (Go type, validation of ids and quantities, `omitempty`), tests.
- [ ] 4. Frontend model: `content/career.ts` (type, API mapping, `isEqualTo`, validation), tests.
- [ ] 5. Career editor: per level, entries with options (trapping picker, quantity or dice, note on a trapping, choice/random for entries with several options), money, notes; free-text field only when a level has text.
- [ ] 6. Career page: show trappings (options joined by "or", random ones marked, a trapping's note in brackets after it), money and notes, and the old text where there is one.
- [ ] 7. Generator (4e and 5e): add career trappings next to the class trappings (shared code with `generation/shared/trappings.ts`), for every level up to the character's (D8), roll the career money into the character's coins (next to the 5e starting wealth in `generation/5e/wealth5e.ts`), count next-level trappings as tracker ticks in `advancement5e.ts` (D10), and write the career notes into the character's notes (D13); tests.
- [ ] 8. New trappings: write the 61 new trappings, 39 quality versions and 2 new 5e variants (Axe, Davrich Lamp) in `db/data/5e/items-5e.json` with rephrased descriptions; import locally (`import_5e.py --type item`).
- [ ] 9. Migration script `db/scripts/` (also set the sources of Commission Papers (`5cae05e18f45723008d261c7`), today WFRP without a page in both variants: 4e `{"1": "p. 53"}`, 5e `{"44": "p. 47"}`, the Apothecary career pages; D15: set the 5e Tattoo to "Cannot be carried"; D11: also switch the Courtier class trapping to Clothing (Fine) and remove the 5e variant of Fine Clothing after checking no character uses it) (dry run, `yes`, verification, idempotent): fill the new field of the 5e variants from `career-trappings-resolved.json` and clear their text.
- [ ] 10. Run locally, check careers and the generator in the app.
- [ ] 11. Staging: import trappings, migrate, check.
- [ ] 12. Production: backup, deploy backend then frontend, import trappings, migrate, check.
- [ ] 13. Update `docs/architecture.md` (career trappings), HG-40 in the backlog (4e part left), delete this folder when HG-40 is done.
