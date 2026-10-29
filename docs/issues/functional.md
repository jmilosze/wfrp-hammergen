# Functional issues

What users can do and how values are calculated: rules, the generator, characters and content. Rules and the next free ID are in [README.md](README.md).

## Bugs

### HG-65 Misnamed Gromril helms
Data · 2026-10-29

The public 4e Gromril helms have confusing names: "Gromril Helm " (`652012db49960d0001346eb5`, trailing space) and "Gromril Helm  - v2" (`6520142249960d0001346eb7`), both Middenheim p. 71, are open helms by their description ("Gromil Open Helm"), while the Dwarf Player's Guide's closed helm (p. 95) is "Gromril Gromril Helm - v3" (`671811a949960d0001f45743`) next to its "Gromril Open Helm". Rename them so the name says which helm it is (e.g. the Dwarf Player's Guide one "Gromril Helm"), and decide whether the two Middenheim documents are duplicates to merge. HG-59 career trappings refer to the Dwarf Player's Guide helm by its id, so a rename doesn't affect them once migrated; before that, the HG-59 mapping (`GROMRIL_HELM` in `db/data/hg-59/supp_map.py`) uses the current name.

### HG-30 Content list misses an edition switch during loading
Frontend · 2026-10-15

`useWhList.loadWhList` (`composables/whList.ts`) returns at once while a load is running, so switching edition while a list loads keeps the old edition's list. A failed load also leaves `apiError` set after a later successful load.

## Features

### HG-1 Read-only public links for your own characters and content
Feature · 2026-10-06

Let a user share a character or custom content (careers, items, …) with anyone through a link, e.g. posted on Discord, without the viewer needing an account or edit rights. Today content is private, shared with linked users, or public (admin only). Needs a per-document "anyone with the link can view" option and view pages that work when logged out; a character also needs the content it references to be readable.

### HG-3 4e supplement content in 5e
Feature · 2026-10-10

Check how 4e supplement careers, species and qualities map to 5e (5e rulebook appendix on compatibility) and whether some should get 5e versions. Today 5e characters can use them through "Allow 4e content". Rule for adding 5e versions: link (add a 5e variant to the 4e document) only when the match is clearly 1-to-1; otherwise create a new 5e-only document.

### HG-6 Career income skill in the editor
Feature · 2026-09-30

Careers have an `incomeSkill` (skill id, both editions); the API checks it is a level 1 skill, but there is no UI to set it and existing careers have none. Add it to the career editor, and consider making it required for 5e careers.

### HG-9 More rules automation (XP accounting, validation)
Feature · 2026-10-07

Today only sheet values are calculated; current/spent XP are typed-in numbers (XP costs are used only by the generator), and nothing checks career access, spell XP or exclusive talents. Possible next steps: XP accounting when buying advances, then validation.

### HG-16 Group skills and talents inside other groups
Frontend + Data · 2026-10-05

Allow a group to belong to another group (e.g. *Lore - Local* in *Lore*, *Secret Signs - Knight* in *Secret Signs*). The skill and talent editors currently clear and hide the group field for groups. Character generation (career skills/talents given as a group, random picks) and the character editor must then resolve a group to the members of its sub-groups too.

### HG-27 Current Wounds on the character
Feature · 2026-10-14

The character only has its maximum Wounds, calculated from the characteristics, size and Hardy. Add the current Wounds (what is left after damage, counting down to 0) to the character model, editable in the editor and shown on the sheet next to the maximum, as the paper sheet's Current Wounds box. Decide how it behaves when the maximum changes (e.g. capped at the new maximum).

### HG-36 Gnome and Ogre characters in 5e
Frontend + Backend + Data · 2026-10-16

5e characters can only be Human, Dwarf, Halfling, High Elf or Wood Elf. The 5e rulebook has Gnome and Ogre only as Bestiary profiles (p. 323–324), and suggests building player characters from such species by giving them a career (p. 318). Allow both species for 5e characters (species values, species skills/talents/Fate/Fortune in `generationProps5e`, the generator). For now they may only take careers from the 5e rulebook, not 4e supplement careers. Open: which careers are allowed (e.g. tick Gnome/Ogre on the chosen 5e careers), and how to handle the Ogre's Size (Large) beyond the Wounds multiplier already modelled (e.g. weapons, armour, encumbrance, movement).

### HG-59 Career trappings as data for 4e careers
Data · 2026-10-25

Career levels have trappings and money as data since HG-40 (format and trapping content rules in `docs/architecture.md`); the 64 public 5e careers were converted, and the 77 trappings made for them have 4e variants too. The 4e careers still have their trappings as text: the 4e variants of those 64 careers and the 113 4e-only careers (core and supplements), 177 public 4e careers in all. Convert them the same way, with no code changes expected: map each level's text to trappings with the 5e rules (generic trappings such as Magic Item for "Magical Item" of Master Alchemist, Master Druid, Grand Astromancer; quality versions with 4e qualities; explicit choice lists for generic weapons; book names kept as notes where the trapping's name doesn't say what it is), add the missing 4e trappings to the data, and fill the fields with a migration script (local, staging, production). The mapping scripts of the 5e conversion (`dump.py`, `parse.py`, `norm.py`, `final.py` with `alias.py`, `gen_docs.py`) are in `db/data/hg-40/` (gitignored, owner's machine only); how they were run and the decisions behind the mapping are in `docs/hg-40/README.md` in git history.

