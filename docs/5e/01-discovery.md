# WFRP 5e — Discovery: what changes for Hammergen

Status: **draft 1** (2026-09-30). Source material: `books/WFRP5_Core_Rulebook_01_09_26.pdf` (5e, the only 5e book so far), `books/Warhammer_Fantasy_Roleplay_PDF_version4.pdf` + errata (4e), the Hammergen code base and the production DB dump `db/hammergen_29_09_2026` (public/core content only).

This document lists **what** differs between 4e and 5e in the areas Hammergen touches, and what each difference means for Hammergen. It deliberately does not decide **how** to implement anything — that belongs in [02-design.md](02-design.md). Open questions are collected at the end and mirrored in the [tracker](03-tracker.md).

Page references are to the 5e rulebook unless marked 4e.

---

## 0. Headline findings

1. **5e is an evolution, and it says so.** Appendix I (p. 364) states 5e is *compatible with adventures, supplements, and other publications released for 4e*, with conversion notes: Advantage → Momentum, difficulty modifiers expressed as SL, and **Resilience and Resolve removed** (use Fate/Fortune instead). This matters for design: 4e supplement content (careers, spells, items from *Up in Arms*, *Winds of Magic*, etc.) is expected to be usable in 5e games until 5e supplements exist.
2. **Advances are now +5 each.** One Skill or Characteristic Advance adds +5 (4e: +1). XP costs, creation budgets and every place that turns "advances" into a value change. There is an optional rule to buy +1 advances (Appendix II, p. 364).
3. **Character creation is simpler and different**: 5 species (no Gnome/Ogre PCs, no regional variants), 5 species skill advances, 8 career skill advances (max 3 per skill), +6 characteristic points, one career talent, different Fate/Fortune, wealth and trapping rules.
4. **Careers were reworked, not renamed**: same 64 careers (5 renamed), but 58 have a different advance scheme, 44 changed status/standing on at least one level, every level-1 skill list grew from 8 to 10 skills, and 62 changed talents. Career progression uses a *Career Advancement Tracker* (10/12/14 ticks) instead of 4e's "8 skills at N×5 advances".
5. **Talents kept their names but lost characteristic-based ranks.** All 167 5e talents exist in 4e (5 renamed). Most can be taken once; a flat 100 XP each.
6. **Character sheet**: Resilience, Resolve (and Motivation) are gone; Fortune is its own species value; Wounds breakdown shown; new Career Advancement Tracker, Known Languages, Personal/Party Ambition blocks.
7. **Trappings changed a lot in the numbers**: prices (armour 3–7× more expensive), ranges, damage, availability, qualities. Shields moved from melee weapons to armour. Qualities/flaws list changed (new *Unbalanced*, *Parry*, *Inflict (Condition)*, *Magical*; gone *Distract*, *Entangle*, *Impact*, *Slow*, *Tiring*, weapon *Shield N*).
8. **Magic and religion formats are unchanged** (CN/Range/Target/Duration; Range/Target/Duration). Most spell/prayer names are the same, ~15% of matched spells changed CN, and descriptions were rewritten. XP for spells/miracles now depends on how many you know.
9. **Creature traits were overhauled**: generic stat-adjusting traits (Armour, Weapon, Ranged, Brute, Tough, Clever, Cunning, Elite, Leader, Big, Fast, Die Hard…) are gone and replaced by *Creature Templates*; many new traits (Fly, Grim, Stomp, Many Heads, Mark of Chaos…).
10. **Runes do not exist in 5e core.** Gnome and Ogre are NPC-only profiles in the Bestiary.

---

## 1. What Hammergen covers today (the scope of this comparison)

Hammergen entities (Go `internal/domain/warhammer/*.go`, TS `src/frontend/src/services/wh/*.ts`), all with `source` map and owner/visibility:

| Entity | Main fields | Used for |
|---|---|---|
| Career | class, species[], level1–5 {name, status, standing, attributes[], skills[], talents[], items (free text)} | Career lists, character career/path, generator |
| Skill | attribute, type (basic/advanced/mixed), isGroup, displayZero, group[] | Character skills, careers |
| Talent | tests, maxRank, attribute (max-rank bonus), attribute2, isGroup, modifiers {size, movement, attributes, effects[Hardy]}, group[] | Character talents, careers, derived stats |
| Item | price (d), enc, availability, properties[], runes[], type (melee/ranged/ammo/armour/container/grimoire/other) + type-specific block | Character inventory, encumbrance, sheet |
| Property | Quality/Flaw, applicableTo[item types] | Item qualities/flaws (ratings are separate entities: "Blast 3", "Reload 2") |
| Rune | labels, applicableTo | Items (Dwarf supplements) |
| Spell | cn, range, target, duration, classification {type, labels} | Character spells, grimoires |
| Prayer | range, target, duration | Character prayers |
| Trait (creature) | modifiers | Character traits |
| Mutation | type (physical/mental), modifiers | Character mutations |
| Character | species (with region), base attributes/rolls, attribute advances, skills {id, advances}, talents {id, rank}, career + career path, fate, fortune, resilience, resolve, XP current/spent, status/standing, coins, items equipped/carried/stored, spells, prayers, traits, sin, corruption, mutations, notes/description | Sheet (`ViewCharacter.vue`), CSV/print, editor |
| Generation props | classItems, randomTalents, speciesTalents, speciesSkills | Character generator (`services/wh/characterGeneration/*`) |

