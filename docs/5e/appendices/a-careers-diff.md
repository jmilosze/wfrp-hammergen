# Appendix A — Career-by-career comparison (4e core vs 5e core)

> **Machine-generated** from the 5e PDF (`books/WFRP5_Core_Rulebook_01_09_26.pdf`, pages 45–108) and the 4e core-rulebook careers stored in the production DB dump (`db/hammergen_29_09_2026`, public entries with source `1`). Advance schemes were read from the page graphics (level-1 marker glyph, green/silver/gold background = levels 2/3/4). Spot-checked against the book for Adviser and Soldier. Treat as a starting point and verify against the book before entering data. The extracted 5e data is also in `../data/careers-5e.json`.

Legend: numbers in the advance-scheme rows are the career level at which the characteristic becomes available. `+` = only in 5e, `−` = only in 4e. Names are normalised (`Lore - X` → `Lore (X)`, `(Any One)`/group → `(any)`), but small wording differences can still show up as a +/− pair.

## Summary

All 64 5e careers map to a 4e core career (renames: Advisor→Adviser, Bawd→Knave, Huffer→Pilot, Seaman→Sailor, Road Warden→Roadwarden). Advance scheme changed in 58; at least one level's status/standing changed in 44; skill lists changed in 64 (every level-1 list grew from 8 to 10 skills); talent lists changed in 62.