Progress and decisions: `docs/hg-59/README.md` (2026-10-27: the mapping of the 64 core careers in `docs/hg-59/careers-4e.md` is reviewed, their missing trappings are added and their 4e variants have trappings as data in all environments; 2026-10-29: the 113 supplement careers go in eight review batches, batch 1 (25 variants of rulebook careers, with HG-63 and HG-64) is done in all environments; scripts in `db/data/hg-59/` and `db/scripts/fix_career_trappings_4e.py`).

Open: how 5e characters in 4e-only careers ("Allow 4e content") use those careers' trappings, skills and talents, e.g. lookups by shared document, a "5e equivalent" link, 5e versions of popular 4e careers.

Also decide what happens to the 20 public per-trade 4e trappings ("Trade Tools - …", "Workshop - …", "Library - Magic"): their 5e variants were removed in all environments on 2026-10-25 (HG-60; 5e characters got Trade Tools or Workshop with the trade as value), and 4e characters use them (674 entries in the local snapshot, 2026-10-25).

### HG-43 Guided character creation for 4e
Frontend · 2026-10-16

Today a 4e character is either filled in by hand or generated in one go (`generation/4e/generator4e.ts`, species and career chosen in the form). Add a step-by-step creator that follows the 4e rulebook's character creation chapter: species, class and career, characteristics with Fate/Resilience and extra points, species and career skills and talents, trappings, details, ambitions. Each step offers rolling or choosing as the book does, including the bonus XP for keeping random results, and the player's choices within the rules (e.g. which skills get the Advances). The result is a normal character that opens in the editor. Reuse the generator's steps and data (`generationProps`) instead of a second copy of the rules, as 5e guided creation does (in production 2026-10-25): split the 4e-only generator steps into options, random choice and apply, add a 4e `creation4e.ts` (choices and build) and `guided4e.ts` (state, step checks, revalidation after going back) on the pattern of the 5e ones, and reuse `components/wizard/WizardFrame.vue` (steps, back, help and preview slots) and `composables/leaveWarning.ts`. 4e rolls give bonus XP instead of Fate and Fortune.

### HG-52 Rune Axe for the 5e Daemon Slayer
Data · 2026-10-19

The 5e Daemon Slayer (Slayer 4) has a "Rune Axe" as a career trapping; HG-40 gave it as Magic Item ("Rune Axe") for now, because 5e has no runes yet (82 public runes, all 4e only) and the 5e rulebook doesn't describe the axe further. Trappings can carry runes (`runes` on an item), so a proper version would be a 5e trapping based on Axe with a rune once 5e runes exist (from a 5e supplement, or 4e runes given 5e variants), or a plain "Rune Axe" trapping with its own description. Then give the career that trapping instead.

### HG-66 Dwarf trapping swaps in the Dwarf careers
Data · 2026-10-29