Derived values computed in the frontend (`characterFull.ts`, `characterUtils.ts`): characteristics = base + advances + talent/trait/mutation modifiers; skill = characteristic + advances; Wounds by Size; Movement/Walk/Run by species; Size from modifiers; encumbrance totals.

The generator implements 4e creation and "level N" NPC generation with 4e XP tables (`calculateExperience.ts`, `generateCareerSkills.ts`, `generateCareerTalents.ts`, `generateAttributes.ts`).

---

## 2. Species

| | 4e (Hammergen today) | 5e (pp. 23–35) |
|---|---|---|
| Playable species | Human, Halfling, Dwarf, High Elf, Wood Elf, Gnome, Ogre (+ ~60 regional variants from supplements, e.g. `0001` Reikland, `0301` Caledor) | **Human (Reiklander), Dwarf, Halfling, High Elf, Wood Elf** only. Gnome and Ogre appear only as Bestiary profiles (pp. 323–324); the Bestiary says NPC species can be made into PCs by giving them a career. |
| Random species | 01–90 Human, 91–94 Halfling, 95–98 Dwarf, 99 High Elf, 00 Wood Elf | same table; **+1 Fortune** if you accept the first roll |
| Size | Halflings/Gnomes are Small (via trait/talent) | Size table puts **halflings in Average**; *Small* still exists as a talent/size step (see §9.4) |

### 2.1 Characteristic modifiers (2d10 + modifier)

| | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| Human | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 | 20 |
| Dwarf | 30 | 20 | 20 | 30 | **10** (4e 20) | 10 | 30 | 20 | 40 | 10 |
| Halfling | 10 | 30 | 10 | **10** (4e 20) | **40** (4e 20) | 20 | 30 | 20 | 30 | 30 |
| High Elf | 30 | 30 | 20 | 20 | 40 | 30 | 30 | 30 | 30 | 20 |
| Wood Elf | 30 | 30 | 20 | 20 | 40 | 30 | 30 | 30 | 30 | 20 |

(Bold = changed vs `racialAttributes` in `attributes.ts`. Bestiary averages on pp. 319–320 are consistent with these.)

### 2.2 Species package

| | Fate | Fortune | Move | Starting talents | Species skills (5 × 1 advance from list) | Fluent languages (+30) |
|---|---|---|---|---|---|---|
| Human | 4 | 3 | 4 | Doomed + 4 random | Animal Care, Charm, Cool, Evaluate, Gossip, Haggle, Language (Bretonnian), Language (Wastelander), Leadership, Lore (Reikland), Melee (Basic), Ranged (Bow) | Reikspiel |
| Dwarf | 2 | 2 | 3 | Magic Resistance, Night Vision, Read/Write or Relentless, Resolute or Strong-minded, Sturdy | Consume Alcohol, Cool, Endurance, Entertain (Storytelling), Evaluate, Intimidate, Lore (Dwarfs), Lore (Geology), Lore (Metallurgy), Melee (Basic), Trade (any one) | Khazalid, Reikspiel |
| Halfling | 2 | 3 | 3 | Acute Sense (Taste), Night Vision, Resistance (Chaos), 2 random | Charm, Consume Alcohol, Dodge, Gamble, Haggle, Intuition, Lore (Reikland), Perception, Sleight of Hand, Stealth (any), Trade (Cook) | Haffennaff, Reikspiel |
| High Elf | 1 | 2 | 5 | Acute Sense (Sight), Coolheaded or Savvy, Night Vision, Second Sight or Sixth Sense, Read/Write | Cool, Entertain (Sing), Evaluate, Leadership, Melee (Basic), Navigation, Perception, Play (any one), Ranged (Bow), Sail, Swim | Elthárin, Reikspiel |
| Wood Elf | 1 | 2 | 5 | Acute Sense (Sight), Hardy or Second Sight, Night Vision, Read/Write or Very Resilient, Rover | Athletics, Climb, Endurance, Entertain (Sing), Intimidate, Melee (Basic), Outdoor Survival, Perception, Ranged (Bow), Stealth (Rural), Track | Elthárin, Reikspiel |

Compared with 4e:

