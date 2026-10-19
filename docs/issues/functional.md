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

Career level trappings are a free-text field (`CareerLevel.Items`, `items` in `content/career.ts`), so the generator can only add class trappings (`generateClassItems`, from the generation data), never the career's own. Make each level's trappings a list of trapping ids with quantities, edited with a picker, shown on the career page and added by the generator (both editions). Big data part: go through all public careers, list their trappings per level, create the missing ones in the trapping list (descriptions rephrased, not copied from the books) and fill in the new field with a migration script.

Decided: no "group" trappings; choices ("A or B") and rolled quantities ("1d10") are stored in the list itself. Only public careers are converted, and their free text is removed; the first step converts the 64 public 5e career variants only, and 4e variants keep their text for now. Users' own careers keep their free text, still shown and editable; new careers have no free-text field.

Tracking folder (scope, decisions, work plan, data analysis, per-career mappings, new trappings): `docs/hg-40/`.

### HG-43 Guided character creation for 4e
Frontend · 2026-10-16

Today a 4e character is either filled in by hand or generated in one go (`generation/4e/generator4e.ts`, species and career chosen in the form). Add a step-by-step creator that follows the 4e rulebook's character creation chapter: species, class and career, characteristics with Fate/Resilience and extra points, species and career skills and talents, trappings, details, ambitions. Each step offers rolling or choosing as the book does, including the bonus XP for keeping random results, and the player's choices within the rules (e.g. which skills get the Advances). The result is a normal character that opens in the editor. Reuse the generator's steps and data (`generationProps`) instead of a second copy of the rules; the wizard frame (step navigation, back, summary) should be shared with HG-44.

### HG-44 Guided character creation for 5e
Frontend · 2026-10-16

The 5e version of HG-43, following the 5e rulebook's character creation summary: species (choose or roll; keeping the first roll gives +1 Fortune), class and career, characteristics, career skills, talents, trappings and final details, personality and background. Reuse `generation/5e/generator5e.ts` and `generationProps5e` and the wizard frame from HG-43. Career trappings: the player picks the options of level 1 entries marked `choice` and rolls the `random` ones and dice quantities (HG-40 format, `docs/hg-40/analysis.md`). Same limits as the 5e generator (5e content only, species list as in `docs/architecture.md`, HG-36 extends it).

## Ideas

### HG-52 Rune Axe for the 5e Daemon Slayer
Data · 2026-10-19

The 5e Daemon Slayer (Slayer 4) has a "Rune Axe" as a career trapping; HG-40 keeps it as a note for now, because 5e has no runes yet (82 public runes, all 4e only) and the 5e rulebook doesn't describe the axe further. Trappings can carry runes (`runes` on an item), so a proper version would be a 5e trapping based on Axe with a rune once 5e runes exist (from a 5e supplement, or 4e runes given 5e variants), or a plain "Rune Axe" trapping with its own description. Then replace the note in the career with the trapping.

### HG-49 Notes per trapping on the character
Frontend + Backend · 2026-10-19

A character stores its trappings as ids with counts (`equippedItems`, `carriedItems`, `storedItems`), so there is no place for text about one trapping, e.g. "Coach: comes with a Footman" or "Jewellery: worth 50 GC" from the career trappings (HG-40), or "inherited from my father". Today such text goes into the character's free-text notes, prefixed with the trapping. Idea: an optional note per trapping (trapping id → text), editable in the character editor, shown next to the trapping in the sheet's trappings tables and in the CSV export; the generator would then put the career's trapping notes there instead of in the notes.

### HG-5 Translated content (e.g. Polish, Spanish)
Feature · 2026-10-10

Not planned yet; keep the content model compatible. Translations would be a per-language overlay of the text fields of a variant (`editions.5e.i18n.pl.name`, …), not extra variants: rules data (numbers, enums, ids) must stay identical across languages. Missing translation falls back to the default language.

### HG-7 5e Ambitions and Appearance fields
Feature · 2026-10-07

The 5e sheet has Ambitions and Appearance; Hammergen uses the description and notes for them for now. Add proper fields if users ask for them.

### HG-37 Skink species for 4e
Frontend + Backend + Data · 2026-10-16

Look into adding Skinks from the 4e *Lustria* supplement as a 4e-only species (species value, species skills/talents in `generationProps`, careers open to them, the generator). The book is not in `books/`, so the rules have to be checked from the owner's copy first.