The Dwarf Player's Guide (p. 53) lets a Dwarf swap career trappings that suit Dwarfs badly: a Hand Weapon for a Dwarf Axe or Dwarf Warhammer; a Cavalry, Fencing or Parry weapon for a Shield or a Pistol with ammunition; a bow and its ammunition for a Dwarf Crossbow or Dwarf Handgun with ammunition; a Riding Horse or warhorse for full plate armour and a helm. The weapon skill specialisations may be swapped to match. Apply this only to the public 4e careers that are Dwarf versions (the "Dwarf …" and "Slayer - …" variants and the Dwarf Player's Guide careers), not to the general careers: add the swaps as further options of the trapping's entry. From the HG-59 mapping (2026-10-29):

- Light Warhorse with Saddle and Harness (level 4 of Dwarf Artillerist - Guild Engineer, Dwarf Artillerist - Outcast Engineer, Dwarf Handgunner - Thunderer and the three Dwarf Soldiers): add Breastplate, Bracers, Plate Leggings, Helm (full plate as in HG-59 S4).
- Hand Weapon: Thane 1 and 2 (already Dwarf Axe / Dwarf Hammer options), Slayer 1 of the three Slayer variants (Hand Weapon ("Axe")), Dwarf Miner - Lodefinder 2 (Hand Weapon ("Pick")), Thane 3 (Hand Weapon (Fine)): add Dwarf Axe / Dwarf Warhammer where they fit; decide whether the Pick and the Chainaxes (Doom Priest 3) count.
- Bow, Longbow, Sword in Dwarf Artillerist - Outcast Engineer 2 ("Weapon (Any)"): add the Dwarf Crossbow and Dwarf Handgun with ammunition, and Shield / Pistol for the Sword if it counts as Fencing.
- Skills: no Dwarf career has a Cavalry, Fencing, Parry or Bow specialisation; Ride - Horse (level 3 of Dwarf Engineer - Guild Engineer, Dwarf Artillerist - Guild Engineer, Dwarf Handgunner - Thunderer) is not covered by the rule.

Batch 1 of HG-59 (Dwarf Soldiers, Slayers, Dwarf Miner) is migrated in all environments, so those levels need a data fix; batch 2 (the Dwarf Player's Guide careers) can take the swaps into its mapping before its migration. Also decide between "Dwarf Hammer" (`6370fb370c40139be515affc`, Archives I p. 92) and "Dwarf Warhammer" (`671aaa2f49960d0001fac3ae`, Dwarf Player's Guide p. 93): the HG-59 mapping gives the Dwarf careers Dwarf Hammer.

### HG-67 Artillery and war vehicles as trappings
Data · 2026-10-29

No public trapping is an artillery piece or a war vehicle (2026-10-29; the closest are hand-held weapons such as Hand Mortar and Doomrocket Launcher). Up in Arms has rules for artillery (cannons, mortars, organ guns, bolt throwers and others), and other books add more (e.g. the Dwarf and High Elf Player's Guides, Sea of Claws for ship guns). Add them as 4e trappings with their book values, and where their rules fit, decide how vehicles (wagons, war wagons, ships) are described. HG-59 gives the Master Artillerist (Artillerist 4 and its Dwarf and High Elf variants) a single generic Artillery Piece ("with Limber") for now; once the specific pieces exist, those levels could offer them as options instead.

### HG-5 Translated content (e.g. Polish, Spanish)
Feature · 2026-10-10

Not planned yet; keep the content model compatible. Translations would be a per-language overlay of the text fields of a variant (`editions.5e.i18n.pl.name`, …), not extra variants: rules data (numbers, enums, ids) must stay identical across languages. Missing translation falls back to the default language.

### HG-7 5e Ambitions and Appearance fields
Feature · 2026-10-07

The 5e sheet has Ambitions and Appearance; Hammergen uses the description and notes for them for now. Add proper fields if users ask for them.

### HG-37 Skink species for 4e
Frontend + Backend + Data · 2026-10-16

Look into adding Skinks from the 4e *Lustria* supplement as a 4e-only species (species value, species skills/talents in `generationProps`, careers open to them, the generator). The book is not in `books/`, so the rules have to be checked from the owner's copy first.