- **Fate/Fortune**: 4e has base Fate + Resilience + extra points to split, and Fortune = Fate, Resolve = Resilience (`data/species.ts`, `generateFateAndResilience`). 5e has fixed Fate and a separate fixed Fortune; no extra points. +1 Fate if the player accepts the first random species, career *and* characteristics (p. 40); +1 Fortune for accepting the first random species (p. 23).
- **Languages are explicit skills.** 4e assumes everyone speaks Reikspiel without a skill. 5e gives each species 6 advances (+30) in one or two Language skills; a Language is fluent at 4 advances (p. 112). The sheet has a separate *Known Languages* block.
- **Species skills**: 4e = 3 skills × 5 advances + 3 skills × 3 advances; 5e = 5 skills × 1 advance (+5).
- **Random talents**: new d100 table (p. 23), 45 entries, re-roll duplicates. Humans get 4 (4e: 3), Halflings 2.
- **Dwarfs double Max Encumbrance** (p. 40), in addition to the Sturdy talent they get.
- Physical characteristics (age, height, eye/hair tables) and name lists are new text; Hammergen's `generateName`/`generateDescription` data would need 5e versions if we want them edition-accurate.

**Impact:** species enum and species-dependent tables (modifiers, movement, fate/fortune, species skills/talents, random talent table, name/description data) need a 5e variant. Gnome/Ogre/regional variants have no 5e rules — decision needed (see Q-SPECIES).

---

## 3. Character creation — side by side

| Step | 4e (as implemented in the generator) | 5e (pp. 22–42) |
|---|---|---|
| 1. Species | choose/roll | choose/roll; +1 Fortune if first roll kept |
| 2. Class & career | choose/roll | choose/roll on species table (p. 36–37). **Keeping the first result gives 2 Trappings from career level 2**; rolling 3 and choosing gives 1. Ticks those boxes on the Career Advancement Tracker. |
| 3. Characteristics | 2d10+mod; 4e: +5 Advances over career characteristics (generator `STARTING_ATTRIBUTE_ADVANCES = 5`) and 50 XP bonus for keeping rolls | 2d10+mod. A) keep in order: **+6 points** (not advances) over the 3 level-1 career characteristics; B) rearrange: +3 points; C) re-roll or point-buy 100 points (4–16 each): no bonus |
| 4. Skills | species 3×5 + 3×3 advances; **40** advances over 8 career skills (max 10 each) | species **5 × 1 advance**; **8 advances** over the 10 level-1 career skills; **no skill may exceed 3 advances (+15) at creation** |
| 5. Talents | species talents + random; 1 career talent | species talents + random; **1 talent from career level 1** |
| 5. Trappings | class trappings + career level-1 trappings | **Clothing, Dagger, Pouch** + class trappings (new table, p. 39) + all career level-1 trappings (+ level-2 trappings from step 2) |
| 5. Wealth | Brass: 2d10 × Standing d; Silver: 1d10 × Standing /; Gold: Standing GC | Brass: **20 d + 2d10 per Standing**; Silver: **10/– + 1d10 per Standing**; Gold: **2 GC + 1 per Standing** |
| 5. Wounds | SB + 2×TB + WPB (Average size) | same for Average; Hardy adds TB |
| 5. Movement | species | species (same values for the five species) |
| 5. Max Enc | SB + TB | SB + TB, **×2 for Dwarfs and Sturdy** |
| 5. Fate | see §2.2 | see §2.2 |
| 6. Personality | short- and long-term Ambitions, Motivation | **Personal Ambition** (+50 XP per session of progress, +250 XP when achieved) and **Party Ambition** (completion = +1 Fate for everyone) |
| XP bonuses | 4e: XP for accepting random rolls | 5e: Fate/Fortune bonuses instead of XP (no creation XP) |
| Spellcasters/priests | — | Recommended minimum: Second Sight, Language (Magick), Channelling (Wind), Petty Magic; priests: Bless (Deity) + Pray |

**Impact:** the whole generator pipeline (`characterGenerator.ts` and helpers) is 4e-specific. The class trappings table and random talent table live in generation props (DB `other` collection) and need 5e equivalents. Keeping the first career roll granting level-2 trappings is new.

---

## 4. Characteristics, Skills and advancement

### 4.1 Advances

- 5e: each Characteristic or Skill Advance = **+5** (pp. 38, 109, 191). A skill's value = characteristic + 5 × advances.
- Appendix II (p. 364) offers an **optional +1 advance** scheme with its own cost table; switching back requires a multiple of 5.
- Talents like Savvy still give flat +5 "that does not count toward Advances" (same idea as 4e).

Hammergen stores advances as integers (`attributeAdvances`, skills `{id, number}`) and adds them directly (`skillForDisplay`: `attribute + skillRank`). If 5e stores the **points added** (an Advance = 5, not 1), the storage and the value calculation stay unchanged; the editor just steps by 5, and the optional +1 rule works without extra work. What does change is the logic around the number: XP cost lookup (5e tables are per +5, so index by points ÷ 5, or the per-point table for the optional rule), creation limits (max 3 advances = 15 points), generator spending, and Career Advancement Tracker ticks (one per +5 purchase).

### 4.2 XP costs (p. 191)