| Career | Advance scheme changed | Levels with status change | Levels with skill changes | Levels with talent changes |
|---|---|---|---|---|
| [Adviser](#adviser) | yes | 3 | 3 | 4 |
| [Agitator](#agitator) | yes | 0 | 4 | 1 |
| [Apothecary](#apothecary) | yes | 0 | 4 | 4 |
| [Artisan](#artisan) | yes | 0 | 3 | 3 |
| [Artist](#artist) | yes | 3 | 4 | 4 |
| [Bailiff](#bailiff) | yes | 1 | 2 | 3 |
| [Beggar](#beggar) | yes | 1 | 3 | 4 |
| [Boatman](#boatman) | no | 3 | 4 | 4 |
| [Bounty Hunter](#bounty-hunter) | yes | 0 | 2 | 0 |
| [Cavalryman](#cavalryman) | yes | 1 | 4 | 3 |
| [Charlatan](#charlatan) | yes | 0 | 3 | 2 |
| [Coachman](#coachman) | yes | 1 | 3 | 4 |
| [Duellist](#duellist) | no | 2 | 3 | 2 |
| [Engineer](#engineer) | yes | 2 | 4 | 4 |
| [Entertainer](#entertainer) | no | 0 | 1 | 3 |
| [Envoy](#envoy) | yes | 0 | 4 | 3 |
| [Fence](#fence) | yes | 3 | 4 | 4 |
| [Flagellant](#flagellant) | yes | 0 | 2 | 4 |
| [Grave Robber](#grave-robber) | yes | 2 | 3 | 3 |
| [Guard](#guard) | yes | 3 | 3 | 4 |
| [Hedge Witch](#hedge-witch) | yes | 3 | 4 | 4 |
| [Herbalist](#herbalist) | yes | 3 | 4 | 4 |
| [Hunter](#hunter) | yes | 1 | 4 | 4 |
| [Investigator](#investigator) | yes | 0 | 4 | 1 |
| [Knave](#knave) | yes | 1 | 4 | 4 |
| [Knight](#knight) | yes | 0 | 4 | 3 |
| [Lawyer](#lawyer) | yes | 0 | 4 | 4 |
| [Merchant](#merchant) | yes | 0 | 3 | 2 |
| [Messenger](#messenger) | yes | 1 | 4 | 4 |
| [Miner](#miner) | yes | 2 | 3 | 4 |
| [Mystic](#mystic) | yes | 3 | 4 | 4 |
| [Noble](#noble) | yes | 1 | 4 | 4 |
| [Nun](#nun) | yes | 3 | 4 | 3 |
| [Outlaw](#outlaw) | yes | 4 | 4 | 4 |
| [Pedlar](#pedlar) | yes | 1 | 4 | 4 |
| [Physician](#physician) | yes | 0 | 4 | 4 |
| [Pilot](#pilot) | yes | 0 | 4 | 4 |
| [Pit Fighter](#pit-fighter) | no | 0 | 3 | 3 |
| [Priest](#priest) | yes | 2 | 4 | 1 |
| [Protagonist](#protagonist) | yes | 2 | 4 | 4 |
| [Racketeer](#racketeer) | yes | 1 | 3 | 4 |
| [Rat Catcher](#rat-catcher) | yes | 1 | 4 | 4 |
| [Riverwarden](#riverwarden) | yes | 2 | 3 | 2 |
| [Riverwoman](#riverwoman) | yes | 0 | 4 | 4 |
| [Roadwarden](#roadwarden) | yes | 2 | 4 | 3 |
| [Sailor](#sailor) | yes | 3 | 3 | 3 |
| [Scholar](#scholar) | yes | 1 | 3 | 4 |
| [Scout](#scout) | no | 0 | 3 | 4 |
| [Servant](#servant) | yes | 3 | 3 | 4 |
| [Slayer](#slayer) | no | 0 | 4 | 0 |
| [Smuggler](#smuggler) | yes | 4 | 4 | 4 |
| [Soldier](#soldier) | yes | 3 | 4 | 3 |
| [Spy](#spy) | yes | 2 | 4 | 3 |
| [Stevedore](#stevedore) | yes | 2 | 4 | 4 |
| [Thief](#thief) | yes | 2 | 4 | 4 |
| [Townsman](#townsman) | yes | 4 | 4 | 4 |
| [Villager](#villager) | yes | 2 | 3 | 4 |
| [Warden](#warden) | yes | 2 | 3 | 4 |
| [Warrior Priest](#warrior-priest) | yes | 3 | 2 | 3 |
| [Watchman](#watchman) | yes | 0 | 2 | 3 |
| [Witch](#witch) | yes | 4 | 4 | 4 |
| [Witch Hunter](#witch-hunter) | yes | 2 | 3 | 4 |
| [Wizard](#wizard) | yes | 0 | 3 | 4 |
| [Wrecker](#wrecker) | yes | 1 | 2 | 4 |

## Adviser (4e: Advisor)

- **Class:** Courtier
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Wood Elf)
- **Income skill (5e):** Lore (Politics)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 1 | 1 | 1 |  | 3 | 4 | 2 |
| 5e |  |  |  |  | 2 | 4 | 1 | 1 | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Aide — Silver 2 | Aide — Silver 1 | +Charm +Evaluate +Intuition +Lore (Local) +Research +Secret Signs (any) −Consume Alcohol −Endurance −Language (Classical) −Perception | +Etiquette (All) −Etiquette (any) |
| 2 | Advisor — Silver 4 | Adviser — Silver 3 | +Consume Alcohol +Intimidate +Language (Classical, Guilder, or Thieves Tongue) +Lore (Heraldry) −Charm −Evaluate −Intuition −Lore (Local) | +Embezzle −Blather |
| 3 | Counsellor — Gold 1 | Counsellor — Silver 5 | same | +Kingpin −Carouser |
| 4 | Chancellor — Gold 3 | Chancellor — Gold 3 | +Perform (Dancing) −Lore (Heraldry) | +Carouser +Noble Blood −Embezzle −Kingpin |

<details><summary>Trappings</summary>

1. 5e: Writing Kit  
   4e: Writing Kit
2. 5e: Livery  
   4e: Livery
3. 5e: Aide, Quality Clothing  
   4e: Quality Clothing, Aide
4. 5e: Quality Courtly Garb, Riding Horse, Staff of Advisers and Aides  
   4e: Horse with Saddle and Harness, Quality Courtly Garb, Staff of Advisors and Aides

</details>

## Agitator

- **Class:** Burgher
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, Human)
- **Income skill (5e):** Charm

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 3 | 1 |  |  | 4 | 2 |  | 1 |  | 1 |
| 5e | 3 |  |  |  | 2 | 1 |  | 1 | 4 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Pamphleteer — Brass 1 | Pamphleteer — Brass 1 | +Entertain (Storytelling) +Lore (Local) +Stealth (Urban) −Bribery | same |
| 2 | Agitator — Brass 2 | Agitator — Brass 2 | +Melee (Brawling) −Entertain (Storytelling) | same |
| 3 | Rabble Rouser — Brass 3 | Rabble Rouser — Brass 3 | +Ranged (Throwing) −Melee (Brawling) | same |
| 4 | Demagogue — Brass 5 | Demagogue — Brass 5 | +Bribery −Ride (Horse) | +Etiquette (All) −Etiquette (any) |

<details><summary>Trappings</summary>

1. 5e: Hammer and Nails, Pile of Leaflets, Writing Kit  
   4e: Writing Kit, Hammer and Nails, Pile of Leaflets
2. 5e: Leather Jack, Sturdy Crate  
   4e: Leather Jack
3. 5e: Hand Weapon, Pamphleteer  
   4e: Hand Weapon, Pamphleteer
4. 5e: Impressive Hat, 3 Pamphleteers, Patron, Printing Press  
   4e: 3 Pamphleteers, Patron, Printing Press, Impressive Hat

</details>

## Apothecary

- **Class:** Academic
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Trade (Apothecary)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 1 | 3 |  | 1 | 1 | 4 | 2 |
| 5e |  |  |  | 3 | 1 |  | 1 | 1 | 4 | 2 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Apothecary's Apprentice — Brass 3 | Apothecary’s Apprentice — Brass 3 | +Endurance +Haggle +Perception −Lore (Plants) | +Acute Sense (Taste) −Etiquette (Scholar) |
| 2 | Apothecary — Silver 1 | Apothecary — Silver 1 | +Evaluate +Language (Guilder) +Secret Signs (Guilder) +Stealth (Urban) −Haggle −Language (Guilder - Apothecary) −Lore (Science) −Perception | +Etiquette (Guilder) −Etiquette (Guilder - Apothecary) |
| 3 | Master Apothecary — Silver 3 | Master Apothecary — Silver 3 | +Lore (Science) −Secret Signs (Guilder - Apothecary) | +Etiquette (Criminals or Scholars) +Resistant (Poison) −Resistance (Poison) −Savvy |
| 4 | Apothecary-General — Gold 1 | Apothecary General — Gold 1 | +Bribery −Ride (Horse) | +Kingpin +Savant (Chemistry) +Savvy −Acute Sense (Taste) −Master Tradesman (Poisoner) −Savant (Apothecary) |

<details><summary>Trappings</summary>

1. 5e: Book (Blank), Leather Jerkin, Pestle and Mortar  
   4e: Book (Blank), Healing Draught, Leather Jerkin, Pestle and Mortar
2. 5e: Guild Licence, Trade Tools (Apothecary)  
   4e: Guild Licence, Trade Tools
3. 5e: Apprentice, Book (Apothecary), Workshop (Apothecary)  
   4e: Book (Apothecary), Apprentice, Workshop
4. 5e: Commission Papers, Large Workshop (Apothecary)  
   4e: Commission Papers, Large Workshop

</details>

## Artisan

- **Class:** Burgher
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre, Wood Elf)
- **Income skill (5e):** Trade (Any One)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  | 1 | 1 |  |  | 1 | 4 | 3 | 2 |
| 5e |  |  | 1 | 1 |  |  | 1 | 3 | 4 | 2 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Apprentice Artisan — Brass 2 | Apprentice Artisan — Brass 2 | +Art (any) +Haggle +Pick Lock −Stealth (Urban) | +Craftsman (as Trade) +Tenacious −Artistic −Craftsman (any) |
| 2 | Artisan — Silver 1 | Artisan — Silver 1 | +Drive +Language (Guilder) −Haggle −Language (Guilder - Artisan) | +Etiquette (Guilder) −Etiquette (Guilder - Artisan) |
| 3 | Master Artisan — Silver 3 | Master Artisan — Silver 3 | +Secret Signs (Guilder) −Secret Signs (Guilder - Artisan) | +Master Tradesman (as Trade) −Master Tradesman (any) |
| 4 | Guildmaster — Gold 1 | Guildmaster — Gold 1 | same | same |

<details><summary>Trappings</summary>

1. 5e: Chalk, Leather Jerkin, 1d10 Rags  
   4e: Chalk, Leather Jerkin, d10 rags
2. 5e: Guild Licence, Trade Tools (as Trade)  
   4e: Guild Licence, Trade Tools
3. 5e: Apprentice, Workshop (as Trade)  
   4e: Apprentice, Workshop
4. 5e: Guild, Quality Clothing  
   4e: Guild, Quality Clothing

</details>

## Artist

- **Class:** Courtier
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Wood Elf)
- **Income skill (5e):** Art (Any One)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  | 1 |  | 1 |  | 1 | 4 | 3 | 2 |
| 5e |  |  | 1 |  | 1 |  | 1 | 3 | 4 | 2 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Apprentice Artist — Silver 1 | Apprentice Artist — Brass 2 | +Charm +Climb +Intuition +Lore (Art) +Trade (Art Supplies) −Cool −Endurance −Stealth (Urban) | +Read/Write −Tenacious |
| 2 | Artist — Silver 3 | Artist — Silver 1 | +Endurance +Entertain (Storytelling) +Lore (Heraldry) +Melee (Fencing) −Climb −Intuition −Language (Classical) −Trade (Art Supplies) | +Attractive +Nimblefingered −Criminal −Nimble-fingered |
| 3 | Master Artist — Silver 5 | Master Artist — Silver 4 | +Lore (any) +Research +Sleight of Hand −Charm −Lore (Art) −Lore (Heraldry) | +Acute Sense (Sight or Touch) +Tenacious −Acute Sense (any) −Nose for Trouble |
| 4 | Maestro — Gold 2 | Maestro — Gold 2 | +Cool +Secret Signs (any) −Research −Ride (Horse) | +Savant (Art) +Wealthy −Kingpin −Read/Write |

<details><summary>Trappings</summary>

1. 5e: Brush or Chisel or Writing Kit  
   4e: Brush or Chisel or Quill Pen
2. 5e: Sling Bag containing Trade Tools (Artist)  
   4e: Sling Bag containing Trade Tools (Artist)
3. 5e: Apprentice, Patron, Workshop (Artist)  
   4e: Apprentice, Patron, Workshop (Artist)
4. 5e: 3 Apprentices, Large Workshop (Artist), Library (Art)  
   4e: Large Workshop (Artist), Library (Art), 3 Apprentices

</details>

## Bailiff

- **Class:** Peasant
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, Human, Ogre)
- **Income skill (5e):** Intimidate

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  |  |  | 1 | 3 |  | 4 | 1 | 2 |
| 5e | 1 |  | 1 |  | 1 |  |  | 4 | 3 | 2 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Tax Collector — Silver 1 | Tax Collector — Silver 1 | +Athletics +Evaluate +Pick Lock −Haggle | +Break and Enter −Tenacious |
| 2 | Bailiff — Silver 5 | Bailiff — Silver 5 | +Haggle −Evaluate | +Menacing −Break and Enter |
| 3 | Reeve — Gold 1 | Reeve — Gold 1 | same | +Argumentative +Read/ Write −Menacing −Read/Write |
| 4 | Magistrate — Gold 3 | Magistrate — Gold 2 | same | same |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Small Lock Box  
   4e: Hand weapon, small lock box
2. 5e: Leather Jack, 3 Tax Collectors  
   4e: Leather Jack, 3 Tax Collectors
3. 5e: Bailiff, Breastplate, Riding Horse  
   4e: Horse with Saddle and Tack, Breastplate, Bailiff
4. 5e: Library (Law), Quality Robes, Seal of Office  
   4e: Library (Law), Quality Robes, Seal of Office

</details>

## Beggar

- **Class:** Burgher
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, Human, Ogre)
- **Income skill (5e):** Charm

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 3 |  |  | 1 | 4 | 1 |  |  | 2 | 1 |
| 5e | 4 |  |  | 1 | 2 | 1 |  |  | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Pauper — Brass 0 | Pauper — Brass 0 | +Gossip +Outdoor Survival +Perception +Secret Signs (Vagabond) +Stealth (Rural or Urban) −Athletics −Cool −Stealth (Urban) | +Beneath Notice +Resistant (Disease) −Resistance (Disease) −Very Resilient |
| 2 | Beggar — Brass 2 | Beggar — Brass 1 | +Athletics +Cool +Lore (Local) −Gossip −Haggle −Perception | +Blather +Etiquette (Criminals) −Beneath Notice −Etiquette (Criminal) |
| 3 | Master Beggar — Brass 4 | Master Beggar — Brass 4 | +Haggle +Melee (Brawling) −Lore (Local) −Secret Signs (Vagabond) | +Very Resilient −Blather |
| 4 | Beggar King — Silver 2 | Beggar King — Silver 2 | same | +Dealmaker −Kingpin |

<details><summary>Trappings</summary>

1. 5e: Cup, Poor Quality Blanket  
   4e: Poor Quality Blanket, Cup
2. 5e: Bowl, Crutch  
   4e: Crutch, Bowl
3. 5e: Disguise Kit, Hiding Place, Pauper Follower  
   4e: Disguise Kit, Hiding Place, Pauper Follower
4. 5e: Lair, Large Group of Beggar Followers  
   4e: Lair, Large Group of Beggar Followers

</details>

## Boatman

- **Class:** Riverfolk
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Sail

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  | 1 | 1 | 2 | 1 | 3 | 4 |  |  |
| 5e |  |  | 1 | 1 | 2 | 1 | 3 | 4 |  |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Boat-hand — Silver 1 | Boathand — Brass 3 | +Athletics +Charm +Sail −Sail (any) | +Waterman −Dirty Fighting |
| 2 | Boatman — Silver 2 | Boatman — Silver 1 | +Navigation +Secret Signs (Guilder) −Athletics −Intuition | +Dirty Fighting +Etiquette (Guilder) −Etiquette (Guilder - Boatmen) −Waterman |
| 3 | Bargeswain — Silver 3 | Bargeswain — Silver 2 | +Intuition +Trade (Boatbuilder) −Entertain (Singing) −Trade (Boatbuilding) | +Craftsman (Boatbuilder) −Strike Mighty Blow |
| 4 | Barge Master — Silver 5 | Barge Master — Silver 5 | +Cool −Navigation | +Savant (Riverways) −Menacing |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon (Boat Hook), Leather Jack, Pole  
   4e: Hand Weapon (Boat Hook), Leather Jack, Pole
2. 5e: Rope, Rowboat  
   4e: Rope, Rowboat
3. 5e: Backpack, Trade Tools (Carpenter), Trade Tools (Physician)  
   4e: Backpack, Trade Tools (Carpenter)
4. 5e: Barge and Crew, Hat  
   4e: Hat, Riverboat and Crew

</details>

## Bounty Hunter

- **Class:** Ranger
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre, Wood Elf)
- **Income skill (5e):** Melee (Basic)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 2 | 3 | 1 |  | 1 |  | 4 |  |  |
| 5e | 1 | 2 | 1 | 3 |  | 1 |  |  | 4 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Thief-taker — Silver 1 | Thief-taker — Silver 1 | +Athletics +Cool +Pick Lock +Stealth (any) −Bribery −Outdoor Survival | same |
| 2 | Bounty Hunter — Silver 3 | Bounty Hunter — Silver 3 | +Bribery +Outdoor Survival +Ranged (Crossbow, Entangling, or Throwing) −Athletics −Ranged (Crossbow) −Ranged (Engineering) | same |
| 3 | Master Bounty Hunter — Silver 5 | Master Bounty Hunter — Silver 5 | same | same |
| 4 | Bounty Hunter General — Gold 1 | Bounty Hunter General — Gold 1 | same | same |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Leather Jerkin, Rope  
   4e: Hand Weapon, Leather Jerkin, Rope
2. 5e: 2 Bolas or Crossbow with 10 Bolts or Lasso, Leather Skullcap, Manacles, Net, Warrant Papers  
   4e: Crossbow and 10 bolts, Leather Skullcap, Manacles, Net, Warrant Papers
3. 5e: Mail Shirt, Riding Horse  
   4e: Mail Shirt, Riding Horse and Saddle
4. 5e: Draught Horse and Cart, 4 Pairs of Manacles  
   4e: Draught Horse and Cart, Mail Shirt, 4 Pairs of Manacles

</details>

## Cavalryman

- **Class:** Warrior
- **Species:** High Elf, Human, Wood Elf
- **Income skill (5e):** Ride (Horse)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 2 | 1 |  | 3 | 1 |  |  |  | 4 |
| 5e | 1 | 1 | 2 |  | 3 | 1 |  |  |  | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Horseman — Silver 2 | Horseman — Silver 3 | +Consume Alcohol +Cool +Melee (Cavalry) +Ranged (Blackpowder or Bow) −Endurance −Melee (Basic) | +Dual Wielder −Crack the Whip |
| 2 | Cavalryman — Silver 4 | Cavalryman — Silver 4 | +Endurance +Gamble +Melee (Basic) +Play (Horn) −Consume Alcohol −Cool −Melee (Cavalry) −Ranged (Blackpowder) | +Etiquette (Soldiers) +Trick Rider −Etiquette (Solider) −Trick Riding |
| 3 | Cavalry Sergeant — Gold 1 | Cavalry Sergeant — Gold 1 | +Ranged (Engineering) −Intuition | same |
| 4 | Cavalry Officer — Gold 2 | Cavalry Officer — Gold 2 | +Intuition −Gamble | +Read/Write −Reaction Strike |

<details><summary>Trappings</summary>

1. 5e: Bow with 10 Arrows or Pistol with 10 Shots, Leather Jack, Light Warhorse  
   4e: Leather Jack, Riding Horse with Saddle and Tack
2. 5e: Breastplate, Open Helm  
   4e: Breastplate, Helmet, Light Warhorse with Saddle and Tack, Pistol with 10 Shots, Shield
3. 5e: Sash  
   4e: Sash
4. 5e: Deck of Cards, Quality Clothing  
   4e: Deck of Cards, Quality Clothing

</details>

## Charlatan

- **Class:** Rogue
- **Species:** Halfling, High Elf, Human (4e: Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Charm

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  |  | 1 | 3 | 1 | 4 | 2 | 1 |
| 5e |  |  |  |  | 1 | 3 | 1 | 2 | 4 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Swindler — Brass 3 | Swindler — Brass 3 | +Cool +Entertain (Acting) +Intuition −Bribery | +Criminal +Dicer +Fast Hands −Diceman −Etiquette (any) −Luck |
| 2 | Charlatan — Brass 5 | Charlatan — Brass 5 | +Bribery +Language (Thieves Tongue) +Secret Signs (Thief ) −Cool −Entertain (Acting) −Intuition | +Etiquette (Criminals) +Mimic −Criminal −Fast Hands |
| 3 | Con Artist — Silver 2 | Con Artist — Silver 2 | +Language (any) +Lore (Art) −Language (Thief) −Secret Signs (Thief) | same |
| 4 | Scoundrel — Silver 4 | Scoundrel — Silver 4 | same | same |

<details><summary>Trappings</summary>

1. 5e: Deck of Cards, Dice, 2 Sets of Clothing  
   4e: Backpack, 2 Sets of Clothing, Deck of Cards, Dice
2. 5e: Forged Document, Colourful Mixtures, Trinkets and Charms, 2 Sets of Quality Clothing  
   4e: 1 Forged Document, 2 Sets of Quality Clothing, Selection of Coloured Powders and Water, Selection of Trinkets and Charms
3. 5e: Disguise Kit, Multiple Forged Documents  
   4e: Disguise Kit, Lock Picks, Multiple Forged Documents
4. 5e: Forged Seal, Writing Kit  
   4e: Forged Seal, Writing Kit

</details>

## Coachman

- **Class:** Ranger
- **Species:** Dwarf, Halfling, Human
- **Income skill (5e):** Drive

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 3 | 1 |  | 1 | 4 | 2 |  |  | 1 |  |
| 5e |  | 2 |  | 1 | 3 | 1 |  |  | 1 | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Postilion — Silver 1 | Postilion — Silver 1 | +Gossip +Melee (Basic) +Play (Horn) −Ranged (Entangling) | +Combat Aware −Trick Riding |
| 2 | Coachman — Silver 2 | Coachman — Silver 2 | +Ranged (Entangling) −Gossip | +Criminal +Strongminded −Coolheaded −Strong-minded |
| 3 | Coach Master — Silver 3 | Coach Master — Silver 3 | same | +Marksman −Dealmaker |
| 4 | Route Master — Silver 5 | Route Master — Gold 2 | +Haggle −Charm | +Dealmaker +Etiquette (any) +Read/Write −Fearless (Beastmen) −Marksman −Rapid Reload |

<details><summary>Trappings</summary>

1. 5e: Coach Horn, Hat, Leather Jerkin, Warm Coat  
   4e: Warm Coat and Gloves, Whip
2. 5e: Blunderbuss with 10 Shots, Whip  
   4e: Blunderbuss with 10 Shots, Coach Horn, Leather Jack, Hat
3. 5e: Pistol with 10 Shots, Quality Cloak  
   4e: Mail Shirt, Pistol, Quality Cloak
4. 5e: Fleet of Coaches and Horses, Maps  
   4e: Fleet of Coaches and Horses, Maps

</details>

## Duellist

- **Class:** Courtier
- **Species:** Dwarf, High Elf, Human
- **Income skill (5e):** Melee (Any One)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 2 | 3 |  | 1 | 1 |  |  | 4 |  |
| 5e | 1 | 2 | 3 |  | 1 | 1 |  |  | 4 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Fencer — Silver 3 | Fencer — Silver 3 | +Charm +Cool +Gamble −Endurance | same |
| 2 | Duellist — Silver 5 | Duellist — Silver 4 | +Endurance +Entertain (Storytelling) +Intimidate +Melee (any) −Charm −Cool −Gamble −Melee (Parry) | +Dual Wielder −Reversal |
| 3 | Duelmaster — Gold 1 | Duelmaster — Gold 1 | +Lore (Warfare) +Melee (any) −Intimidate −Melee (Basic) | +Reversal −Dual Wielder |
| 4 | Judicial Champion — Gold 3 | Judicial Champion — Gold 2 | same | same |

<details><summary>Trappings</summary>

1. 5e: Melee Weapon (Any), Sling Bag containing Clothing and 1d10 Bandages Those who survive long enough can aspire to the fame of a Duelmaster, teaching their techniques to eager students. Judicial Champions duel on behalf of rulers and nobles, and their blades can determine the fates of nations. Some modern Duellists, particularly hot-headed Altdorf students, favour pistols, much to the disdain of the older generation, who consider them dishonourable and foolhardy. Dwarfs have long traditions of settling bitter disputes through combat, though they have little interest in fencing or the fripperies of swordplay. In contrast, elven Duellists painstakingly cultivate elaborate techniques and observe the intricacies of duelling etiquette. A Duellist’s reputation is their fortune, so they travel the Empire in search of worthy opponents and greater renown. Many also seek masters of foreign fighting styles to hone their skills and add new techniques to their repertoire. Playing a Duellist means you can face almost any foe in single combat, sure in your ability to defeat them with style and panache. Your high social status also opens doors that most warriors cannot.  
   4e: Basic Weapon or Rapier, Sling Bag containing Clothing and 1d10 Bandages
2. 5e: Main Gauche or Sword-breaker, Pistol with 10 Shots  
   4e: Main Gauche or Sword-breaker, Pistol with Gunpowder and Ammunition
3. 5e: Hand Weapon, Quality Rapier, Trusty Second, 2 Wooden Training Swords  
   4e: Quality Rapier, Hand Weapon, Trusty Second, 2 Wooden Training Swords
4. 5e: 2 Quality Weapons  
   4e: 2 Quality Weapons

</details>

## Engineer

- **Class:** Academic
- **Species:** Dwarf, Halfling, Human
- **Income skill (5e):** Trade (Engineer)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  | 1 |  | 3 | 2 |  | 1 | 1 | 4 |  |
| 5e |  | 2 | 1 |  | 3 |  | 1 | 1 | 4 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Student Engineer — Brass 4 | Student Engineer — Brass 4 | +Art (Drawing) +Evaluate +Ranged (Engineering) +Research −Perception −Ranged (Blackpowder) | +Craftsman (Engineer) +Unshakeable −Artistic −Gunner |
| 2 | Engineer — Silver 2 | Engineer — Silver 3 | +Language (Guilder) +Lore (Science) +Ride (Horse) +Secret Signs (Guilder) −Dodge −Language (Guilder - Engineer) −Ranged (Engineering) −Research | +Etiquette (Guilder) +Etiquette (Scholars) +Gunner −Craftsman (Engineer) −Etiquette (Guilder - Engineer) −Orientation |
| 3 | Master Engineer — Silver 4 | Master Engineer — Silver 5 | +Animal Training (Pigeon) +Dodge −Ride (Horse) −Secret Signs (Guilder - Engineer) | +Orientation −Etiquette (Scholar) |
| 4 | Chartered Engineer — Gold 2 | Chartered Engineer — Gold 2 | +Perception −Lore (any) | +Embezzle +Savant (Engineering) −Savant (Engineer) −Unshakeable |

<details><summary>Trappings</summary>

1. 5e: Book (Engineer), Hammer and Spikes  
   4e: Book (Engineer), Hammer and Spikes
2. 5e: Guild Licence, Trade Tools (Engineer)  
   4e: Guild Licence, Trade Tools
3. 5e: Workshop (Engineer)  
   4e: Workshop
4. 5e: Library (Engineering), Quality Trade Tools (Engineer), Large Workshop (Engineer)  
   4e: Guild License, Library (Engineer), Quality Trade Tools (Engineer), Large Workshop (Engineer)

</details>

## Entertainer

- **Class:** Ranger
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre, Wood Elf)
- **Income skill (5e):** Entertain (Any One)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 | 3 |  | 4 |  | 1 | 1 |  |  | 1 |
| 5e | 2 | 3 |  | 4 |  | 1 | 1 |  |  | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Busker — Brass 3 | Busker — Brass 3 | +Consume Alcohol +Dodge | +Perfect Pitch −Public Speaker |
| 2 | Entertainer — Brass 5 | Entertainer — Brass 5 | same | +Trick Rider −Trick Riding |
| 3 | Troubadour — Silver 3 | Troubadour — Silver 3 | same | +Public Speaker −Perfect Pitch |
| 4 | Troupe Leader — Gold 1 | Troupe Leader — Gold 1 | same | same |

<details><summary>Trappings</summary>

1. 5e: Bowl, Musical Instrument  
   4e: Bowl, Instrument
2. 5e: Costume, Instrument, 5 Throwing Knives  
   4e: Costume, Instrument, Selection of Scripts (that you can’t yet read), Throwing Weapons
3. 5e: Trained Animal, Writing Kit  
   4e: Trained Animal, Writing Kit
4. 5e: Draught Horses and Wagon (Stage), Troupe of Entertainers, Wardrobe of Costumes and Props  
   4e: Draught Horses and Wagon (Stage), Wardrobe of Costumes and Props, Troupe of Entertainers

</details>

## Envoy

- **Class:** Courtier
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Wood Elf)
- **Income skill (5e):** Charm

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 1 | 3 | 1 |  | 2 | 4 | 1 |
| 5e |  |  |  | 1 | 2 |  | 4 | 1 | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Herald — Silver 2 | Herald — Silver 2 | +Art (Writing) +Haggle +Lore (Heraldry) +Lore (Politics) −Intuition −Row | same |
| 2 | Envoy — Silver 4 | Envoy — Silver 4 | +Entertain (Storytelling) +Intuition +Language (any) −Art (Writing) −Haggle −Lore (Politics) | +Gregarious +Linguistics −Attractive −Cat-tongued |
| 3 | Diplomat — Gold 2 | Diplomat — Gold 2 | +Consume Alcohol −Navigation | +Cat-tongued −Gregarious |
| 4 | Ambassador — Gold 5 | Ambassador — Gold 5 | +Lore (All) +Secret Signs (any) −Language (any) −Lore (any) | +Savant (Politics) −Savvy |

<details><summary>Trappings</summary>

1. 5e: Leather Jack, Livery, Scroll Case  
   4e: Leather Jack, Livery, Scroll Case
2. 5e: 10 Sheets of Parchment, Writing Kit  
   4e: Quill and Ink, 10 sheets of parchment
3. 5e: Aide, Quality Clothes, Map  
   4e: Aide, Quality Clothes, Map
4. 5e: Best Quality Courtly Clothes, Herald, Staff of Diplomats  
   4e: Aide, Best Quality Courtly Clothes, Staff of Diplomats, Herald

</details>

## Fence

- **Class:** Rogue
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, Human)
- **Income skill (5e):** Evaluate

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  |  | 1 | 1 |  | 2 | 4 | 1 |
| 5e | 4 |  |  |  | 1 |  | 2 | 1 | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Broker — Silver 1 | Broker — Brass 5 | +Bribery +Lore (Local) +Stealth (Urban) −Dodge | +Criminal +Numismatics −Alley Cat −Dealmaker |
| 2 | Fence — Silver 2 | Fence — Silver 1 | +Language (Thieves Tongue) +Lore (Heraldry) +Secret Signs (Thief ) −Intimidate −Perception −Secret Signs (Thief) | +Briber +Dealmaker +Etiquette (Criminals) +Read/ Write −Criminal −Etiquette (Criminal) −Numismatics −Savvy |
| 3 | Master Fence — Silver 3 | Trafficker — Silver 3 | +Drive +Research −Bribery −Lore (Local) | +Cat-tongued +Etiquette (any) −Strike to Stun −Super Numerate |
| 4 | Black Marketeer — Silver 4 | Black Marketeer — Gold 1 | +Intimidate +Leadership −Lore (Heraldry) −Research | +Savvy +Super Numerate −Briber −Dirty Fighting |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Stolen Goods worth 1d10 Shillings  
   4e: Hand Weapon, Stolen Goods worth 3d10 Shillings
2. 5e: Eyeglass, Trade Tools (Engraver), Writing Kit  
   4e: Eye-glass, Trade Tools (Engraver), Writing Kit
3. 5e: Horse and Cart, Pawnbroker’s Shop  
   4e: Pawnbroker’s Shop
4. 5e: Gang of Racketeers, Network of Informers, Warehouse  
   4e: Hired Muscle, Network of Informants, Warehouse

</details>

## Flagellant

- **Class:** Ranger
- **Species:** Human
- **Income skill (5e):** Melee (Flail)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  | 1 | 1 | 3 |  |  |  | 2 | 4 |
| 5e | 1 |  | 2 | 1 |  | 3 |  |  | 1 | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Zealot — Brass 0 | Penitent — Brass 0 | +Athletics +Cool | +Flagellant −Read/Write |
| 2 | Flagellant — Brass 0 | Flagellant — Brass 0 | +Lore (The Empire) +Melee (Basic) +Melee (Two-handed) −Athletics −Cool −Lore (Empire) | +Dual Wielder +Fearless (Everything) −Flagellant −Implacable |
| 3 | Penitent — Brass 0 | Zealot — Brass 0 | same | +Implacable −Field Dressing |
| 4 | Prophet of Doom — Brass 0 | Prophet of Doom — Brass 0 | same | +Jump Up −Fearless (Heretics) |

<details><summary>Trappings</summary>

1. 5e: Flail, Tattered Robes  
   4e: Flail, Tattered Robes
2. 5e: Great Weapon (Military Flail), Religious Symbol  
   4e: Placard, Religious Symbol, Sling
3. 5e: Religious Relic  
   4e: Religious Relic
4. 5e: Book (Religion), Followers (including Penitents, Flagellants, and Zealots)  
   4e: Book (Religion), Followers (including Penitents, Flagellants, and Zealots)

</details>

## Grave Robber

- **Class:** Rogue
- **Species:** Halfling, Human (4e: Halfling, Human, Ogre)
- **Income skill (5e):** Stealth (Any One)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  | 1 |  | 1 |  | 3 | 4 | 1 |  |
| 5e | 4 |  | 1 |  | 1 | 1 | 2 |  | 3 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Body Snatcher — Brass 2 | Penny Thief — Brass 2 | +Athletics +Consume Alcohol +Melee (Basic) −Intuition | same |
| 2 | Grave Robber — Brass 3 | Grave Robber — Brass 4 | +Pick Lock +Set Trap −Lore (Medicine) −Melee (Basic) | +Etiquette (Criminals) +Resistant (Disease) −Resistance (Disease) −Very Strong |
| 3 | Tomb Robber — Silver 1 | Tomb Robber — Silver 3 | +Animal Care +Outdoor Survival −Pick Lock −Set Trap | +Trapper −Tunnel Rat |
| 4 | Treasure Hunter — Silver 5 | Treasure Hunter — Silver 5 | same | +Fearless (Undead) +Wealthy −Fearless (Rats) −Trapper |

<details><summary>Trappings</summary>

1. 5e: Crowbar, Hooded Cloak, Sack, Shovel  
   4e: Crowbar, Handcart, Hooded Cloak, Tarpaulin
2. 5e: Backpack, Handcart, Hand Weapon, Storm Lantern and Oil, Tarpaulin, Trade Tools (Thief )  
   4e: Backpack, Hand Weapon, Spade, Storm Lantern and Oil
3. 5e: Horse and Cart, Leather Jack, Pick, Rope  
   4e: Hand Weapon (Pick), Horse and Cart, Leather Jack, Rope, Trade Tools (Thief)
4. 5e: Bedroll, Maps, Tent, Trade Tools (Engineer), Writing Kit  
   4e: Bedroll, Maps, Tent, Trade Tools (Engineer), Writing Kit

</details>

## Guard

- **Class:** Warrior
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre, Wood Elf)
- **Income skill (5e):** Perception

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  | 3 | 1 | 2 | 1 |  | 4 |  |  |
| 5e | 1 |  | 1 | 2 | 1 | 4 |  |  | 3 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Sentry — Silver 1 | Sentry — Brass 5 | +Cool +Intimidate +Melee (Brawling) −Endurance | +Dicer +Robust −Diceman −Tenacious |
| 2 | Guard — Silver 2 | Guard — Silver 2 | +Endurance +Heal −Cool −Intimidate | +Drilled +Stout-hearted −Relentless −Strike Mighty Blow |
| 3 | Honor Guard — Silver 3 | Honour Guard — Silver 4 | +Lore (Heraldry) +Melee (Twohanded) +Ride (Horse) −Heal −Lore (Etiquette) −Melee (Two-handed) | +Etiquette (any) +Reaction Strike −Jump Up −Stout-hearted |
| 4 | Guard Officer — Silver 5 | Guard Officer — Gold 1 | same | +Nose for Trouble −Robust |

<details><summary>Trappings</summary>

1. 5e: Buckler, Leather Jerkin, Storm Lantern with Oil  
   4e: Buckler, Leather Jerkin, Storm Lantern with Oil
2. 5e: Bow with 10 Arrows, Sleeved Mail Shirt, Shield, Spear  
   4e: Bow with 10 Arrows, Sleeved Mail Shirt, Shield, Spear
3. 5e: Great Weapon or Halberd, Helmet, Uniform  
   4e: Great Weapon or Halberd, Helmet, Uniform
4. 5e: Breastplate, Squad of Guards  
   4e: Breastplate

</details>

## Hedge Witch

- **Class:** Peasant
- **Species:** Human
- **Income skill (5e):** Lore (Folklore)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 1 | 1 |  | 1 | 2 | 4 | 3 |
| 5e |  |  |  |  | 1 | 4 | 1 | 1 | 2 | 3 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Hedge Apprentice — Brass 1 | Hedge Apprentice — Brass 1 | +Channelling (Magick) +Charm +Cool +Lore (Theology) +Trade (Herbalist) −Channelling (Untrained) −Endurance −Language (Belthani) −Perception −Secret Signs (Hedge Witch) | +Craftsman (Herbalist) +Read/Write +Second Sight −Fast Hands −Rover −Strider (Woodlands) |
| 2 | Hedge Witch — Brass 2 | Hedge Witch — Brass 4 | +Lore (Magic) +Lore (Spirits) +Pray +Secret Signs (Hedgefolk) −Cool −Gossip −Trade (Charms) −Trade (Herbalist) | +Striding Gait (any) −Animal Affinity |
| 3 | Hedge Master — Brass 3 | Hedge Master — Brass 5 | +Animal Care +Gossip +Leadership +Perception −Haggle −Lore (Genealogy) −Lore (Magic) −Lore (Spirits) | +Instinctive Diction +Master Tradesman (Herbalist) +Savant (Folklore) −Craftsman (Herbalist) −Pure Soul −Resistance (Disease) |
| 4 | Hedgewise — Brass 5 | Hedgewise — Silver 2 | +Endurance +Lore (Genealogy) −Intimidate −Pray | +Pure Soul +Resistant (Disease) −Master Tradesman (Herbalist) −Night Vision |

<details><summary>Trappings</summary>

1. 5e: Amulet, Hand Weapon (Sickle), Quarterstaff  
   4e: 1d10 Lucky Charms, Quarterstaff, Backpack
2. 5e: Healing Poultice, Trade Tools (Herbalist)  
   4e: Antitoxin Kit, Healing Poultice, Trade Tools (Herbalist)
3. 5e: Apprentice, Isolated Hut  
   4e: Isolated Hut, Apprentice
4. 5e: Assortment of Animal Skulls, Ceremonial Cloak and Garland  
   4e: Assortment of Animal Skulls, Ceremonial Cloak and Garland

</details>

## Herbalist

- **Class:** Peasant
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Gnome, Halfling, High Elf, Human, Wood Elf)
- **Income skill (5e):** Trade (Herbalist)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 1 | 1 | 1 | 2 | 4 |  | 3 |
| 5e |  |  |  | 2 | 3 | 1 | 1 | 1 |  | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Herb Gatherer — Brass 2 | Herb Gatherer — Brass 1 | +Athletics +Heal +Trade (Poisoner) −Charm Animal | +Craftsman (Herbalist) +Hardy +Striding Gait (any) −Acute Sense (Taste) −Rover −Strider (any) |
| 2 | Herbalist — Brass 4 | Herbalist — Brass 4 | +Charm +Evaluate +Navigation −Consume Alcohol −Cool −Heal | +Acute Sense (Taste) +Field Dressing +Nimblefingered +Sharp −Cardsharp −Dealmaker −Nimble-fingered −Sturdy |
| 3 | Herb Master — Silver 1 | Herb Master — Brass 5 | +Animal Care +Cool −Intuition −Trade (Poisoner) | +Concoct +Dealmaker +Master Tradesman (Herbalist) −Craftsman (Herbalist) −Field Dressing −Hardy |
| 4 | Herbwise — Silver 3 | Herbwise — Silver 2 | +Charm Animal −Navigation | +Etiquette (Scholars) +Read/Write +Resistant (Poison) −Concoct −Master Tradesman (Herbalist) −Resistance (Poison) |

<details><summary>Trappings</summary>

1. 5e: Boots, Cloak, Hand Weapon (Sickle), Sling Bag containing Assortment of Herbs  
   4e: Boots, Cloak, Sling Bag containing Assortment of Herbs
2. 5e: Trade Tools (Herbalist)  
   4e: Hand Weapon (Sickle), Healing Poultice, Trade Tools (Herbalist)
3. 5e: 3 Herbal Remedies, Herb Gatherer, Workshop (Herbalist)  
   4e: Herb Gatherer, 3 Healing Poultices, Healing Draught, Workshop (Herbalist)
4. 5e: Book (Herbs), Pony and Cart  
   4e: Pony and Cart

</details>

## Hunter

- **Class:** Peasant
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre, Wood Elf)
- **Income skill (5e):** Outdoor Survival

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  | 2 | 1 | 1 | 3 |  | 1 | 4 |  |  |
| 5e |  | 2 |  | 3 | 1 | 1 |  | 1 | 4 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Trapper — Brass 2 | Trapper — Brass 2 | +Animal Care +Athletics +Stealth (Rural) +Track −Lore (Beasts) −Ranged (Sling) | +Striding Gait (All) −Strider (any) |
| 2 | Hunter — Brass 4 | Hunter — Brass 4 | +Animal Training (Dog) +Lore (Beasts) +Melee (Polearm) +Ranged (Blackpowder, Bow, Crossbow, Sling, or Throwing) +Secret Signs (Ranger) −Intuition −Melee (Basic) −Ranged (Bow) −Secret Signs (Hunter) −Stealth (Rural) | +Sharpshooter −Fast Shot |
| 3 | Tracker — Silver 1 | Tracker — Silver 1 | +Entertain (Storytelling) +Haggle −Ride (Horse) −Track | +Fearless (Beasts) +Sure Shot −Fearless (Animals) −Sharpshooter |
| 4 | Huntsmaster — Silver 3 | Huntsmaster — Silver 4 | +Animal Training (Hawk) +Ride (Horse) −Animal Care −Animal Training (any) | +Etiquette (Servants) +Fast Shot −Fearless (Monsters) −Sure Shot |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon (Axe), Selection of Animal Traps, Sturdy Boots and Cloak  
   4e: Selection of Animal Traps, Hand Weapon, Sturdy Boots and Cloak, Sling with 10 Stone Bullets
2. 5e: Hunting Dog, Ranged Weapon (Any One), Spear  
   4e: Bow with 10 arrows, Sling with Ammunition
3. 5e: Backpack, Bedroll, Tent  
   4e: Backpack, Bedroll, Tent
4. 5e: Hawk Mews or Kennel of Hunting Dogs, Riding Horse  
   4e: Riding Horse with Saddle and Tack, Kennel of Hunting Dogs

</details>

## Investigator

- **Class:** Burgher
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Perception

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  |  | 1 | 1 | 3 | 1 | 4 | 2 |
| 5e |  |  |  |  | 1 | 1 | 4 | 2 | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Sleuth — Silver 1 | Enquirer — Silver 1 | +Dodge +Melee (Brawling) | same |
| 2 | Investigator — Silver 2 | Investigator — Silver 2 | +Bribery +Evaluate +Intimidate −Dodge −Lore (Law) −Melee (Brawling) | +Nose for Trouble −Tenacious |
| 3 | Master Investigator — Silver 3 | Sleuth — Silver 3 | +Lore (Law) +Research −Bribery −Endurance | same |
| 4 | Detective — Silver 5 | Detective — Silver 5 | +Secret Signs (any) −Intimidate | same |

<details><summary>Trappings</summary>

1. 5e: Lamp Oil, Lantern, Journal, Writing Kit  
   4e: Lantern, Lamp Oil, Journal, Quill and Ink
2. 5e: Leather Jack, Hand Weapon, Magnifying Glass, Lockpick  
   4e: Leather Jack, Hand Weapon, Magnifying Glass, Lockpick
3. 5e: Assistant, Office  
   4e: Assistant, Office
4. 5e: Network of Informers, Spyglass  
   4e: Network of Informants, Spyglass

</details>

## Knave (4e: Bawd)

- **Class:** Rogue
- **Species:** Halfling, High Elf, Human (4e: Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Charm

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  |  | 2 | 1 | 1 | 4 | 3 | 1 |
| 5e | 3 |  |  |  | 1 | 2 |  | 1 | 4 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Hustler — Brass 1 | Hustler — Brass 2 | +Intuition +Lore (Local) +Stealth (Urban) −Intimidate | +Criminal −Alley Cat |
| 2 | Bawd — Brass 3 | Knave — Brass 3 | +Language (Thieves Tongue) +Lore (any) +Secret Signs (Thief ) −Dodge −Intuition −Lore (Local) | +Etiquette (any) +Resistant (Disease or Poison) +Suave −Ambidextrous −Criminal −Resistance (Disease) |
| 3 | Procurer — Silver 1 | Procurer — Silver 1 | +Dodge +Leadership −Language (any) −Lore (Law) | +Briber +Numismatics −Etiquette (any) −Suave |
| 4 | Ringleader — Silver 3 | Ringleader — Silver 3 | +Intimidate +Lore (Law) −Leadership −Lore (Heraldry) | +Read/Write +Savant (Local) +Schemer −Briber −Numismatics −Savvy |

<details><summary>Trappings</summary>

1. 5e: Flask of Spirits  
   4e: Flask of Spirits
2. 5e: Dose of Weirdroot, Quality Clothing  
   4e: Dose of Weirdroot, Quality Clothing
3. 5e: A Ring of Hustlers  
   4e: A Ring of Hustlers
4. 5e: A Ring of Knaves, Townhouse with Discreet Back Entrance  
   4e: Townhouse with Discreet Back Entrance, a Ring of Bawds

</details>

## Knight

- **Class:** Warrior
- **Species:** High Elf, Human, Wood Elf
- **Income skill (5e):** Melee (Cavalry)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  | 1 |  | 1 | 1 |  |  | 3 | 4 |
| 5e | 1 |  | 1 | 2 |  | 1 |  |  | 3 | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Squire — Silver 3 | Squire — Silver 3 | +Cool +Melee (Basic) | +Etiquette (Nobles, or Soldiers) +Noble Blood +Strike Mighty Blow −Etiquette (any) −Roughrider −Sturdy |
| 2 | Knight — Silver 5 | Knight — Silver 5 | +Play (Horn) −Cool | +Coolheaded +Roughrider +Sturdy −Menacing −Shieldsman −Strike Mighty Blow |
| 3 | First Knight — Gold 2 | First Knight — Gold 2 | +Ranged (Blackpowder) −Consume Alcohol | same |
| 4 | Knight of the Inner Circle — Gold 4 | Knight of the Inner Circle — Gold 4 | +Secret Signs (Knightly Order) −Secret Signs (Knight) | +Read/Write −Disarm |

<details><summary>Trappings</summary>

1. 5e: Leather Jack, Mail Shirt, Riding Horse, Shield, Trade Tools (Farrier)  
   4e: Leather Jack, Mail Shirt, Riding Horse with Saddle and Tack, Shield, Trade Tools (Farrier)
2. 5e: Destrier, Melee Weapon (Any), Lance, Plate Armour, Sword  
   4e: Destrier with Saddle and Tack, Melee Weapon (Any), Lance, Plate Armour and Helm
3. 5e: Barding, Small Unit of Knights  
   4e: Barding, Small Unit of Knights
4. 5e: Large Unit of Knights or Several Small Units of Knights, Plumed Great Helm, Squire  
   4e: Plumed Great Helm, Squire, Large Unit of Knights or Several Small Units of Knights

</details>

## Lawyer

- **Class:** Academic
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Lore (Law)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 4 | 1 |  | 1 | 1 | 3 | 2 |
| 5e |  |  |  | 4 | 1 |  | 3 | 1 | 2 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Student Lawyer — Brass 4 | Student Lawyer — Brass 4 | +Bribery +Charm +Entertain (Storytelling) +Gossip +Intuition −Endurance −Haggle −Perception | +Etiquette (Scholars) −Etiquette (Scholar) |
| 2 | Lawyer — Silver 3 | Lawyer — Silver 3 | +Cool +Haggle +Intimidate +Language (Guilder) +Lore (Local) +Secret Signs (Guilder) −Bribery −Charm −Gossip −Intuition −Language (Guilder - Lawyer) −Secret Signs (Guilder - Lawyer) | +Briber +Etiquette (Criminals) +Etiquette (Guilder) −Criminal −Etiquette (Guilder - Lawyer) −Suave |
| 3 | Barrister — Gold 1 | Barrister — Gold 1 | +Lore (Politics) +Perception −Intimidate −Lore (any) | +Menacing +Savant (Law) −Bookish −Savvy |
| 4 | Judge — Gold 2 | Judge — Gold 2 | +Leadership −Cool | +Bookish +Master Orator +Savvy −Kingpin −Savant (Law) −Wealthy |

<details><summary>Trappings</summary>

1. 5e: Book (Law), Magnifying Glass  
   4e: Book (Law), Magnifying Glass
2. 5e: Court Robes, Guild Licence, Writing Kit  
   4e: Court Robes, Guild Licence, Writing Kit
3. 5e: Assistant (Student or Servant), Office  
   4e: Office, Assistant (Student or Servant)
4. 5e: Gavel, Ostentatious Wig  
   4e: Gavel, Ostentatious Wig

</details>

## Merchant

- **Class:** Burgher
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Haggle

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 4 |  |  |  | 3 | 1 |  | 2 | 1 | 1 |
| 5e | 4 |  |  |  | 3 | 1 |  | 1 | 2 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Trader — Silver 2 | Trader — Silver 2 | +Charm Animal +Evaluate +Intuition +Navigation −Charm −Gamble | same |
| 2 | Merchant — Silver 5 | Merchant — Silver 5 | +Charm +Gamble +Language (Guilder) +Secret Signs (Guilder) −Evaluate −Intuition −Language (Guilder - Merchant) −Perception | +Etiquette (Guilder) −Etiquette (Guilder - Merchant) |
| 3 | Master Merchant — Gold 1 | Master Merchant — Gold 1 | +Language (any) +Leadership −Navigation −Secret Signs (Guilder - Merchant) | +Super Numerate −Sharp |
| 4 | Merchant Prince — Gold 3 | Merchant Prince — Gold 3 | same | same |

<details><summary>Trappings</summary>

1. 5e: Abacus, Canvas Tarpaulin, Mule and Cart, 3d10 Shillings  
   4e: Abacus, Mule and Cart, Canvas Tarpaulin, 3d10 Silver Shillings
2. 5e: Barge or 2 Wagons, 20 GC, Guild Licence  
   4e: Riverboat or 2 Wagons, Guild License, 20 Gold Crowns
3. 5e: 100 GC, Townhouse with Servants, Warehouse  
   4e: Town House with Servants, Warehouse, 100 Gold Crowns
4. 5e: 2 Barges and 4 Wagons, Large Town Estate, 1000 GC, Quality Clothing, 2 Warehouses  
   4e: 2 Riverboats or 4 Wagons, Large Town Estate, 2
Warehouses, 1000 Gold Crowns, Quality Clothing

</details>

## Messenger

- **Class:** Ranger
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Wood Elf)
- **Income skill (5e):** Endurance

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  |  | 1 | 1 | 1 |  |  | 3 | 4 |
| 5e | 4 |  | 3 | 1 | 1 | 1 |  |  | 2 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Runner — Brass 3 | Runner — Brass 3 | +Cool +Haggle +Melee (Basic) +Secret Signs (Ranger or Thief ) −Gossip −Melee (Brawling) | +Criminal −Step Aside |
| 2 | Messenger — Silver 1 | Messenger — Silver 2 | +Charm Animal +Outdoor Survival +Swim −Charm −Cool −Melee (Basic) | +Iron Will +Read/Write +Striding Gait (All) −Crack the Whip −Criminal −Orientation |
| 3 | Courier — Silver 3 | Courier — Silver 3 | +Charm +Gossip +Lore (Geography) −Bribery −Charm Animal −Outdoor Survival | +Step Aside +Trick Rider −Relentless −Trick Riding |
| 4 | Courier-Captain — Silver 5 | Courier-captain — Silver 5 | +Research −Intimidate | +Orientation +Schemer −Kingpin −Very Resilient |

<details><summary>Trappings</summary>

1. 5e: Scroll Case  
   4e: Scroll Case
2. 5e: Hand Weapon, Leather Jack, Riding Horse  
   4e: Hand Weapon, Leather Jack, Riding Horse with Saddle and Tack
3. 5e: Backpack, Saddlebags, Shield  
   4e: Backpack, Saddlebags, Shield
4. 5e: Couriers, Mail Shirt, Writing Kit  
   4e: Couriers, Mail Shirt, Writing Kit

</details>

## Miner

- **Class:** Peasant
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, Human, Ogre)
- **Income skill (5e):** Endurance

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  | 1 | 1 | 3 |  |  |  | 1 | 4 |
| 5e |  |  | 1 | 1 | 1 |  | 3 |  | 2 | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Prospector — Brass 2 | Prospector — Brass 2 | +Climb +Gossip +Melee (Basic) +Secret Signs (Vagabond) −Intuition −Swim | +Robust +Striding Gait (Rocky) +Strong Back −Rover −Strider (Rocky) −Sturdy |
| 2 | Miner — Brass 4 | Miner — Brass 3 | +Haggle +Stealth (Underground) −Climb −Melee (Basic) | +Sturdy −Strong Back |
| 3 | Master Miner — Brass 5 | Master Miner — Brass 5 | +Intuition +Navigation −Gossip −Stealth (Underground) | +Tunnel Fighter −Tunnel Rat |
| 4 | Mine Foreman — Silver 4 | Mine Foreman — Silver 3 | same | +Strongminded −Strong-minded |

<details><summary>Trappings</summary>

1. 5e: Charcoal Stick, Crude Map, Great Weapon (Two-handed Pick), Hand Weapon (Pick), Pan, Spade  
   4e: Charcoal Stick, Crude Map, Pan, Spade
2. 5e: Davrich Lamp, Lamp Oil, Leather Jack, Open Helm (Miner’s Helm)  
   4e: Davrich Lamp, Hand Weapon (Pick), Lamp Oil, Leather Jack
3. 5e: Trade Tools (Engineer)  
   4e: Great Weapon (Two-handed Pick), Helmet, Trade Tools (Engineer)
4. 5e: Crew of Miners, Writing Kit  
   4e: Crew of Miners, Writing Kit

</details>

## Mystic

- **Class:** Peasant
- **Species:** High Elf, Human, Wood Elf (4e: Human, Wood Elf)
- **Income skill (5e):** Intuition

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  |  | 1 | 3 | 1 | 4 | 2 | 1 |
| 5e |  | 4 |  |  | 1 |  | 1 | 2 | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Fortune Teller — Brass 1 | Fortune Teller — Brass 1 | +Bribery +Entertain (Fortunetelling) +Lore (Astrology) +Lore (Theology) −Augury −Entertain (Fortune Telling) −Haggle | +Holy Visions −Attractive |
| 2 | Mystic — Brass 2 | Mystic — Brass 3 | +Entertain (Storytelling) +Haggle +Secret Signs (Vagabond) −Bribery −Entertain (Prophecy) −Lore (Astrology) | +Supportive +Wellprepared −Holy Visions −Well-prepared |
| 3 | Sage — Brass 3 | Auger — Silver 1 | +Channelling (Azyr) +Language (Magick) +Lore (Magic) −Charm Animal −Entertain (Storytelling) −Language (any) | +Magical Sense −Witch! |
| 4 | Seer — Brass 4 | Seer — Silver 2 | +Charm Animal −Channelling (Azyr) | +Strongminded +Witch! −Magical Sense −Strong-minded |

<details><summary>Trappings</summary>

1. 5e: Cheap Jewellery, Deck of Cards or Dice  
   4e: Deck of Cards or Dice, Cheap Jewellery
2. 5e: Selection of Amulets  
   4e: Selection of Amulets
3. 5e: Writing Kit  
   4e: Trade Tools (Writing)
4. 5e: Trade Tools (Astrology)  
   4e: Trade Tools (Astrology)

</details>

## Noble

- **Class:** Courtier
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, High Elf, Human, Wood Elf)
- **Income skill (5e):** Leadership

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  |  |  | 1 |  | 1 | 3 | 4 | 2 |
| 5e | 1 |  |  |  | 4 | 1 |  | 2 | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Scion — Gold 1 | Scion — Gold 1 | +Gossip +Language (Classical) +Perform (Dancing) +Ride (Horse) −Bribery −Play (any) | +Read/ Write −Read/Write |
| 2 | Noble — Gold 3 | Noble — Gold 2 | +Bribery +Language (any) +Lore (Politics) +Melee (Parry) or Ranged (Blackpowder) +Play (any) −Gossip −Language (Classical) −Lore (Local) −Melee (Parry) −Ride (Horse) | +Menacing −Attractive |
| 3 | Magnate — Gold 5 | Grandee — Gold 5 | +Cool +Lore (Genealogy) +Lore (Local) +Lore (Warfare) −Intuition −Language (any) −Lore (Politics) −Perception | +Commanding Presence +Fearless (Paupers) −Coolheaded −Dealmaker |
| 4 | Noble Lord — Gold 7 | Noble Lord — Gold 7 | +Charm Animal +Intuition −Lore (any) −Track | +Coolheaded −Commanding Presence |

<details><summary>Trappings</summary>

1. 5e: Courtly Garb, Foil or Hand Mirror, Velvet Cloak, Jewellery worth 3d10 GC, Personal Servant  
   4e: Courtly Garb, Foil or Hand Mirror, Jewellery worth 3d10 GC, Personal Servant
2. 5e: Coach or Riding Horse, 4 Household Servants, Jewellery worth 50 GC, Main-gauche or Pistol with 10 Shots, Quality Courtly Garb  
   4e: 4 Household Servants, Quality Courtly Garb, Courtly Garb, Riding Horse with Saddle and Harness or Coach, Main Gauche or Quality Cloak, Jewellery worth 50 GC
3. 5e: Fiefdom, 200 GC, Jewellery worth 200 GC, 2 sets of Quality Courtly Garb, Signet Ring  
   4e: 2 sets of Quality Courtly Garb, 200 GC, Fiefdom, Jewellery worth 200 GC , Signet Ring
4. 5e: 500 GC, Jewellery worth 500 GC, Province  
   4e: 4 sets of Best Quality Courtly Garb, Quality Foil or Hand Mirror, 500 GC, Jewellery worth 500 GC, Province

</details>

## Nun

- **Class:** Academic
- **Species:** Human
- **Income skill (5e):** Lore (Theology)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 4 | 3 |  | 1 | 1 | 2 | 1 |
| 5e |  |  |  | 3 | 4 |  | 1 | 1 | 2 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Novitiate — Brass 1 | Novice — Brass 1 | +Charm +Language (Classical) +Outdoor Survival +Trade (Brewer) −Entertain (Storytelling) −Gossip | +Holy Visions +Read/ Write −Read/Write −Stone Soup |
| 2 | Nun — Brass 4 | Nun — Silver 1 | +Entertain (Storytelling) +Gossip +Intuition +Language (any) +Lore (Local) −Charm −Research −Trade (Brewer) −Trade (Herbalist) −Trade (Vintner) | +Seasoned Traveller −Holy Visions |
| 3 | Abbess — Silver 2 | Abbess — Gold 1 | +Intimidate −Lore (Local) | +Inspiring +Resistant (any) −Resistance (any) −Robust |
| 4 | Prioress General — Silver 5 | Prioress General — Gold 4 | +Research −Language (any) | same |

<details><summary>Trappings</summary>

1. 5e: Religious Symbol, Robes  
   4e: Religious Symbol, Robes
2. 5e: Book (Religion), Religious Relic  
   4e: Book (Religion), Religious Relic, Trade Tools (Any)
3. 5e: Abbey, Library (Theology)  
   4e: Abbey, Library (Theology)
4. 5e: Religious Order  
   4e: Religious Order

</details>

## Outlaw

- **Class:** Rogue
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre, Wood Elf)
- **Income skill (5e):** Intimidate

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 2 | 1 | 1 | 3 |  |  |  |  | 4 |
| 5e | 1 | 2 | 1 | 3 |  | 1 |  |  |  | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Brigand — Brass 1 | Brigand — Brass 3 | +Dodge +Perception +Stealth (Rural) −Consume Alcohol | +Menacing +Very Resilient −Combat Aware −Flee! |
| 2 | Outlaw — Brass 2 | Outlaw — Brass 5 | +Consume Alcohol +Gossip +Ranged (Bow or Crossbow) +Secret Signs (Scout) +Set Trap −Dodge −Heal −Perception −Ranged (Bow) −Stealth (Rural) | +Robust +Striding Gait (any) −Dirty Fighting −Strike to Stun |
| 3 | Outlaw Chief — Brass 4 | Outlaw Chief — Silver 3 | +Bribery +Navigation +Ranged (Blackpowder) −Gossip −Intuition −Ride (Horse) | +Deadeye Shot +Dual Wielder +Fearless (Roadwardens) +Seasoned Traveller −Menacing −Rapid Reload −Roughrider −Very Resilient |
| 4 | Bandit King — Silver 2 | Bandit King — Gold 1 | +Ride (Horse) −Lore (any) | +Frightening +Inspiring +Unshakeable −Deadeye Shot −Fearless (Road Wardens) −Robust |

<details><summary>Trappings</summary>

1. 5e: Bedroll, Hand Weapon, Leather Jerkin, Tinderbox  
   4e: Bedroll, Hand Weapon, Leather Jerkin, Tinderbox
2. 5e: Bow with 10 Arrows or Crossbow with 10 Bolts or Shield, Tent  
   4e: Bow with 10 Arrows, Shield, Tent
3. 5e: Band of Outlaws, Helmet, Sleeved Mail Shirt  
   4e: Helmet, Riding Horse with Saddle and Tack, Sleeved Mail Shirt, Band of Outlaws
4. 5e: ‘Fiefdom’ of Outlaw Chiefs, Lair  
   4e: 'Fiefdom' of Outlaw Chiefs, Lair

</details>

## Pedlar

- **Class:** Ranger
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, Human, Ogre)
- **Income skill (5e):** Haggle

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 1 | 3 |  | 1 | 4 | 1 | 2 |
| 5e |  |  |  | 1 | 3 | 1 | 2 | 4 |  | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Vagabond — Brass 1 | Vagabond — Brass 1 | +Athletics +Navigation +Secret Signs (Vagabond) +Stealth (Rural) −Intuition −Stealth (Rural or Urban) | +Gregarious +Stone Soup +Striding Gait (any) −Fisherman −Rover −Tinker |
| 2 | Pedlar — Brass 4 | Pedlar — Brass 4 | +Drive +Lore (Local) +Perception −Animal Care −Charm Animal −Ride (Horse) | +Sturdy +Tinker +Well-prepared −Dealmaker −Orientation −Strong Back |
| 3 | Master Pedlar — Silver 1 | Carter — Silver 2 | +Animal Care +Charm Animal +Intuition +Ranged (Sling) −Drive −Intimidate −Language (any) −Perception | +Dealmaker +Orientation +Sixth Sense +Tenacious −Numismatics −Sturdy −Very Resilient −Well-prepared |
| 4 | Wandering Trader — Silver 3 | Wandering Trader — Silver 3 | +Language (any) −Lore (Local) | +Etiquette (any) +Numismatics +Strongminded −Cat-tongued −Strong-minded −Tenacious |

<details><summary>Trappings</summary>

1. 5e: Basket, Blanket, Goods worth 2d10 Pennies, Small Tent  
   4e: Backpack, Bedroll, Goods worth 2d10 Brass, Tent
2. 5e: Backpack or Handcart, Bedroll, Goods worth 8d20 Pennies, Pots and Pans, Trade Tools (Tinker)  
   4e: Mule and Saddlebags, Goods worth 2d10 Silver, Selection of Pots and Pans, Trade Tools (Tinker)
3. 5e: Mule and Cart, Goods worth at least 2d10 Shillings, Sling with 10 Bullets  
   4e: Cart, Goods worth at least 2d10 Gold
4. 5e: Draught Horse and Wagon, Goods worth at least 3d10 Shillings, 4d10 Shillings  
   4e: Draught Horse and Wagon, Goods worth at least 5d10 Gold, 50 Silver in Coin

</details>

## Physician

- **Class:** Academic
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Heal

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  |  | 3 | 4 | 1 | 1 | 1 | 2 |
| 5e |  |  |  | 2 | 3 |  | 1 | 1 | 4 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Physician’s Apprentice — Brass 4 | Physician’s Apprentice — Brass 4 | +Charm +Consume Alcohol +Language (Classical) +Lore (Medicine) +Research +Trade (Barber) −Bribery −Drive −Perception −Sleight of Hand | +Craftsman (Barber) −Strike to Stun |
| 2 | Physician — Silver 3 | Physician — Silver 3 | +Bribery +Language (Guilder) +Lore (Science) +Secret Signs (Guilder) +Sleight of Hand −Charm −Language (Guilder - Physician) −Lore (Anatomy) −Lore (Medicine) −Trade (Barber) | +Etiquette (Guilder) +Etiquette (Scholars) +Nimble-fingered −Coolheaded −Criminal −Etiquette (Guilder - Physician) |
| 3 | Doktor — Silver 5 | Doktor — Silver 5 | +Entertain (Storytelling) +Gamble +Intuition −Consume Alcohol −Intimidate −Research | +Ambidextrous +Resistant (Disease) −Etiquette (Scholar) −Resistance (Disease) |
| 4 | Court Physician — Gold 1 | Court Physician — Gold 1 | +Lore (Genealogy) −Lore (Noble) | +Carouser −Nimble-fingered |

<details><summary>Trappings</summary>

1. 5e: Bandages, Healing Draught  
   4e: Bandages, Healing Draught
2. 5e: Book (Medicine), Guild Licence, Trade Tools (Physician)  
   4e: Book (Medicine), Guild Licence, Trade Tools (Medicine)
3. 5e: Apprentice, Workshop (Physician)  
   4e: Apprentice, Workshop (Medicine)
4. 5e: Courtly Attire, Letter of Appointment  
   4e: Courtly Attire, Letter of Appointment

</details>

## Pilot (4e: Huffer)

- **Class:** Riverfolk
- **Species:** Dwarf, Halfling, High Elf, Human
- **Income skill (5e):** Lore (Riverways)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  |  | 1 | 1 |  |  | 3 | 2 | 4 |
| 5e |  |  | 1 |  | 1 | 2 |  | 1 | 4 | 3 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Riverguide — Brass 4 | Riverguide — Brass 4 | +Navigation +Outdoor Survival | +River Guide −Night Vision |
| 2 | Huffer — Silver 1 | Pilot — Silver 1 | +Athletics +Haggle −Melee (Basic) −Navigation | +Etiquette (Guilder) +Night Vision +Pilot −Dealmaker −Etiquette (Guilder - River Pilot) −River Guide |
| 3 | Pilot — Silver 3 | Navigator — Silver 3 | +Endurance −Haggle | +Dealmaker +Savant (Riverways) +Strong Swimmer −Pilot −Sea Legs −Very Strong |
| 4 | Master Pilot — Silver 5 | Master Pilot — Silver 5 | +Sail −Sail (any) | +Seasoned Traveller −Strong Swimmer |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon (Boat Hook)  
   4e: Hand Weapon (Boat Hook), Storm Lantern and Oil
2. 5e: Leather Jerkin, Rope, Rowboat  
   4e: Leather Jerkin, Rope, Row Boat
3. 5e: Pole, Storm Lantern and Oil  
   4e: Pole, Storm Lantern and Oil
4. 5e: Boathand, Small Riverboat  
   4e: Boathand, Small Riverboat

</details>

## Pit Fighter

- **Class:** Warrior
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Halfling, High Elf, Human, Ogre, Wood Elf)
- **Income skill (5e):** Melee (Any One)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  | 1 | 1 | 2 | 3 |  |  |  | 4 |
| 5e | 1 |  | 1 | 1 | 2 | 3 |  |  |  | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Pugilist — Brass 4 | Pugilist — Brass 4 | +Consume Alcohol +Entertain (Taunt) | +Enclosed Fighter −Reversal |
| 2 | Pit Fighter — Silver 2 | Pit Fighter — Silver 2 | +Melee (Flail or Twohanded) +Perform (Fight) −Intuition −Melee (Flail or Two-handed) | +Menacing −Ambidextrous |
| 3 | Pit Champion — Silver 5 | Pit Champion — Silver 5 | +Heal +Intuition +Perform (Acrobatics) −Consume Alcohol −Lore (Anatomy) −Perform (Fight) | +Ambidextrous −Menacing |
| 4 | Pit Legend — Gold 2 | Pit Legend — Gold 2 | same | same |

<details><summary>Trappings</summary>

1. 5e: Bandages, Knuckledusters, Leather Jack  
   4e: Bandages, Knuckledusters, Leather Jack
2. 5e: Flail or Great Weapon, Net or Whip, Shield  
   4e: Flail or Great Weapon, Hand Weapon, Net or Whip, Shield or Buckler
3. 5e: Breastplate, Helmet  
   4e: Breast Plate, Helmet
4. 5e: Quality Helmet  
   4e: Quality Helmet

</details>

## Priest

- **Class:** Academic
- **Species:** Human (4e: Gnome, Human)
- **Income skill (5e):** Pray

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 1 | 4 | 1 |  | 3 | 1 | 2 |
| 5e |  |  |  | 3 | 4 | 2 |  | 1 | 1 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Initiate — Brass 2 | Initiate — Brass 2 | +Charm +Entertain (Storytelling) +Heal +Language (Classical) −Athletics −Perception | same |
| 2 | Priest — Silver 1 | Priest — Silver 2 | +Leadership +Lore (any) +Outdoor Survival −Charm −Entertain (Storytelling) −Heal | same |
| 3 | High Priest — Gold 1 | High Priest — Gold 1 | +Lore (Politics) +Perception −Leadership −Lore (Heraldry) | same |
| 4 | Lector — Gold 2 | Lector — Gold 4 | +Lore (Heraldry) −Lore (Politics) | +Resistant (any) −Resistance (any) |

<details><summary>Trappings</summary>

1. 5e: Religious Symbol, Robes  
   4e: Religious Symbol, Robes
2. 5e: Book (Religion), Ceremonial Robes  
   4e: Book (Religion), Ceremonial Robes
3. 5e: Quality Robes, Religious Relic, Subordinate Priests, Temple  
   4e: Quality Robes, Religious Relic, Subordinate Priests, Temple
4. 5e: Library (Theology), Subordinate High Priests  
   4e: Library (Theology), Subordinate High Priests

</details>

## Protagonist

- **Class:** Warrior
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, High Elf, Human, Ogre)
- **Income skill (5e):** Melee (Basic)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 3 |  | 1 | 2 | 1 |  |  |  | 4 |
| 5e | 1 | 3 | 1 | 1 |  | 2 |  |  |  | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Braggart — Brass 2 | Braggart — Brass 3 | +Consume Alcohol +Cool +Melee (Basic) +Melee (Brawling) −Haggle −Melee (any) | +Criminal −Warrior Born |
| 2 | Protagonist — Silver 1 | Protagonist — Brass 5 | +Pick Lock +Ride (Horse) +Stealth (any) −Charm −Melee (Basic) −Ride (any) | +Etiquette (Criminals) +Warrior Born −Criminal −Reversal |
| 3 | Hitman — Silver 4 | Hitman — Silver 4 | +Entertain (Acting) +Ranged (Blackpowder or Crossbow or Throwing) +Trade (Poisoner) −Cool −Navigation −Ranged (Throwing) | +Alley Cat +Shadow +Strike to Injure −Disarm −Marksman −Relentless |
| 4 | Assassin — Gold 1 | Assassin — Gold 1 | +Animal Care +Charm −Entertain (Acting) −Ranged (Crossbow) | +Dual Wielder +Mimic +Secret Identity −Accurate Shot −Ambidextrous −Strike to Injure |

<details><summary>Trappings</summary>

1. 5e: Hood or Mask, Knuckledusters, Leather Jack  
   4e: Hood or Mask, Knuckledusters, Leather Jack
2. 5e: Mail Shirt, Riding Horse, Shield  
   4e: Hand Weapon, Mail Shirt, Riding Horse with Saddle and Tack, Shield
3. 5e: Cloak, Crossbow with 10 Bolts or Pistol with 10 Shots or 5 Throwing Knives, Garotte, Poison  
   4e: Cloak, Garotte, Poison, Throwing Knives
4. 5e: Disguise Kit  
   4e: Crossbow with 10 shots, Disguise Kit

</details>

## Racketeer

- **Class:** Rogue
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, Human, Ogre)
- **Income skill (5e):** Intimidate

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  | 1 | 1 |  |  |  | 4 | 3 | 2 |
| 5e | 1 |  | 1 | 1 | 2 |  |  | 4 | 3 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Thug — Brass 3 | Thug — Brass 3 | +Gamble +Melee (Basic) | +Break and Enter +Dirty Fighting −Etiquette (Criminal) −Strike Mighty Blow |
| 2 | Racketeer — Brass 5 | Racketeer — Brass 5 | +Climb +Language (Thieves Tongue) +Perception +Secret Signs (Thief ) −Charm −Evaluate −Language (Estalian or Tilean) −Melee (Basic) | +Alley Cat +Etiquette (Criminals) −Dirty Fighting −Warrior Born |
| 3 | Gang Boss — Silver 3 | Gang Boss — Silver 3 | +Charm −Perception | +Nose for Trouble +Numismatics −Iron Will −Resistance (Poison) |
| 4 | Crime Lord — Silver 5 | Crime Lord — Gold 1 | same | +Iron Will −Wealthy |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Knuckledusters, Leather Jack  
   4e: Knuckledusters, Leather Jack
2. 5e: Hat, Mail Shirt  
   4e: Hand Weapon, Hat, Mail Shirt
3. 5e: Crossbow Pistol with 10 Bolts, Gang of Thugs and Racketeers, Lair  
   4e: Crossbow Pistol with 10 Bolts, Gang of Thugs and Racketeers, Lair
4. 5e: Network of Informers, Quality Clothing and Hat, Subordinate Gang Bosses  
   4e: Network of Informers, Quality Clothing and Hat, Subordinate Gang Bosses

</details>

## Rat Catcher

- **Class:** Burgher
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, Human, Ogre)
- **Income skill (5e):** Set Trap

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 1 | 4 | 2 | 3 |  |  |  | 1 |  |
| 5e | 1 |  | 4 | 1 | 2 |  | 1 |  | 3 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Rat Hunter — Brass 3 | Rat Hunter — Brass 3 | +Animal Care +Haggle +Perception +Set Trap +Stealth (Underground) +Stealth (Urban) −Athletics −Consume Alcohol −Ranged (Sling) −Stealth (Underground or Urban) | +Enclosed Fighter +Resistant (Disease) +Trapper −Resistance (Disease) −Strike Mighty Blow −Strike to Stun |
| 2 | Rat Catcher — Silver 1 | Rat Catcher — Brass 5 | +Drive +Language (Guilder) +Lore (Rats) +Track +Trade (Poisoner) −Animal Care −Haggle −Lore (Poison) −Perception −Set Trap | +Acute Sense (Hearing) +Etiquette (Guilder) +Tunnel Fighter −Enclosed Fighter −Etiquette (Guilder - Rat Catcher) −Very Resilient |
| 3 | Sewer Jack — Silver 2 | Sewer Jack — Silver 2 | +Intimidate −Climb | +Strike to Injure +Very Resilient −Strong Legs −Tunnel Rat |
| 4 | Exterminator — Silver 3 | Exterminator — Silver 3 | +Navigation −Track | +Resistant (Poison) +Strongminded −Fearless (Skaven) −Strong-minded |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Sack, Small Animal Traps, Small but Vicious Dog  
   4e: Sling with Ammunition, Sack, Small but Vicious Dog
2. 5e: Pole for Dead Rats, Rat Poison  
   4e: Animal Traps, Pole for Dead Rats
3. 5e: Crossbow with 10 Bolts or Spear, Feinkopf Lantern, Leather Jack  
   4e: Davrich Lantern, Hand Weapon, Leather Jack
4. 5e: Assistant, Sack of Poisoned Bait Fel  
   4e: Assistant, Large and Vicious Dog, Sack of Poisoned Bait (10 doses of Heartkill)

</details>

## Riverwarden

- **Class:** Riverfolk
- **Species:** Dwarf, Halfling, Human (4e: Halfling, Human)
- **Income skill (5e):** Melee (Basic)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 | 1 | 1 |  | 3 |  |  | 4 |  | 1 |
| 5e | 1 | 2 | 1 |  | 3 |  |  | 4 |  | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | River Recruit — Silver 1 | River Recruit — Brass 4 | +Consume Alcohol +Cool +Sail −Sail (any) | same |
| 2 | Riverwarden — Silver 2 | Riverwarden — Silver 2 | +Climb +Intuition −Bribery −Lore (Riverways) | +Night Vision −Fisherman |
| 3 | Shipsword — Silver 4 | Shipsword — Silver 3 | +Entertain (Storytelling) +Evaluate +Lore (Riverways) −Climb −Cool −Intuition | +Nose for Trouble +Strong Legs −Pilot −Sea Legs |
| 4 | Shipsword Master — Gold 1 | Shipsword Master — Gold 1 | same | same |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Leather Jack, Uniform  
   4e: Hand Weapon (Sword), Leather Jack, Uniform
2. 5e: Lantern and Oil, Pistol with 10 Shots, Shield  
   4e: Lantern and Oil, Pistol with 10 shot, Shield
3. 5e: Grappling Hook, Helmet, Mail Shirt  
   4e: Grappling Hook, Helmet, Mail Shirt
4. 5e: Patrol Boats and Crew, Symbol of Rank  
   4e: Patrol Boats and Crew, Symbol of Rank

</details>

## Riverwoman

- **Class:** Riverfolk
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, Human)
- **Income skill (5e):** Endurance

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  |  | 1 | 3 | 1 | 1 |  |  | 4 |
| 5e |  |  | 3 | 1 |  | 1 | 1 | 4 |  | 2 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Greenfish — Brass 2 | Greenfish — Brass 2 | +Endurance +Lore (Local) +Stealth (Rural) −Entertain (Acting) | +Striding Gait (Wetland) −Strider (Marshes) |
| 2 | Riverwoman — Brass 3 | Riverwoman — Brass 3 | +Charm +Entertain (Storytelling) +Melee (Polearm) +Trade (Boatbuilder) −Gamble −Lore (Local) −Ranged (Entangling) −Ranged (Throwing) | +Tenacious −Waterman |
| 3 | Riverwise — Brass 5 | Riverwise — Brass 5 | +Haggle +Leadership −Charm −Melee (Polearm) | +Dealmaker +Sharp +Strong-minded −Savant (Riverways) −Tenacious −Very Strong |
| 4 | River Elder — Silver 2 | River Elder — Silver 2 | +Sail −Entertain (Storytelling) | +Savant (Riverways) +Waterman −Sharp −Strong-minded |

<details><summary>Trappings</summary>

1. 5e: Bucket, Fishing Rod and Bait, Leather Leggings  
   4e: Bucket, Fishing Rod and Bait, Leather Leggings
2. 5e: Eel Trap, Leather Jerkin, Net, Spear  
   4e: Eel Trap, Leather Jerkin, Net, Spear
3. 5e: Rowboat, Storm Lantern and Oil  
   4e: Row Boat, Storm Lantern and Oil
4. 5e: Barge or Hut  
   4e: Hut or Riverboat

</details>

## Roadwarden (4e: Road Warden)

- **Class:** Ranger
- **Species:** Halfling, Human
- **Income skill (5e):** Perception

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 | 1 |  | 1 | 1 |  |  | 4 |  | 3 |
| 5e | 1 | 2 |  | 1 | 1 | 4 |  |  |  | 3 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Toll Keeper — Brass 5 | Toll Keeper — Brass 5 | +Cool +Evaluate +Intimidate +Intuition −Bribery −Haggle | same |
| 2 | Road Warden — Silver 2 | Roadwarden — Silver 3 | +Charm +Charm Animal +Entertain (Storytelling) +Ranged (Blackpowder) −Endurance −Intimidate −Intuition −Outdoor Survival | +Rapid Reload −Crack the Whip |
| 3 | Road Sergeant — Silver 4 | Road Sergeant — Silver 5 | +Dodge +Endurance +Track −Athletics −Charm −Ranged (Blackpowder) | +Etiquette (Soldiers) −Etiquette (Solider) |
| 4 | Road Captain — Gold 1 | Road Captain — Gold 1 | +Lore (The Empire) −Lore (Empire) | +Roughrider −Public Speaker |

<details><summary>Trappings</summary>

1. 5e: Crossbow with 10 Bolts, Hand Weapon, Leather Jack  
   4e: Crossbow with 10 Bolts, Leather Jack
2. 5e: Light Warhorse, Mail Shirt, Pistol with 10 Shots, Rope  
   4e: Hand Weapon, Mail Shirt, Riding Horse with Saddle and Harness, Rope
3. 5e: Squad of Roadwardens, Symbol of Rank  
   4e: Squad of Road Wardens, Pistol with 10 Shots, Shield, Symbol of Rank
4. 5e: Quality Hat and Cloak, Unit of Roadwardens  
   4e: Light Warhorse, Pistol with 10 Shots, Quality Hat and Cloak, Unit of Road Wardens

</details>

## Sailor (4e: Seaman)

- **Class:** Riverfolk
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Halfling, High Elf, Human, Ogre)
- **Income skill (5e):** Sail

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  |  |  | 3 | 1 | 1 | 4 |  | 1 |
| 5e | 2 |  | 1 |  | 3 | 1 | 1 | 4 |  |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Landsman — Silver 1 | Landsman — Brass 4 | +Athletics +Cool +Endurance +Sail −Gossip −Sail (any) | +Sea Legs +Striding Gait (Coastal) −Fisherman −Strider (Coastal) |
| 2 | Seaman — Silver 3 | Sailor — Silver 2 | +Gossip +Play (Pennywhistle) −Athletics −Endurance | +Tenacious −Sea Legs |
| 3 | Boatswain — Silver 5 | Boatswain — Silver 3 | +Heal +Lore (Oceans) +Trade (Boatbuilder) −Cool −Perception −Trade (Carpenter) | +Craftsman (Boatbuilder) +Surgery −Tenacious −Very Strong |
| 4 | Ship’s Master — Gold 2 | Ship’s Master — Gold 2 | same | same |

<details><summary>Trappings</summary>

1. 5e: Brush, Bucket, Mop  
   4e: Bucket, Brush, Mop
2. 5e: Hand Weapon (Boat Hook), Leather Jerkin  
   4e: Hand Weapon (Boat Hook), Leather Jerkin
3. 5e: Trade Tools (Carpenter), Trade Tools (Physician)  
   4e: Trade Tools (Carpenter)
4. 5e: Sailing Ship and Crew, Sextant, Shipping Charts, Spyglass  
   4e: Shipping Charts, Sailing Ship and Crew, Sextant, Spyglass

</details>

## Scholar

- **Class:** Academic
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Wood Elf)
- **Income skill (5e):** Lore (Any One)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  | 1 | 2 |  | 4 | 1 | 1 | 3 |
| 5e |  |  |  | 4 | 3 |  | 1 | 1 | 1 | 2 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Student — Brass 3 | Student — Brass 3 | +Art (Writing) +Cool +Evaluate −Haggle | +Bookish +Etiquette (Scholars) −Carouser −Super Numerate |
| 2 | Scholar — Silver 2 | Scholar — Silver 1 | +Charm +Melee (Brawling) +Navigation −Art (Writing) −Perception −Trade (any) | +Linguistics +Numismatics +Super Numerate −Bookish −Etiquette (Scholar) −Suave |
| 3 | Fellow — Silver 5 | Fellow — Silver 5 | same | +Blather −Linguistics |
| 4 | Professor — Gold 1 | Professor — Gold 1 | +Language (any) or Lore (any) −Lore (any) | +Argumentative −Sharp |

<details><summary>Trappings</summary>

1. 5e: Alcohol, Book Scholars devote their lives to the pursuit of knowledge. Some are self-taught autodidacts, funding a lifetime of private study through whatever means they can. More commonly, they belong to great centres of learning such as the University of Altdorf or the Collegium Theologica in Middenheim. Many earn their keep as scribes, tutors, or copyists, while the most accomplished rise through the academic ranks from Student to Fellow and, ultimately, Professor. Scholars pursue every imaginable field of study. Some delight in broad learning, exploring history, philosophy, geography, mathematics, languages, and the natural sciences. Others dedicate themselves to a single discipline, dismissing all others as little more than distractions from true scholarship. Academic rivalries are fierce. Scholars think nothing of travelling the Old World to verify a theory, uncover a forgotten manuscript, or prove a colleague wrong. More than one heated debate has ended in bruised egos — or bruised faces. Playing a Scholar lets you bring learning and reason to your party. Whether deciphering ancient texts, recalling obscure lore, or devising unusual strategies, your knowledge is often the key to overcoming challenges that cannot be solved by force alone.  
   4e: Alcohol, Book, Opinions, Writing Kit
2. 5e: Access to a Library, Degree  
   4e: Access to a Library, Degree
3. 5e: Mortarboard, Robes  
   4e: Mortarboard, Robes
4. 5e: Study  
   4e: Study

</details>

## Scout

- **Class:** Peasant
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Wood Elf)
- **Income skill (5e):** Navigation

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  | 2 |  | 1 | 1 | 1 | 4 | 3 |  |  |
| 5e |  | 2 |  | 1 | 1 | 1 | 4 | 3 |  |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Guide — Brass 3 | Guide — Brass 3 | +Athletics +Navigation +Stealth (Rural) −Charm Animal | +Night Vision +Striding Gait (All) −Sharp −Strider (any) |
| 2 | Scout — Brass 5 | Scout — Brass 5 | +Charm Animal +Cool +Ranged (Bow, Crossbow, or Sling) +Secret Signs (Scout) +Stealth (Underground) +Swim −Athletics −Navigation −Ranged (Bow) −Ride (Horse) −Stealth (Rural) | +Acute Sense (Sight) +Flee! +Sixth Sense −Combat Aware −Night Vision −Nose for Trouble |
| 3 | Pathfinder — Silver 1 | Pathfinder — Silver 1 | +Lore (Geography) +Ride (Horse) −Secret Signs (Hunter) −Swim | +Combat Aware +Hardy +Shadow +Sharp −Acute Sense (Sight) −Sixth Sense −Strong Legs −Very Resilient |
| 4 | Explorer — Silver 5 | Explorer — Silver 5 | same | +Craftsman (Cartographer) +Read/Write +Well-prepared −Hardy −Savant (Local) −Tenacious |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Leather Jack, Sturdy Boots and Cloak, Rope  
   4e: Hand Weapon, Leather Jack, Sturdy Boots and Cloak, Rope
2. 5e: Bow with 10 Arrows or Crossbow with 10 Bolts or Sling with 10 Lead Bullets, Mail Shirt  
   4e: Bow and 10 Arrows, Mail Shirt
3. 5e: Map, Riding Horse, Saddlebags with 2 weeks’ Rations, Tent  
   4e: Map, Riding Horse with Saddle and Tack, Saddlebags with 2 weeks’ Rations, Tent
4. 5e: Selection of Maps, Trade Tools (Cartographer)  
   4e: Selection of Maps, Trade Tools (Cartographer)

</details>

## Servant

- **Class:** Courtier
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre)
- **Income skill (5e):** Endurance

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  | 1 | 1 | 2 | 1 |  | 3 |  | 4 |
| 5e |  |  | 1 | 1 | 3 | 1 |  | 4 |  | 2 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Menial — Silver 1 | Menial — Brass 3 | +Animal Care +Consume Alcohol +Gossip +Haggle −Drive −Perception | +Etiquette (Servants) +Tenacious −Strong-minded −Sturdy |
| 2 | Servant — Silver 3 | Servant — Brass 4 | +Animal Training (Dog or Horse) +Charm +Charm Animal +Drive +Lore (Local) −Animal Care −Consume Alcohol −Evaluate −Gossip −Haggle | +Etiquette (any) +Gregarious +Wellprepared −Etiquette (Servants) −Tenacious −Well-prepared |
| 3 | Attendant — Silver 5 | Attendant — Silver 3 | +Evaluate +Lore (Politics) −Charm −Lore (Local) | +Read/Write +Resistant (Poison) −Embezzle −Resistance (Poison) |
| 4 | Steward — Gold 1 | Steward — Gold 1 | same | +Commanding Presence +Embezzle +Schemer −Etiquette (any) −Numismatics −Read/Write |

<details><summary>Trappings</summary>

1. 5e: Floor Brush  
   4e: Floor Brush
2. 5e: Livery  
   4e: Livery
3. 5e: Lamp Oil, Quality Livery, Storm Lantern, Tinderbox  
   4e: Quality Livery, Storm Lantern, Tinderbox, Lamp Oil
4. 5e: Hand Weapon, Fine Clothes, Servant  
   4e: Hand Weapon, Fine Clothes, Servant

</details>

## Slayer

- **Class:** Warrior
- **Species:** Dwarf
- **Income skill (5e):** Melee (Basic)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  | 1 | 2 | 4 | 3 |  |  | 1 |  |
| 5e | 1 |  | 1 | 2 | 4 | 3 |  |  | 1 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Troll Slayer — Brass 2 | Troll Slayer — Brass 2 | +Athletics +Language (Battle) +Play (Horn) −Gamble | same |
| 2 | Giant Slayer — Brass 2 | Giant Slayer — Brass 2 | +Climb +Entertain (Storytelling) −Evaluate −Language (Battle) | same |
| 3 | Dragon Slayer — Brass 2 | Dragon Slayer — Brass 2 | +Evaluate −Entertain (Storytelling) | same |
| 4 | Daemon Slayer — Brass 2 | Daemon Slayer — Brass 2 | +Lore (Daemons) +Navigation −Intuition −Lore (Chaos) | same |

<details><summary>Trappings</summary>

1. 5e: Flask of Spirits, Hand Weapon (Dwarf Axe), Tattoos  
   4e: Axe, Flask of Spirits, Shame, Tattoos
2. 5e: Great Weapon (Dwarf Greataxe)  
   4e: Great Axe, Jewellery, Troll’s Head
3. 5e: 2 Dwarf Throwing Axes  
   4e: Giant’s Head, Throwing Axes
4. 5e: Rune Axe  
   4e: Dragon’s Head

</details>

## Smuggler

- **Class:** Riverfolk
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Stealth (Rural or Urban)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  |  | 2 | 1 | 1 | 3 | 1 | 4 |
| 5e |  |  | 1 |  | 1 | 1 |  | 4 | 2 | 3 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | River Runner — Brass 2 | River Runner — Brass 4 | +Endurance +Lore (Local) +Perception +Sail −Bribery −Sail (any) | +Striding Gait (Wetland) −Strider (Marshes) |
| 2 | Smuggler — Brass 3 | Smuggler — Silver 1 | +Bribery +Evaluate −Lore (Local) −Perception | +Briber +Etiquette (Criminals) +Night Vision −Dealmaker −Etiquette (Criminal) −Very Strong |
| 3 | Master Smuggler — Brass 5 | Master Smuggler — Silver 5 | +Leadership +Ranged (Blackpowder) −Evaluate −Intimidate | +Dealmaker +Fast Shot +Pilot +Seasoned Traveller −Briber −Etiquette (Guilder - River Pilot) −Fearless (Riverwardens) −Strong Swimmer |
| 4 | Smuggler King — Silver 2 | Smuggler King — Gold 3 | +Intimidate −Leadership | +Fearless (Riverwardens) +Wealthy −Sea Legs −Strider (Coastal) |

<details><summary>Trappings</summary>

1. 5e: Large Sack, Mask or Scarves, Storm Lantern and Oil, Tinderbox  
   4e: Large Sack, Mask or Scarves, Tinderbox, Storm Lantern and Oil
2. 5e: 2 Barrels, Hand Weapon, Rowboat  
   4e: 2 Barrels, Hand Weapon, Leather Jack, Row Boat
3. 5e: Pistol with 10 Shots, River Runners, Speedy Barge  
   4e: River Runner, Speedy Riverboat
4. 5e: Disguise Kit, Small Fleet of Barges  
   4e: Disguise Kit, Small Fleet of Riverboats

</details>

## Soldier

- **Class:** Warrior
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre, Wood Elf)
- **Income skill (5e):** Melee (Any One)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 2 |  | 1 | 3 |  |  |  | 1 | 4 |
| 5e | 1 | 1 | 1 | 3 | 4 |  |  |  | 2 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Recruit — Silver 1 | Recruit — Brass 5 | +Gamble +Melee (any) +Ranged (any) −Play (Drum or Fife) | +Drilled +Etiquette (Soldiers) −Diceman −Marksman |
| 2 | Soldier — Silver 3 | Soldier — Silver 2 | +Entertain (Storytelling) +Intimidate +Perception +Play (Drum, Flute, Horn, or Trumpet) −Gamble −Gossip −Melee (any) −Ranged (any) | +Dicer +Marksman −Drilled −Etiquette (Solider) |
| 3 | Sergeant — Silver 5 | Sergeant — Silver 3 | +Lore (Warfare) +Navigation −Intuition −Perception | same |
| 4 | Officer — Gold 1 | Officer — Gold 1 | +Lore (Heraldry) +Ride (Horse) −Lore (Warfare) −Navigation | +Read/Write −Seasoned Traveller |

<details><summary>Trappings</summary>

1. 5e: Leather Breastplate, Uniform, Weapon (Any One)  
   4e: Dagger, Leather Breastplate, Uniform
2. 5e: Breastplate, Helmet, Weapon (Any)  
   4e: Breastplate, Helmet, Weapon (Any)
3. 5e: Symbol of Rank, Regiment of Recruits  
   4e: Symbol of Rank, Unit of Troops
4. 5e: Letter of Commission, Light Warhorse, Map, Orders, Quality Uniform, Symbol of Rank, Regiment of Soldiers  
   4e: Letter of Commission, Light Warhorse with Saddle and Tack, Map, Orders, Unit of Soldiers, Quality Uniform, Symbol of Rank

</details>

## Spy

- **Class:** Courtier
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human, Wood Elf)
- **Income skill (5e):** Gossip

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  |  |  | 3 | 1 |  | 4 | 1 | 1 |
| 5e |  |  |  |  | 1 | 1 | 2 | 4 | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Informer — Brass 3 | Informer — Brass 4 | +Consume Alcohol +Intuition +Melee (Basic) −Haggle | +Beneath Notice +Etiquette (any) +Read/Write −Blather −Carouser −Shadow |
| 2 | Spy — Silver 3 | Spy — Silver 3 | +Language (any) +Pick Lock −Intuition −Melee (Basic) | +Attractive +Mimic +Shadow −Etiquette (any) −Lip Reading −Read/Write |
| 3 | Agent — Gold 1 | Agent — Gold 1 | +Research −Language (any) | +Carouser +Lip Reading −Attractive −Mimic |
| 4 | Spymaster — Gold 4 | Spymaster — Gold 3 | +Haggle −Research | same |

<details><summary>Trappings</summary>

1. 5e: Charcoal Stick, Sling Bag containing 2 different sets of Clothing and Hooded Cloak  
   4e: Charcoal stick, Sling Bag containing 2 different sets of clothing and Hooded Cloak
2. 5e: Disguise Kit, Informer, Telescope  
   4e: Informer, Hand Weapon, Disguise Kit, Ring of Informers, Telescope
3. 5e: Book (Cryptography), Loft of Homing Pigeons, Ring of Spies and Informers, Writing Kit  
   4e: Book (Cryptography), Ring of Spies and Informers, Loft of Homing Pigeons, Quill and Ink
4. 5e: Office and Staff  
   4e: Office and Staff, Large Spy Ring of Agents, Spies, and Informers

</details>

## Stevedore

- **Class:** Riverfolk
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Halfling, High Elf, Human, Ogre)
- **Income skill (5e):** Endurance

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  | 2 | 1 | 1 |  |  | 4 | 3 |  |
| 5e | 2 |  | 1 | 1 |  | 1 |  |  | 4 | 3 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Dockhand — Brass 3 | Dockhand — Brass 3 | +Intimidate +Melee (Brawling) | +Tenacious −Very Strong |
| 2 | Stevedore — Silver 1 | Stevedore — Brass 5 | +Cool +Haggle +Lore (Local) +Secret Signs (Guilder) −Entertain (Storytelling) −Intimidate −Perception −Stealth (Urban) | +Etiquette (Criminals) +Etiquette (Guilders) +Very Strong −Etiquette (Guilder - Stevedore) −Strong Legs −Tenacious |
| 3 | Foreman — Silver 5 | Foreman — Silver 3 | +Charm −Cool | +Menacing −Etiquette (Criminal) |
| 4 | Dock Master — Silver 5 | Dock Master — Silver 5 | +Intuition −Charm | +Fearless (Merchants) −Menacing |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon (Boat Hook), Leather Gloves  
   4e: Hand Weapon (Boat Hook), Leather Gloves
2. 5e: Guild Licence, Leather Jerkin, Pipe and Tobacco, Porter Cap  
   4e: Guild Licence, Leather Jerkin, Pipe and Tobacco, Porter Cap
3. 5e: Gang of Stevedores, Whistle  
   4e: Gang of Stevedores, Whistle
4. 5e: Office and Staff, Writing Kit  
   4e: Office and Staff, Writing Kit

</details>

## Thief

- **Class:** Rogue
- **Species:** Dwarf, Halfling, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, Human)
- **Income skill (5e):** Stealth (Urban)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  | 3 |  | 1 | 1 | 2 |  | 1 | 4 |
| 5e |  |  | 1 |  | 2 | 1 | 1 | 3 |  | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Prowler — Brass 1 | Prowler — Brass 3 | +Intimidate +Melee (Basic) +Pick Lock +Sleight of Hand −Endurance −Intuition | +Fast Hands −Strike to Stun |
| 2 | Thief — Brass 3 | Thief — Brass 4 | +Language (Thieves Tongue) +Secret Signs (Thief ) +Set Trap −Pick Lock −Secret Signs (Thief) −Sleight of Hand | +Etiquette (Criminals) +Night Vision −Etiquette (Criminal) −Fast Hands |
| 3 | Master Thief — Brass 5 | Master Thief — Brass 5 | +Entertain (Acting) +Intuition −Gamble −Intimidate | +Lip Reading +Secret Identity −Night Vision −Nimble-fingered |
| 4 | Cat Burglar — Silver 3 | Cat Burglar — Silver 3 | +Endurance +Gamble −Charm −Set Trap | +Dual Wielder −Wealthy |

<details><summary>Trappings</summary>

1. 5e: Crowbar, Leather Jerkin, Sack  
   4e: Crowbar, Leather Jerkin, Sack
2. 5e: Fence Contact, Rope, Trade Tools (Thief )  
   4e: Trade Tools (Thief), Rope
3. 5e: Crossbow Pistol with 10 Bolts, Grappling Hook, Several Fence Contacts  
   4e: Crossbow Pistol with 10 Bolts
4. 5e: Calling Card, Dark Clothing  
   4e: Dark Clothing, Grappling Hook, Mask or Scarves

</details>

## Townsman

- **Class:** Burgher
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Haggle

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e |  |  |  |  | 2 | 1 | 3 | 1 | 4 | 1 |
| 5e |  |  | 1 |  | 2 |  | 4 | 1 | 3 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Clerk — Silver 1 | Clerk — Brass 5 | +Evaluate +Intuition +Lore (Local) +Research +Secret Signs (Guilder) −Climb −Dodge −Drive | +Dealmaker +Embezzle +Read/Write +Speedreader −Alley Cat −Beneath Notice −Etiquette (Servants) −Sturdy |
| 2 | Townsman — Silver 2 | Townsman — Silver 1 | +Cool +Entertain (any) +Language (any) +Trade (any) −Evaluate −Intuition −Lore (Local) −Play (any) | +Blather +Savvy −Dealmaker −Embezzle |
| 3 | Town Councillor — Silver 5 | Proprietor — Silver 3 | +Intimidate +Leadership +Ranged (Blackpowder) −Cool −Lore (Law) −Research | +Etiquette (any) +Lip Reading +Nose for Trouble +Suave −Briber −Public Speaker −Read/Write −Supportive |
| 4 | Burgomeister — Gold 1 | Burgomeister — Gold 3 | +Entertain (Speeches) −Intimidate | +Briber +Public Speaker +Wealthy −Commanding Presence −Master Orator −Suave |

<details><summary>Trappings</summary>

1. 5e: Lodgings  
   4e: Lodgings, Sturdy Boots
2. 5e: Modest Shop  
   4e: Modest Townhouse, Servant, Quill and Ink
3. 5e: Blunderbuss with 10 Shots, Inn or Townhouse, Staff  
   4e: Coach and Driver, Townhouse
4. 5e: Chains of Office, Coach and Footman, Large Townhouse with Gardens and Servants, Quality Clothing  
   4e: Chains of Office, Coach and Footman, Quality Clothing, Large Townhouse with Gardens and Servants

</details>

## Villager

- **Class:** Peasant
- **Species:** Dwarf, Halfling, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Endurance

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  | 1 | 1 |  | 1 |  | 4 |  | 3 |
| 5e |  |  | 1 | 1 |  | 1 | 2 | 4 |  | 3 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Peasant — Brass 2 | Peasant — Brass 2 | +Charm Animal +Dodge | +Hardy +Tenacious −Rover −Strong-minded |
| 2 | Villager — Brass 2 | Villager — Brass 3 | +Animal Training (Any One Domesticated Animal) +Melee (Basic, Polearm, or Two-handed) +Ranged (Entangling or Sling) −Dodge −Haggle −Melee (Basic) | +Craftsman (as Trade) +Striding Gait (any) +Sturdy −Hardy −Tenacious −Very Strong |
| 3 | Councillor — Brass 4 | Councillor — Brass 5 | same | +Strong-minded +Supportive −Craftsman (any) −Dealmaker |
| 4 | Village Elder — Silver 2 | Village Elder — Silver 2 | +Lore (Folklore) −Lore (History) | +Master Tradesman (as Trade) −Master Tradesman (any) |

<details><summary>Trappings</summary>

1. 5e: None  
   4e: None
2. 5e: Hand Weapon (Axe), Lasso or Sling with 10 Stone Bullets, Leather Jerkin, Trade Tools (as Trade)  
   4e: Leather Jerkin, Hand Weapon (Axe), Trade Tools (as Trade)
3. 5e: Cottage, Mule and Cart, Workshop (as Trade)  
   4e: Mule and Cart, Village Home and Workshop
4. 5e: The Respect of the Village  
   4e: The Respect of the Village

</details>

## Warden

- **Class:** Courtier
- **Species:** Dwarf, Halfling, High Elf, Human, Wood Elf (4e: Dwarf, Gnome, Halfling, High Elf, Human)
- **Income skill (5e):** Evaluate

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 2 |  | 1 | 1 |  |  |  | 4 | 1 | 3 |
| 5e | 2 |  |  | 1 | 1 |  |  | 1 | 4 | 3 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Custodian — Silver 1 | Custodian — Brass 4 | +Animal Care +Cool +Evaluate | +Animal Affinity +Etiquette (Servants) −Menacing −Strike to Stun |
| 2 | Warden — Silver 3 | Warden — Silver 3 | +Intimidate +Stealth (Rural) −Animal Care −Swim | +Menacing +Striding Gait (any) +Strike to Stun −Animal Affinity −Etiquette (Servants) −Strider (any) |
| 3 | Seneschal — Gold 1 | Seneschal — Gold 1 | same | +Etiquette (any) +Public Speaker −Numismatics −Supportive |
| 4 | Governor — Gold 3 | Governor — Gold 4 | +Language (Classical) +Lore (Politics) −Evaluate −Language (any) | +Carouser +Savant (Local) +Wealthy −Etiquette (any) −Savant (any) −Suave |

<details><summary>Trappings</summary>

1. 5e: Keys, Lamp Oil, Lantern, Livery  
   4e: Keys, Lantern, Lamp Oil, Livery
2. 5e: Bow with 10 Arrows or Hand Weapon, Leather Jack, Riding Horse  
   4e: Hand Weapon or Bow with 10 arrows, Riding Horse with Saddle and Harness, Leather Jack
3. 5e: Breastplate, Rod of Office, Staff of Custodians  
   4e: Breastplate, Ceremonial Staff of Office, Staff of Wardens and Custodians
4. 5e: Aide, Governor’s Residence, Servant  
   4e: Aide, Governor’s Residence, Servant

</details>

## Warrior Priest

- **Class:** Warrior
- **Species:** Human (4e: Gnome, Human)
- **Income skill (5e):** Leadership

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  | 2 | 1 | 3 |  |  |  | 1 | 4 |
| 5e | 1 |  | 2 | 3 | 4 |  |  |  | 1 | 1 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Novitiate — Brass 2 | Neophyte — Brass 2 | +Athletics +Language (Classical) | +Holy Visions −Strong-minded |
| 2 | Warrior Priest — Silver 2 | Warrior Priest — Silver 3 | same | +Sturdy −Seasoned Traveller |
| 3 | Priest Sergeant — Silver 3 | Priest Sergeant — Silver 5 | same | +Seasoned Traveller −Holy Visions |
| 4 | Priest Captain — Silver 4 | Priest Captain — Gold 1 | +Drive −Consume Alcohol | same |

<details><summary>Trappings</summary>

1. 5e: Book (Religion), Melee Weapon (Any), Leather Jerkin, Religious Symbol, Robes  
   4e: Book (Religion), Leather Jerkin, Religious Symbol, Robes, Weapon (Any Melee)
2. 5e: Breastplate, Weapon (Any)  
   4e: Breastplate, Weapon (Any)
3. 5e: Light Warhorse  
   4e: Light Warhorse with Saddle and Tack
4. 5e: Religious Relic  
   4e: Religious Relic

</details>

## Watchman

- **Class:** Burgher
- **Species:** Dwarf, Halfling, High Elf, Human (4e: Dwarf, Gnome, Halfling, High Elf, Human, Ogre)
- **Income skill (5e):** Perception

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  | 1 |  | 3 |  |  | 4 | 2 | 1 |
| 5e | 1 |  | 1 |  | 1 | 2 |  |  | 3 | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Watch Recruit — Brass 3 | Watch Recruit — Brass 3 | +Cool +Gossip +Intimidate +Melee (Basic) −Climb −Melee (any) | +Criminal +Sprinter −Hardy −Tenacious |
| 2 | Watchman — Silver 1 | Watchman — Silver 1 | +Climb +Melee (Polearm) +Pick Lock −Cool −Gossip −Intimidate | +Enclosed Fighter +Menacing −Criminal −Sprinter |
| 3 | Watch Sergeant — Silver 3 | Watch Sergeant — Silver 3 | same | +Etiquette (Soldiers) −Etiquette (Solider) |
| 4 | Watch Captain — Gold 1 | Watch Captain — Gold 1 | same | same |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Leather Jack, Uniform  
   4e: Hand Weapon, Leather Jack, Uniform
2. 5e: Copper Badge, Lamp Oil, Lantern and Pole  
   4e: Lantern and Pole, Lamp Oil, Copper Badge
3. 5e: Breastplate, Open Helm, Symbol of Rank  
   4e: Breastplate, Helm, Symbol of Rank
4. 5e: Quality Hand Weapon, Quality Hat, Quality Symbol of Rank, Riding Horse  
   4e: Riding Horse with Saddle and Tack, Quality Hat, Quality Hand weapon, Quality Symbol of Rank

</details>

## Witch

- **Class:** Rogue
- **Species:** Human
- **Income skill (5e):** Language (Magick)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  |  | 1 | 2 |  |  | 4 | 1 | 3 |
| 5e | 3 |  |  | 4 | 1 |  |  | 1 | 1 | 2 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Hexer — Brass 1 | Dabbler — Brass 3 | +Bribery +Channelling (Magick) +Charm +Heal +Perception +Research +Stealth (Rural or Urban) −Channelling (Untrained) −Endurance −Intimidate −Sleight of Hand −Stealth (Rural) | +Read/Write +Second Sight −Criminal −Menacing |
| 2 | Witch — Brass 2 | Witch — Silver 2 | +Channelling (Dhar) +Endurance +Evaluate +Intimidate +Melee (Basic or Polearm) +Secret Signs (any) −Charm Animal −Dodge −Intuition −Melee (Polearm) −Perception −Trade (Herbalist) | +Criminal −Second Sight |
| 3 | Wyrd — Brass 3 | Enchanter — Silver 5 | +Leadership +Lore (Magic) +Lore (any) +Ride (Horse) −Bribery −Charm −Haggle −Lore (Dark Magic) | +Aethyric Attunement +Menacing −Animal Affinity −Fast Hands −Frightening |
| 4 | Warlock — Brass 5 | Warlock — Gold 2 | +Dodge +Entertain (Speeches) −Lore (Daemonology) −Lore (Magic) | +Briber +Frightening +Iron Will +Kingpin −Aethyric Attunement −Luck −Strong-minded −Very Resilient |

<details><summary>Trappings</summary>

1. 5e: Notes Stuffed in Locked Drawer, Writing Kit  
   4e: Candles, Chalk, Doll, Pins
2. 5e: Grimoire, Hand Weapon or Quarterstaff  
   4e: Quarterstaff, Sack, Selection of Herbs, Trade Tools (Herbalist)
3. 5e: Assistant, Enchanted Staff, Tomes of Forbidden Knowledge  
   4e: Backpack, Cloak with Several Pockets, Lucky Charm
4. 5e: Minions, Library (Magic), Remote Lair  
   4e: Robes, Skull

</details>

## Witch Hunter

- **Class:** Ranger
- **Species:** Human
- **Income skill (5e):** Intimidate

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 2 |  | 1 |  |  |  | 4 | 1 | 3 |
| 5e | 1 | 2 |  | 3 | 1 |  |  | 4 | 1 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Interrogator — Silver 1 | Interrogator — Silver 1 | +Athletics +Cool +Dodge +Gossip +Lore (Witches) −Charm −Consume Alcohol −Lore (Torture) | +Strike to Stun −Resolute |
| 2 | Witch Hunter — Silver 3 | Witch Hunter — Silver 3 | +Entertain (Speeches) +Melee (Basic or Fencing) +Ranged (Blackpowder or Crossbow) +Secret Signs (any) +Stealth (Urban) −Cool −Gossip −Lore (Witches) −Melee (Basic) −Ranged (any) | +Combat Reflexes +Nose for Trouble −Marksman −Seasoned Traveller |
| 3 | Inquisitor — Silver 5 | Witch Hunter Captain — Gold 1 | +Charm −Lore (Local) | +Seasoned Traveller −Nose for Trouble |
| 4 | Witchfinder General — Gold 1 | Witchfinder General — Gold 2 | same | +Magic Resistance −Magical Sense |

<details><summary>Trappings</summary>

1. 5e: Hand Weapon, Instruments of Torture  
   4e: Hand Weapon, Instruments of Torture
2. 5e: Pistol with 10 Shots, Hat, Leather Jack, Riding Horse, Rapier or Silvered Sword, Rope  
   4e: Crossbow Pistol or Pistol, Hat (Henin), Leather Jack, Riding Horse with Saddle and Tack, Rope, Silvered Sword
3. 5e: Quality Clothing, Subordinate Interrogators  
   4e: Quality Clothing, Subordinate Interrogators
4. 5e: Quality Courtly Garb, Subordinate Witch Hunters  
   4e: est Quality Courtly Garb, Subordinate Witch Hunters

</details>

## Wizard

- **Class:** Academic
- **Species:** High Elf, Human, Wood Elf (4e: Gnome, High Elf, Human, Wood Elf)
- **Income skill (5e):** Language (Magick)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 |  |  |  | 3 | 2 |  | 1 | 1 | 4 |
| 5e | 2 |  |  |  | 1 | 3 | 4 | 1 | 1 |  |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Wizard’s Apprentice — Brass 3 | Wizard’s Apprentice — Brass 3 | +Channelling (Any Colour) +Cool +Gossip +Language (Classical) +Lore (any) +Research −Channelling (any) −Dodge −Intuition −Melee (Basic) | +Read/ Write −Read/Write |
| 2 | Wizard — Silver 3 | Wizard — Silver 3 | +Endurance +Evaluate +Intuition −Cool −Gossip −Language (any) | +Arcane Magic (Any Colour Lore) +Etiquette (Scholars) +Seasoned Traveller −Arcane Magic (any) −Fast Hands |
| 3 | Master Wizard — Gold 1 | Master Wizard — Gold 1 | +Drive or Ride (any) +Leadership −Evaluate −Ride (Horse) | +Craftsman (any) −Dual Wielder |
| 4 | Wizard Lord — Gold 2 | Wizard Lord — Gold 2 | same | +Detect Artefact −Combat Aware |

<details><summary>Trappings</summary>

1. 5e: Grimoire, Quarterstaff  
   4e: Grimoire, Quarterstaff
2. 5e: Enchanted Staff, Magic Licence, Robes  
   4e: Magical License
3. 5e: Apprentice, Light Warhorse, Magical Item  
   4e: Apprentice, Light Warhorse, Magical Item
4. 5e: Library (Magic), Workshop (Magic)  
   4e: Apprentice, Library (Magic), Workshop (Magic)

</details>

## Wrecker

- **Class:** Riverfolk
- **Species:** Dwarf, Halfling, Human, Wood Elf (4e: Dwarf, Human, Wood Elf)
- **Income skill (5e):** Melee (Basic)

| Advance scheme | WS | BS | S | T | I | Ag | Dex | Int | WP | Fel |
|---|---|---|---|---|---|---|---|---|---|---|
| 4e | 1 | 3 | 1 |  | 1 |  |  |  | 2 | 4 |
| 5e | 1 | 2 | 1 |  |  | 1 |  |  | 3 | 4 |

| Lvl | 4e name — status | 5e name — status | Skills | Talents |
|---|---|---|---|---|
| 1 | Cargo Scavenger — Brass 2 | Cargo Scavenger — Brass 2 | +Pick Lock +Stealth (Rural) | +Flee! +Rover −Fisherman −Strong Back |
| 2 | Wrecker — Brass 3 | Wrecker — Brass 3 | same | +Etiquette (Criminals) +Night Vision −Flee! −Rover |
| 3 | River Pirate — Brass 5 | River Pirate — Brass 5 | +Melee (Brawling) +Ranged (Crossbow or Throwing) −Ranged (Crossbow) −Stealth (Rural) | +In-fighter +Strong Legs −Dirty Fighting −Etiquette (Criminal) |
| 4 | Wrecker Captain — Silver 2 | Wrecker Captain — Silver 5 | same | +Frightening −In-fighter |

<details><summary>Trappings</summary>

1. 5e: Crowbar, Large Sack, Leather Gloves  
   4e: Crowbar, Large Sack, Leather Gloves
2. 5e: Hand Weapon (Boat Hook), Leather Jack, Storm Lantern and Oil  
   4e: Hand Weapon (Boat Hook), Leather Jack, Storm Lantern and Oil
3. 5e: Crossbow with 10 Bolts or Javelin, Grappling Hook and Rope  
   4e: Crossbow with 10 Bolts, Grappling Hook and Rope, Riverboat
4. 5e: Barge and Wrecker Crew, Keg of Ale, Manacles S k i l l s a n d ta l e n t s  
   4e: Fleet of Riverboats and Wrecker Crew, Keg of Ale, Manacles

</details>
