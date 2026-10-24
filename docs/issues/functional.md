# Functional issues

What users can do and how values are calculated: rules, the generator, characters and content. Rules and the next free ID are in [README.md](README.md).

## Bugs

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

### HG-40 Career trappings as a list of trappings
Frontend + Backend + Data · 2026-10-16

Done for 5e (in production 2026-10-23): career levels have trappings and money as data (format in `docs/architecture.md`), edited per level, shown on the career page and given by the generator; the 64 public 5e careers were converted and 77 trappings added (in both editions). Left: the 4e careers. Their trappings are still text: the 4e variants of the public careers that have a 5e version, and the 113 4e-only careers (core and supplements). Convert them the same way: map each level's text to trappings (reusing the 5e mapping's rules and the new generic trappings, e.g. Magic Item for "Magical Item" of Master Alchemist, Master Druid, Grand Astromancer), create the 4e trappings that are missing, and fill the fields with a migration script; 4e quality versions use the 4e qualities. Open with it: how 5e characters in 4e-only careers ("Allow 4e content") should use those careers' trappings, skills and talents (ideas in `docs/hg-40/README.md`, D22).

Tracking folder (decisions, mapping pipeline in `db/data/hg-40/`, per-career mappings, new trappings): `docs/hg-40/`; delete it when the 4e part is done.

### HG-43 Guided character creation for 4e
Frontend · 2026-10-16

Today a 4e character is either filled in by hand or generated in one go (`generation/4e/generator4e.ts`, species and career chosen in the form). Add a step-by-step creator that follows the 4e rulebook's character creation chapter: species, class and career, characteristics with Fate/Resilience and extra points, species and career skills and talents, trappings, details, ambitions. Each step offers rolling or choosing as the book does, including the bonus XP for keeping random results, and the player's choices within the rules (e.g. which skills get the Advances). The result is a normal character that opens in the editor. Reuse the generator's steps and data (`generationProps`) instead of a second copy of the rules; the wizard frame (step navigation, back, summary) should be shared with HG-44.

### HG-44 Guided character creation for 5e
Frontend · 2026-10-16

The 5e version of HG-43, following the 5e rulebook's character creation summary: species (choose or roll; keeping the first roll gives +1 Fortune), class and career, characteristics, career skills, talents, trappings and final details, personality and background. Reuse `generation/5e/generator5e.ts` and `generationProps5e` and the wizard frame from HG-43. Career trappings: the player picks one option of each level 1 entry with several options, and dice quantities are rolled (format in `docs/architecture.md`). Same limits as the 5e generator (5e content only, species list as in `docs/architecture.md`, HG-36 extends it).

Tracking folder (rules with pages, decisions, plan): `docs/hg-44/`; delete it when HG-44 is done.

### HG-52 Rune Axe for the 5e Daemon Slayer
Data · 2026-10-19

The 5e Daemon Slayer (Slayer 4) has a "Rune Axe" as a career trapping; HG-40 gives it as Magic Item ("Rune Axe") for now, because 5e has no runes yet (82 public runes, all 4e only) and the 5e rulebook doesn't describe the axe further. Trappings can carry runes (`runes` on an item), so a proper version would be a 5e trapping based on Axe with a rune once 5e runes exist (from a 5e supplement, or 4e runes given 5e variants), or a plain "Rune Axe" trapping with its own description. Then give the career that trapping instead.

### HG-5 Translated content (e.g. Polish, Spanish)
Feature · 2026-10-10

Not planned yet; keep the content model compatible. Translations would be a per-language overlay of the text fields of a variant (`editions.5e.i18n.pl.name`, …), not extra variants: rules data (numbers, enums, ids) must stay identical across languages. Missing translation falls back to the default language.

### HG-7 5e Ambitions and Appearance fields
Feature · 2026-10-07

The 5e sheet has Ambitions and Appearance; Hammergen uses the description and notes for them for now. Add proper fields if users ask for them.

### HG-37 Skink species for 4e
Frontend + Backend + Data · 2026-10-16

Look into adding Skinks from the 4e *Lustria* supplement as a 4e-only species (species value, species skills/talents in `generationProps`, careers open to them, the generator). The book is not in `books/`, so the rules have to be checked from the owner's copy first.