| Increase | Characteristic (each / cumulative) | Skill (each / cumulative) |
|---|---|---|
| +5 | 125 / 125 | 50 / 50 |
| +10 | 175 / 300 | 75 / 125 |
| +15 | 250 / 550 | 100 / 225 |
| +20 | 350 / 900 | 150 / 375 |
| +25 | 500 / 1,400 | 250 / 625 |
| +30 | 700 / 2,100 | 400 / 1,025 |
| +35 | 950 / 3,050 | 600 / 1,625 |
| +40 | 1,300 / 4,350 | 850 / 2,475 |
| +45 | 1,800 / 6,150 | 850 / 3,325 |
| +50 | 2,550 / 8,700 | 1,700 / 5,025 |
| +55 | 3,600 / 12,300 | 2,500 / 7,525 |
| +60 | 5,025 / 17,325 | 3,500 / 11,025 |
| +65 | 6,950 / 24,275 | 4,750 / 15,775 |
| +70 | 9,000 / 33,275 | 6,500 / 22,275 |
| +75 | 11,250 / 44,525 | 8,500 / 30,775 |

(Skill +45 "850" repeats +40 — the cumulative column is consistent with it, so probably intended; flag as possible erratum.)

Optional +1 advances (Appendix II), cost per +1: Characteristic 25/35/50/70/100/140/190/260/360/510/720/1005/1390/1800/2250; Skill 10/15/20/30/50/80/120/170/170/340/500/700/950/1300/1700 for advances 1–5, 6–10, … 71+.

Other costs:

| | 4e | 5e |
|---|---|---|
| Talent | 100 XP × rank being bought | **100 XP flat** per take (p. 191) |
| Advance career level | 100 XP after completing level (8 skills at level×5, 1 talent, characteristics at level×5) | **100 XP** after ticking **10 / 12 / 14** boxes on the Career Advancement Tracker (Advance Career Endeavour, p. 196) |
| Change career | 100 XP (completed) / 200 XP | **100 XP same class / 200 XP other class** (p. 197) |
| Non-career advances | not allowed (skills/characteristics) | **allowed at double cost** for characteristics and *Basic* skills; Advanced skills and talents only via Training/Unusual Learning Endeavours (p. 44) |
| Spells | 4e per-lore costs | depends on number already known (see §8) |

**Career Advancement Tracker (p. 43):** tick one box each time you buy a career skill advance, a career characteristic advance, a career talent, or acquire a Trapping from the *next* career level. 10 ticks to reach level 2, 12 more for level 3, 14 more for level 4. This is a new piece of character state (or something derivable) that the sheet shows.

### 4.3 Skills list

The skill list is effectively the same as 4e (same names, same characteristics, same basic/advanced split). Differences:

- **Sail** is a single Advanced skill in 5e (Hammergen has it as a grouped skill with 18 ship-type specialisations).
- **Stealth** specialisations Rural/Urban/Underground are printed individually on the 5e sheet.
- **Entertain** specialisations are listed as Acting, Comedy, Singing, Storytelling (Hammergen has 10 incl. Taunt, Speeches, Prophecy).
- **Channelling** gains a *Magick* specialisation for witches/hedge witches (p. 236).
- **Language** is fluent at 4 advances; Linguistics makes language advances 50 XP flat.
- Melee specialisations still list *Parry*, but no weapon uses the Parry group any more (see §7).
- Every career's level-1 list now has 10 skills; one is marked (bold italic) as the **Income/Earning skill** used by the Income Endeavour. Hammergen careers have no such field.

**Impact:** skill *data* barely changes; skill *value* calculation and XP costs do. Possibly add "income skill" to careers.

---

## 5. Talents

Details and full list: [appendix C](appendices/c-talents.md).

- Same 167 talents (renames: Diceman→Dicer, Resistance→Resistant, Strider→Striding Gait, Trick Riding→Trick Rider, Tunnel Rat→Tunnel Fighter; hyphenation of Fleet-footed, Nimble-fingered).
- **Max rank**: 4e uses characteristic bonuses (Hammergen: `maxRank` 0 + `attribute`). 5e: 1 by default; Luck ×3; Strong Back, Wealthy, Aethyric Attunement ×2; Magnum Opus unlimited; specialisable talents once per specialisation.
- **Tests** field (4e "Tests: …" line) no longer exists.
- Descriptions rewritten around Advantage/Momentum.
- Mechanical effects Hammergen could compute:
  - Existing modifier types still apply: +5 characteristic (10 talents), Fleet-footed +1 Movement (note: the 4e DB entry has no movement modifier), Hardy (+TB Wounds), Small (size).
  - **New effect types**: Luck (+1 max Fortune per take), Strong Back (+1 Enc, +3 at second take — non-linear), Sturdy (SB counted twice for Enc), Frightening (Fear rating).
  - Rules-level effects: spell/miracle XP scales (Petty/Arcane/Chaos Magic, Invoke, Witch!), Linguistics (language cost), Artistic/Craftsman/Seasoned Traveller (advance out of career), Criminal/Noble Blood/Kingpin (career access), Magic Resistance vs Bless/Invoke/Arcane exclusivity.

**Impact:** talent entity needs 5e-appropriate max-rank semantics, probably no `tests`, and possibly more modifier types. All descriptions need 5e text.

---

## 6. Careers

Details: [appendix A](appendices/a-careers-diff.md) (generated comparison) and [data/careers-5e.json](data/careers-5e.json) (extracted 5e data).

- Same 8 classes (Academics, Burghers, Courtiers, Peasants, Rangers, Riverfolk, Rogues, Warriors). Hammergen also has *Seafarer* (supplement).
- Same 64 careers; renamed: Advisor→**Adviser**, Bawd→**Knave**, Huffer→**Pilot**, Seaman→**Sailor**, Road Warden→**Roadwarden**.
- **4 levels** per career (Hammergen supports up to 5 for supplement careers).
- Level 1: **10 skills** (4e 8), 4 talents; levels 2–4: 6/4/2 skills, 4 talents each; trappings per level.
- Advance scheme: 3 characteristics at L1, then one each at L2/L3/L4 (unchanged structure, different content for 58 careers).
- New per-career data: **income/earning skill**; species availability per career (printed on each career: "Courtier Class: Dwarf, Halfling, High Elf, Human, Wood Elf").
- Trappings now include people/assets ("Aide", "Patron", "Regiment of Recruits") and choice items ("Weapon (Any One)"). Hammergen stores career trappings as free text, which still works.
- Status: at least one level changed in 44 careers (e.g. Soldier Recruit Silver 1 → Brass 5).
- Only-in-4e core entries in the DB (dwarf/high-elf/Ranald variants, e.g. *Dwarf Engineer – Sky Pilot*, *Priest of Ranald*) are from 4e player's guides tagged with the core source; they have no 5e counterpart.

**Impact:** all 64 careers need 5e data entry (the extracted JSON can seed it). Model may need income skill; species list per career exists already.

---

## 7. Trappings (items), qualities and flaws

Weapon and armour tables compared in [appendix B](appendices/b-weapons-armour-diff.md).

### 7.1 Structural changes

| Area | 4e / Hammergen today | 5e (pp. 296–317) |
|---|---|---|
| Availability | Common, Scarce, Rare, Exotic (+ Hammergen *Unique*) | Common, Scarce, Rare, Exotic; availability % table by settlement |
| Craftsmanship | Durable N, Fine N, Lightweight, Practical / Bulky, Shoddy, Ugly, Unreliable | same set (Durable/Fine stackable) |
| Melee groups | Basic, Cavalry, Fencing, Brawling, Flail, **Parry**, Polearm, Two-Handed (+ Engineering from supplements) | Basic, Brawling, Cavalry, Fencing, Flail, Polearm, Two-Handed. **Parry group gone** — buckler/main gauche/swordbreaker are Fencing |
| Ranged groups | Blackpowder, Bow, Crossbow, Engineering, Entangling, Explosives, Sling, Throwing (+ Blowpipe) | same eight |
| Ranged range | single range value | listed range is **Medium**; bands: Point Blank 4 yd, Short ÷2, Long ×2, Extreme ×3 |
| Ammunition | dmg, range, range multiplier | range "As weapon / Half weapon / +10", damage ±N — fits existing fields |
| **Shields** | melee weapons (Parry/Basic group) with *Shield N* quality | **armour** entries with AP (1/2/3), no hit locations, *Shield* quality; can also be used as an improvised weapon |
| Armour groups | Soft Leather, Boiled Leather, Mail, Plate, Soft Kit, Brigandine, Other | Leather (or quilted/padded), Mail, Plate, Shields; optional **Quick Armour** (Light/Medium/Heavy, location *All*) |
| Armour penalty | — | per-piece "Penalty" column (e.g. Helm −2 SL Perception; any mail/plate −1 SL Stealth each) |
| Armour & size | — | +1 Enc and ×2 price per size step above Average (−1 / ÷2 below) |
| Worn items | Enc −1 when worn | same; Bulky clothing/armour is Enc 1 even when worn |
| Coins | — | 1 Enc per 200 coins |
| Overburdened | — | up to 2×: −1 M, −10 Ag, +1 Travel Fatigue; up to 3×: −2 M, −20 Ag; more: cannot move |
| Containers/vehicles | capacity | "Carries" for packs, animals and vehicles |

### 7.2 Qualities and flaws

| | Weapon qualities | Weapon flaws | Armour |
|---|---|---|---|
| Same in both | Blast (N), Damaging, Defensive, Fast, Hack, Impale, Penetrating, Pistol, Precise, Pummel, Repeater (N), Trap Blade, Unbreakable, Wrap | Dangerous, Imprecise, Reload (N), Undamaging | Flexible, Impenetrable / Partial, Weakpoints |
| New in 5e | **Blackpowder** (now a quality with a psychology effect), **Inflict (Condition [strength])**, **Magical**, **Parry** | **Unbalanced** | **Shield** (armour quality) |
| Gone in 5e | Accurate, Distract, Entangle, Impact, Shield (N) | Slow, Tiring | — |

Rule interactions worth noting: a weapon can't be both Defensive and Unbalanced, Precise and Imprecise, Damaging and Undamaging (the later wins). *Slow* is still referenced by the Breath spell and Breath trait (p. 243, 357) — likely an erratum.

*Inflict (Entangled 50)*, *Inflict (Entangled your Strength)*, *Inflict (Deafened)*… are parameterised; Hammergen models ratings by separate property entities ("Blast 3"), which would multiply for Inflict.

### 7.3 Data

- Almost every weapon and armour row changed at least one number. Armour prices went up 3–7× (Mail Coat 3 GC → 20 GC); blackpowder weapons 2.5–5×; ranges of bows/crossbows/slings changed; several damages ±1.
- New items: Sword (separate from Hand Weapon), Net, Garrote, Improvised Weapon, Quick Armour, many trappings (tools, animals, poisons, herbs, prosthetics, magic items: Enchanted Staff, Wizard's Robes, hirelings).
- Renamed: Chainmail * → Mail *, Leather Skullcap → Leather Coif, Great Axe → Greataxe.
- Missing from the 5e tables but referenced by careers: *Leather Breastplate* (Soldier L1), *Helmet* (Soldier L2) — book inconsistency.
- Runes: not in 5e core.

**Impact:** new property set, shield-as-armour, armour group enum, possibly armour penalty field; full re-entry of core items. Not compared yet: non-weapon trappings (see tracker).

---

## 8. Magic

| | 4e | 5e (pp. 230–261) |
|---|---|---|
| Spell format | CN, Range, Target, Duration, description | same |
| Spell kinds | Petty, Arcane, Lore (+ Hammergen: Elven Arcane, Other, rituals…) | Petty, Arcane (treated as part of every Lore incl. Witch, Dark and Chaos lores), Lore, **Chaos** spells |
| Lores in core | 8 Colour, Witchcraft/Hedgecraft, Daemonology/Necromancy, Nurgle/Slaanesh/Tzeentch | same set. **Lore Attribute** and **Ingredients** per lore |
| Talents | Petty Magic, Arcane Magic (Lore), Chaos Magic (Lore), Witch! | same names. Petty Magic grants WPB spells; Arcane/Chaos Magic grants 1 spell. **XP per new spell by count known**: Arcane/Chaos/Invoke 100 (≤5), 200 (6–10), 300 (11–15), 400 (16–20), 500 (21+); Petty 50/100/150/200/250; Witch! 150 then +50 each |
| Multiple lores | — | one Arcane Lore (+1 Dark Lore); elves up to WPB Arcane Lores, needing 8 spells in the previous lore |
| Casting | Language (Magick) vs CN | same; Channelling via Channelling (Wind); overcasting by Int Bonus + WP Bonus SL |
| Armour | — | −1 SL per AP on most armoured location (Chamon/Ghur exceptions) |

Name comparison with the 4e core spells in the DB: 146 5e spells vs 135 4e core. Renamed: T'Essla's Arc → Coruscating Arc, Aqshy's Aegis → Aegis, Fat of the Land → Fare of the Land, Curse of Ill-Fortune → Curse of Ill Fortune. New: Silence (Arcane), Halétha's Joy, Shepherd's Eye (Hedgecraft), Glamour, Make Hale (Witchcraft), Festering Inflammation, Miasma of Pestilence (Nurgle), Boon/Transformation of Tzeentch, From Pain, Pleasure, Phantasmagoria. Of 103 spells matched by name, **15 changed CN** (e.g. Steal Life 7→2, Magic Shield 4→7). All descriptions need re-checking.

**Impact:** spell entity is fine structurally; classification labels likely reusable. Spell cost rules (if Hammergen ever computes spell XP) changed. Content needs 5e versions.

---

## 9. Derived attributes on the sheet

### 9.1 Fate, Fortune, Resilience, Resolve

- **Resilience and Resolve no longer exist** (Appendix I). Fate and Fortune remain; Fortune max is species-based (+ Luck talent, + random-species bonus).
- Hammergen character has `resilience` and `resolve` fields and shows a "Resilience" table on the sheet.

### 9.2 Wounds

- Average size: SB + 2×TB + WPB (+TB per Hardy) — same.
- Size table (p. 361): Small = **2×TB** (4e: 2×TB + WPB), Average = SB+2TB+WPB, Large ×2, Enormous ×4, Monstrous ×8. No entries for Tiny/Little.
- The *Construct* trait uses SB instead of WPB.

### 9.3 Movement

- Same species values (Human 4, Dwarf/Halfling 3, Elves 5); Walk = 2×M yards, Run = 4×M yards (table p. 40). Fleet-footed +1. Overburdened reduces M. Mutations can change M.
- Inconsistency: Bestiary halfling profile has M 4.

### 9.4 Size

- 5e Size trait (p. 360): "five steps from Tiny to Monstrous", table lists Tiny / Average / Large / Enormous / Monstrous, but rules also use **Small** (Small talent, Giant Spider, wounds table, combat modifiers). 4e/Hammergen has seven steps (Tiny, Little, Small, Average, Large, Enormous, Monstrous). Needs a decision on the 5e size scale.

### 9.5 Encumbrance

- Max Enc = SB + TB; ×2 for Dwarfs and Sturdy (4e Sturdy: +2 Enc per rank); Strong Back +1/+3.
- Hammergen today computes encumbrance totals but no maximum; 5e makes the maximum depend on species and talents.
- Sheet shows Weapons / Armour / Trappings / Other / Max / Total.

### 9.6 Corruption and mutation (pp. 187–189)

The mechanism is essentially the 4e one:

- Mutation test when Corruption Points > **WPB + TB** (same as 4e).
- On mutating, lose WPB Corruption.
- Body/mind roll depends on species (Elf always mind, Dwarf 01–05 body, Halfling 01–10, Human 01–50).
- Soul lost if physical mutations > TB or mental mutations > WPB.

What changed is the content of the tables:
- Mutation tables: 20 physical + 20 mental, with characteristic modifiers, Movement, **Armour Points** (Iron Skin +2 AP, Thorny Scales +1 AP), **granted talents** (Enormous Eye → Acute Sense (Sight)), **granted traits** (Fleshy Tentacle → Tentacles). Names mostly as in 4e (Panicked Urgency → Profane Urgency, Thrill Seeker → Thrill Hunter; new Webbed Feet, Spiny Protrusions).

### 9.7 Sin

Same concept; Wrath of the Gods table uses Sin (+10 per point). Sheet shows Sin next to Spells and Prayers.

---

## 10. Religion

- Blessings are a **shared pool of 20** (Battle, Breath, Charisma, Conscience, Courage, Finesse, Fortune, Grace, Hardiness, Healing, The Hunt, Might, Protection, Recuperation, Righteousness, Savagery, Tenacity, Wisdom, Wit + …), each cult gets 6 (table p. 220). Bless (Deity) grants all six at once.
- Miracles are per cult (10 cults in core: Manann, Morr, Myrmidia, Ranald, Rhya, Shallya, Sigmar, Taal, Ulric, Verena). Invoke grants **one** miracle; more cost XP by number known.
- Prayer format unchanged (Range, Target, Duration, description); SL extend range/targets/duration.
- Name comparison with DB (79 vs 79): renamed Manann's Bounty → Manalt's Bounty; Ranald's miracles replaced (Cheat the Odds, Trickster's Glamour, You Saw Nothing instead of Rich Man…, Stay Lucky, You Ain't Seen Me).

**Impact:** Hammergen prayers have no deity/type (blessing vs miracle) classification — useful for both editions, and needed if we want Bless/Invoke to drive what a character can take.

---

## 11. Creature traits

5e list (pp. 356–363): Afraid, Amphibious, Animosity, Belligerent, Bestial, Bite, Blessed, Bounce, Breath (types), Champion, Chill Grasp, Cold-blooded, Constrictor, Construct, Corrosive Blood, Corruption (strength), Dark Vision, Daemonic (rating), Disease, Distracting, Ethereal, Fear (rating), Fly (rating), Frenzy, Ghostly Howl, **Grim**, Hatred, Horns, Hungry, Immune to Psychology, Immunity, Infected, Infestation, **Many Heads**, **Mark of Chaos (god)**, Magical, Magic Resistance, Mental Corruption, Miracles, Mutation, Night Vision, Painless, Petrifying Gaze, Regeneration, Size, Skittish, Spellcaster, **Sprinter**, Stealthy, **Stomp**, **Striding Gait**, Stupid, Swarm, Tail, Tentacles, Territorial, Terror, Tongue, Tracker, Trained (skills), Undead, Unstable, Vampiric, Venom, Vomit, Wallcrawler, Ward, Web.

Gone vs Hammergen DB core traits: **Armour, Weapon, Ranged, Big, Brute, Clever, Cunning, Elite, Leader, Tough, Fast, Die Hard**, Arboreal, Rear, Stride, Swamp-strider, Fury, Prejudice (Flight → Fly, Regenerate → Regeneration). Stat blocks now list attacks and armour directly; *Creature Templates* (Leader, Commander, Soldier, Skirmisher, Elite, Spellcaster, Spellcaster Lord — p. 353) replace the stat-boosting traits.

**Impact:** traits in Hammergen only matter for characters (modifiers + text). The core list changes a lot; Size is the one trait with calculations (wounds).

---

## 12. Character sheet (pp. 24–25, 376–377)

| Block | 4e sheet / Hammergen view | 5e sheet |
|---|---|---|
| Header | Name, Species, Class, Career, Career Level, Career Path, Status, Age, Height, Hair, Eyes | Name, Species, **Appearance** (one field), Class/Career rows with page ref, **Career Advancement Tracker** (10/12/14 boxes), Status |
| Characteristics | Initial / Advances / Current | same |
| Fate | Fate, Fortune, **Resilience, Resolve, Motivation** | **Fate, Fortune only** |
| Movement | Movement, Walk, Run | same |
| XP | Current, Spent, Total | same |
| Languages | — | **Known Languages** (Name, Int, Adv, Skill) |
| Skills | Basic list + Grouped/Advanced | Basic list incl. **Stealth (Rural/Urban/Underground)** printed; other skills in a free list |
| Talents | Name, Times Taken, Description | Name, Description, page (no ranks column) |
| Ambitions | Short-term, Long-term | **Personal Ambition, Party Ambition** |
| Wounds | SB, TB×2, WPB, Hardy, Total | same breakdown, current wounds box |
| Armour | hit-location diagram | same, plus **Shield** location; hit locations re-numbered (01–09 Head, 10–24 Left arm, 25–44 Right arm, 45–79 Body, 80–89 Left leg, 90–00 Right leg) |
| Encumbrance | Weapons, Armour, Trappings, Max, Total | + **Other**; Max = SB+TB |
| Wealth | D, SS, GC | same |
| Corruption & Mutation | Corruption, Mutations | Corruption Points track (skull boxes), Mutation + Effect |
| Psychology | Psychology box | — (no separate block) |
| Spells & Prayers | Name, CN, Range, Target, Duration, Effect | same + **Sin** |
| Party | Party name, members, ambitions | Party Ambition only |

**Impact:** view/print/CSV need a 5e layout; data model needs (at least) removal of Resilience/Resolve for 5e characters, and possibly Ambitions, Appearance, Career Advancement Tracker state and Known Languages grouping.

---

## 13. Sources

- Hammergen `Source` enum lists 43 4e books. 5e adds **WFRP 5e Core Rulebook** (new source id). If 4e supplements are usable in 5e (Appendix I), sources may need an *edition* attribute rather than a separate enum.
- Page numbers differ, so shared entities can't reuse a 4e source page.

---

## 14. Rules that don't affect Hammergen (for completeness)

Tests (difficulty now in SL), Advantage vs Momentum, combat, conditions, critical wounds and injuries (hit location table changed), disease, psychology, endeavours/downtime (except career advance/change costs), regional & character events, Reikland gazetteer, GM chapter. They matter only if Hammergen shows rules text (it does not today).

---

## 15. Inconsistencies found in the 5e PDF (candidate errata)

1. Talent is *Resistant (Threat)* but species/careers/random table say *Resistance (…)*.
2. Size table has five steps without *Small*; rules use Small elsewhere; halflings listed as Average.
3. Halfling PC Movement 3 vs Bestiary Halfling M 4.
4. *Slow* flaw referenced (Breath spell/trait) but not defined in 5e.
5. Melee (Parry) specialisation listed, but no weapon is in the Parry group.
6. Soldier trappings reference *Leather Breastplate* and *Helmet*, not in the armour table.
7. Skill XP table repeats 850 for +40 and +45.
8. *Instinctive Diction 2* in Spellcaster Lord template, talent has no ranks.
9. Smuggler income skill printed as "Stealth (Rural Urban)".

These should be checked against any 5e errata before data entry.

---

## 16. Open questions (decisions for Jacek)

Requirements agreed on 2026-09-30 answer Q-SCOPE, Q-EDITION, Q-COMPAT, Q-OVERLAP and Q-CONVERT — see [02-design.md §1](02-design.md#1-requirements-agreed-2026-09-30). The table below is kept as originally asked; the design doc and tracker hold the current status.

| ID | Question | Why it matters |
|---|---|---|
| Q-SCOPE | Do we keep 4e fully supported alongside 5e (both editions live), or eventually move users to 5e? | Everything below; 14,955 characters exist today |
| Q-EDITION | Where does "edition" live: on characters only, on every entity, on sources? | Content filtering, validation, sharing |
| Q-COMPAT | Can a 5e character use 4e supplement content (careers, spells, items, talents), as Appendix I suggests? If yes, do 4e entities need a 5e variant or are they used as-is? | Avoids duplicating hundreds of supplement entities |
| Q-OVERLAP | For content that exists in both editions (e.g. *Hardy*, *Bow*), separate entities per edition or one entity with edition-specific fields? | Data volume, references from careers/characters |
| Q-SPECIES | 5e species only (5), or also allow Gnome/Ogre/regional variants for 5e characters? | Species enum, generator |
| Q-ADV | Confirm 5e advances are stored as points (5 per Advance), keeping today's storage and value calculation; support the optional +1 rule? | XP cost lookup, editor step, validation |
| Q-TRACKER | Should Hammergen track the Career Advancement Tracker (ticks), compute it, or ignore it? | Character model, sheet |
| Q-AMBITION | Add Personal/Party Ambition and Appearance fields? | Character model |
| Q-CONVERT | Offer 4e → 5e character conversion? | Migration tooling |
| Q-SIZE | Which Size scale for 5e (with or without Small/Little)? | Wounds, traits, talents |
| Q-PROPS | How to model parameterised qualities (*Inflict (Entangled 50)*) — separate entities per value like today, or a rating field? | Property model |
| Q-SHIELD | Shields as armour for 5e only, or re-model for both editions? | Item model |
| Q-PRAYER | Add cult/deity and blessing/miracle classification to prayers (both editions)? | Prayer model |
| Q-RULES | How much 5e rules automation: sheet values only, or also XP accounting / validation of career access / spell XP? | Effort |
| Q-DATA | Who enters 5e core content (all careers, talents, skills, items, spells, prayers, traits, mutations) and how (manual, import script from the extracted JSON)? | Effort and licensing |
