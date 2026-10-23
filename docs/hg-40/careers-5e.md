# HG-40: 5e career mappings

Proposed trappings per level of the 64 public 5e careers, generated from `db/data/hg-40/career-trappings-resolved.json`. Plain names are existing 5e trappings, **bold** ones are new (see [new-trappings.md](new-trappings.md)), *italic* ones still need a decision ([README.md](README.md)). " / " separates the options of a choice.

Tick a career when its mapping is reviewed. Corrections go into the alias table (`db/data/hg-40/alias.py`), then this file is regenerated.

## Adviser

- [x] reviewed

| Level        | Book text                                                       | Proposed                                                                                       |
| ------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1 Aide       | Writing Kit                                                     | Writing Kit                                                                                    |
| 2 Adviser    | Livery                                                          | Courtly Garb (Servant) ("Livery")                                                              |
| 3 Counsellor | Aide, Quality Clothing                                          | **Retainer** (new) ("Aide"); **Clothing (Fine)** (new)                                         |
| 4 Chancellor | Quality Courtly Garb, Riding Horse, Staff of Advisers and Aides | **Courtly Garb (Fine)** (new); Riding Horse; **Command** (new) ("Staff of Advisers and Aides") |

## Agitator

- [x] reviewed

| Level           | Book text                                              | Proposed                                                                                                           |
| --------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| 1 Pamphleteer   | Hammer and Nails, Pile of Leaflets, Writing Kit        | Hammer, 1d20 × Nail; 1d20 × Leaflet; Writing Kit                                                                   |
| 2 Agitator      | Leather Jack, Sturdy Crate                             | Leather Jack; **Sturdy Crate** (new)                                                                               |
| 3 Rabble Rouser | Hand Weapon, Pamphleteer                               | Hand Weapon; **Retainer** (new) ("Pamphleteer")                                              |
| 4 Demagogue     | Impressive Hat, 3 Pamphleteers, Patron, Printing Press | Hat ("Impressive"); 3 × **Retainer** (new) ("Pamphleteer"); **Contact** (new) ("Patron"); **Printing Press** (new) |

## Apothecary

- [x] reviewed

| Level                     | Book text                                            | Proposed                                                                                |
| ------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1 Apothecary’s Apprentice | Book (Blank), Leather Jerkin, Pestle and Mortar      | Book - Blank; Leather Jerkin; Pestle and Mortar                                         |
| 2 Apothecary              | Guild Licence, Trade Tools (Apothecary)              | Guild Licence ("Apothecary"); **Trade Tools** (new) ("Apothecary")                      |
| 3 Master Apothecary       | Apprentice, Book (Apothecary), Workshop (Apothecary) | **Retainer** (new) ("Apprentice"); Book - Apothecary; **Workshop** (new) ("Apothecary") |
| 4 Apothecary General      | Commission Papers, Large Workshop (Apothecary)       | Legal Document ("Commission Papers"); **Large Workshop** (new) ("Apothecary")           |

## Artisan

- [x] reviewed

| Level                | Book text                             | Proposed                                                            |
| -------------------- | ------------------------------------- | ------------------------------------------------------------------- |
| 1 Apprentice Artisan | Chalk, Leather Jerkin, 1d10 Rags      | Chalk; Leather Jerkin; 1d10 × Rags                                  |
| 2 Artisan            | Guild Licence, Trade Tools (as Trade) | Guild Licence; **Trade Tools** (new) ("own trade")                  |
| 3 Master Artisan     | Apprentice, Workshop (as Trade)       | **Retainer** (new) ("Apprentice"); **Workshop** (new) ("own trade") |
| 4 Guildmaster        | Guild, Quality Clothing               | **Command** (new) ("Guild"); **Clothing (Fine)** (new)              |

## Artist

- [x] reviewed

| Level               | Book text                                             | Proposed                                                                                                        |
| ------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1 Apprentice Artist | Brush or Chisel or Writing Kit                        | Paint Brush / Chisel / Writing Kit                                                                              |
| 2 Artist            | Sling Bag containing Trade Tools (Artist)             | Sling Bag, **Trade Tools** (new) ("Artist")                                                                     |
| 3 Master Artist     | Apprentice, Patron, Workshop (Artist)                 | **Retainer** (new) ("Apprentice"); **Contact** (new) ("Patron"); **Workshop** (new) ("Artist")                  |
| 4 Maestro           | 3 Apprentices, Large Workshop (Artist), Library (Art) | 3 × **Retainer** (new) ("Apprentice"); **Large Workshop** (new) ("Artist"); **Holding** (new) ("Library - Art") |

## Bailiff

- [x] reviewed

| Level           | Book text                                    | Proposed                                                                                         |
| --------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1 Tax Collector | Hand Weapon, Small Lock Box                  | Hand Weapon; **Lock Box** (new)                                            |
| 2 Bailiff       | Leather Jack, 3 Tax Collectors               | Leather Jack; 3 × **Retainer** (new) ("Tax Collector")                                           |
| 3 Reeve         | Bailiff, Breastplate, Riding Horse           | **Retainer** (new) ("Bailiff"); Breastplate; Riding Horse                                        |
| 4 Magistrate    | Library (Law), Quality Robes, Seal of Office | **Holding** (new) ("Library - Law"); **Robes (Fine)** (new); Stamp - Engraved ("Seal of Office") |

## Beggar

- [x] reviewed

| Level           | Book text                                   | Proposed                                                                                 |
| --------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 1 Pauper        | Cup, Poor Quality Blanket                   | Cup; **Blanket (Ugly)** (new)                                                            |
| 2 Beggar        | Bowl, Crutch                                | Bowl; Crutch                                                                             |
| 3 Master Beggar | Disguise Kit, Hiding Place, Pauper Follower | Disguise Kit; **Holding** (new) ("Hiding Place"); **Retainer** (new) ("Pauper Follower") |
| 4 Beggar King   | Lair, Large Group of Beggar Followers       | **Holding** (new) ("Lair"); **Command** (new) ("Large Group of Beggar Followers")        |

## Boatman

- [x] reviewed

| Level          | Book text                                                  | Proposed                                                                           |
| -------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1 Boathand     | Hand Weapon (Boat Hook), Leather Jack, Pole                | Hand Weapon ("Boat Hook"); Leather Jack; Pole (3 yards)                            |
| 2 Boatman      | Rope, Rowboat                                              | Rope - 10 yards; Row Boat                                                          |
| 3 Bargeswain   | Backpack, Trade Tools (Carpenter), Trade Tools (Physician) | Backpack; **Trade Tools** (new) ("Carpenter"); **Trade Tools** (new) ("Physician") |
| 4 Barge Master | Barge and Crew, Hat                                        | River Barge ("with Crew"); Hat                                                     |

## Bounty Hunter

- [x] reviewed

| Level                   | Book text                                                                                   | Proposed                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1 Thief-taker           | Hand Weapon, Leather Jerkin, Rope                                                           | Hand Weapon; Leather Jerkin; Rope - 10 yards                                                            |
| 2 Bounty Hunter         | 2 Bolas or Crossbow with 10 Bolts or Lasso, Leather Skullcap, Manacles, Net, Warrant Papers | 2 × Bolas / Crossbow, 10 × Bolt / Lasso; Leather Coif; Manacles; Net; Legal Document ("Warrant Papers") |
| 3 Master Bounty Hunter  | Mail Shirt, Riding Horse                                                                    | Mail Shirt; Riding Horse                                                                                |
| 4 Bounty Hunter General | Draught Horse and Cart, 4 Pairs of Manacles                                                 | Draught Horse, Cart; 4 × Manacles                                                                       |

## Cavalryman

- [x] reviewed

| Level              | Book text                                                                | Proposed                                                                       |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| 1 Horseman         | Bow with 10 Arrows or Pistol with 10 Shots, Leather Jack, Light Warhorse | Bow, 10 × Arrow / Pistol, 10 × Bullet and Powder; Leather Jack; Light Warhorse |
| 2 Cavalryman       | Breastplate, Open Helm                                                   | Breastplate; Open Helm                                                         |
| 3 Cavalry Sergeant | Sash                                                                     | **Symbol of Rank** (new) ("Sash")                                              |
| 4 Cavalry Officer  | Deck of Cards, Quality Clothing                                          | Deck of Cards; **Clothing (Fine)** (new)                                       |

## Charlatan

- [x] reviewed

| Level        | Book text                                                                            | Proposed                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 1 Swindler   | Deck of Cards, Dice, 2 Sets of Clothing                                              | Deck of Cards; Dice; 2 × Clothing                                                                                          |
| 2 Charlatan  | Forged Document, Colourful Mixtures, Trinkets and Charms, 2 Sets of Quality Clothing | Legal Document ("Forged Document"); **Coloured Powders** (new); 1d6 × **Lucky Charm** (new); 2 × **Clothing (Fine)** (new) |
| 3 Con Artist | Disguise Kit, Multiple Forged Documents                                              | Disguise Kit; 1d6 × Legal Document ("Forged Document")                                                                     |
| 4 Scoundrel  | Forged Seal, Writing Kit                                                             | Stamp - Engraved ("Forged Seal"); Writing Kit                                                                              |

## Coachman

- [x] reviewed

| Level          | Book text                                  | Proposed                                                     |
| -------------- | ------------------------------------------ | ------------------------------------------------------------ |
| 1 Postilion    | Coach Horn, Hat, Leather Jerkin, Warm Coat | **Coach Horn** (new); Hat; Leather Jerkin; Coat              |
| 2 Coachman     | Blunderbuss with 10 Shots, Whip            | Blunderbuss, 10 × Small Shot and Powder; Whip                |
| 3 Coach Master | Pistol with 10 Shots, Quality Cloak        | Pistol, 10 × Bullet and Powder; **Cloak (Fine)** (new)       |
| 4 Route Master | Fleet of Coaches and Horses, Maps          | **Command** (new) ("Fleet of Coaches and Horses"); 1d6 × Map |

## Duellist

- [x] reviewed

| Level               | Book text                                                            | Proposed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Fencer            | Melee Weapon (Any), Sling Bag containing Clothing and 1d10 Bandages  | Hand Weapon / Sword / Rapier / Foil; Sling Bag, Clothing, 1d10 × Bandage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 2 Duellist          | Main Gauche or Sword-breaker, Pistol with 10 Shots                   | Main Gauche / Swordbreaker; Pistol, 10 × Bullet and Powder                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 3 Duelmaster        | Hand Weapon, Quality Rapier, Trusty Second, 2 Wooden Training Swords | Hand Weapon; **Rapier (Fine)** (new); **Retainer** (new) ("Trusty Second"); 2 × **Wooden Training Sword** (new)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 4 Judicial Champion | 2 Quality Weapons                                                    | **Sword (Fine)** (new) / **Rapier (Fine)** (new) / **Foil (Fine)** (new) / **Pistol (Fine)** (new), 10 × Bullet and Powder / **Handgun (Fine)** (new), 10 × Bullet and Powder; **Sword (Fine)** (new) / **Rapier (Fine)** (new) / **Foil (Fine)** (new) / **Pistol (Fine)** (new), 10 × Bullet and Powder / **Handgun (Fine)** (new), 10 × Bullet and Powder                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Engineer

- [x] reviewed

| Level                | Book text                                                                        | Proposed                                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1 Student Engineer   | Book (Engineer), Hammer and Spikes                                               | Book - Engineer; Hammer, 1d6 × Spike                                                                                               |
| 2 Engineer           | Guild Licence, Trade Tools (Engineer)                                            | Guild Licence ("Engineer"); **Trade Tools** (new) ("Engineer")                                                                     |
| 3 Master Engineer    | Workshop (Engineer)                                                              | **Workshop** (new) ("Engineer")                                                                                                    |
| 4 Chartered Engineer | Library (Engineering), Quality Trade Tools (Engineer), Large Workshop (Engineer) | **Holding** (new) ("Library - Engineering"); **Trade Tools (Practical)** (new) ("Engineer"); **Large Workshop** (new) ("Engineer") |

## Entertainer

- [x] reviewed

| Level           | Book text                                                                                | Proposed                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1 Busker        | Bowl, Musical Instrument                                                                 | Bowl; Instrument - Small / Instrument - Medium / Instrument - Large                        |
| 2 Entertainer   | Costume, Instrument, 5 Throwing Knives                                                   | Costume; Instrument - Small / Instrument - Medium / Instrument - Large; 5 × Throwing Knife |
| 3 Troubadour    | Trained Animal, Writing Kit                                                              | **Animal Companion** (new) ("Trained Animal"); Writing Kit                                 |
| 4 Troupe Leader | Draught Horses and Wagon (Stage), Troupe of Entertainers, Wardrobe of Costumes and Props | 2 × Draught Horse, Wagon; **Command** (new) ("Troupe of Entertainers"); 5 × Costume        |

## Envoy

- [x] reviewed

| Level        | Book text                                                | Proposed                                                                                                 |
| ------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 1 Herald     | Leather Jack, Livery, Scroll Case                        | Leather Jack; Courtly Garb (Servant) ("Livery"); Scroll Case                                             |
| 2 Envoy      | 10 Sheets of Parchment, Writing Kit                      | 10 × Parchment; Writing Kit                                                                              |
| 3 Diplomat   | Aide, Quality Clothes, Map                               | **Retainer** (new) ("Aide"); **Clothing (Fine)** (new); Map                                              |
| 4 Ambassador | Best Quality Courtly Clothes, Herald, Staff of Diplomats | **Courtly Garb (Fine 2)** (new); **Retainer** (new) ("Herald"); **Command** (new) ("Staff of Diplomats") |

## Fence

- [x] reviewed

| Level             | Book text                                           | Proposed                                                                                                              |
| ----------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1 Broker          | Hand Weapon, Stolen Goods worth 1d10 Shillings      | Hand Weapon; **Trade Goods** (new) ("stolen, worth 1d10 Shillings")                                                   |
| 2 Fence           | Eyeglass, Trade Tools (Engraver), Writing Kit       | Reading Lens ("Eyeglass"); **Trade Tools** (new) ("Engraver"); Writing Kit                                            |
| 3 Trafficker      | Horse and Cart, Pawnbroker’s Shop                   | Draught Horse, Cart; **Holding** (new) ("Pawnbroker’s Shop")                                                          |
| 4 Black Marketeer | Gang of Racketeers, Network of Informers, Warehouse | **Command** (new) ("Gang of Racketeers"); **Command** (new) ("Network of Informers"); **Holding** (new) ("Warehouse") |

## Flagellant

- [x] reviewed

| Level             | Book text                                                                  | Proposed                                                                                         |
| ----------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 1 Penitent        | Flail, Tattered Robes                                                      | Flail; Robes                                                                                     |
| 2 Flagellant      | Great Weapon (Military Flail), Religious Symbol                            | Military Flail; Religious Symbol                                                                 |
| 3 Zealot          | Religious Relic                                                            | **Religious Relic** (new)                                                                        |
| 4 Prophet of Doom | Book (Religion), Followers (including Penitents, Flagellants, and Zealots) | Book - Religion; **Command** (new) ("Penitents, Flagellants and Zealots")                        |

## Grave Robber

- [x] reviewed

| Level             | Book text                                                                              | Proposed                                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Penny Thief     | Crowbar, Hooded Cloak, Sack, Shovel                                                    | Crowbar; Hooded Cloak; Sack; Spade                                                                                                     |
| 2 Grave Robber    | Backpack, Handcart, Hand Weapon, Storm Lantern and Oil, Tarpaulin, Trade Tools (Thief) | Backpack; **Handcart** (new); Hand Weapon; Storm Lantern, Lamp Oil; Canvas Tarp; **Trade Tools** (new) ("Thief") |
| 3 Tomb Robber     | Horse and Cart, Leather Jack, Pick, Rope                                               | Draught Horse, Cart; Leather Jack; Pick (Tool); Rope - 10 yards                                                                        |
| 4 Treasure Hunter | Bedroll, Maps, Tent, Trade Tools (Engineer), Writing Kit                               | Bedroll; Map; Tent - Medium; **Trade Tools** (new) ("Engineer"); Writing Kit                                                           |

## Guard

- [x] reviewed

| Level           | Book text                                             | Proposed                                                                   |
| --------------- | ----------------------------------------------------- | -------------------------------------------------------------------------- |
| 1 Sentry        | Buckler, Leather Jerkin, Storm Lantern with Oil       | Buckler; Leather Jerkin; Storm Lantern, Lamp Oil                           |
| 2 Guard         | Bow with 10 Arrows, Sleeved Mail Shirt, Shield, Spear | Bow, 10 × Arrow; Mail Coat; Shield; Spear                                  |
| 3 Honour Guard  | Great Weapon or Halberd, Helmet, Uniform              | Bastard Sword / Greataxe / Warhammer / Zweihänder / Halberd; Helm; Uniform |
| 4 Guard Officer | Breastplate, Squad of Guards                          | Breastplate; **Command** (new) ("Squad of Guards")                         |

## Hedge Witch

- [x] reviewed

| Level              | Book text                                                 | Proposed                                                                 |
| ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| 1 Hedge Apprentice | Amulet, Hand Weapon (Sickle), Quarterstaff                | Amulet; Hand Weapon ("Sickle"); Quarterstaff                             |
| 2 Hedge Witch      | Healing Poultice, Trade Tools (Herbalist)                 | Healing Poultice; **Trade Tools** (new) ("Herbalist")                    |
| 3 Hedge Master     | Apprentice, Isolated Hut                                  | **Retainer** (new) ("Apprentice"); **Holding** (new) ("Isolated Hut")    |
| 4 Hedgewise        | Assortment of Animal Skulls, Ceremonial Cloak and Garland | 1d10 × **Animal Skull** (new); **Cloak (Fine)** (new), **Garland** (new) |

## Herbalist

- [x] reviewed

| Level           | Book text                                                                    | Proposed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Herb Gatherer | Boots, Cloak, Hand Weapon (Sickle), Sling Bag containing Assortment of Herbs | Boots; Cloak; Hand Weapon ("Sickle"); Sling Bag, **Herbs** (new)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 2 Herbalist     | Trade Tools (Herbalist)                                                      | **Trade Tools** (new) ("Herbalist")                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 3 Herb Master   | 3 Herbal Remedies, Herb Gatherer, Workshop (Herbalist)                       | Remedy - Blight / Remedy - Buboes / Remedy - Convulsions / Remedy - Coughs and Sneezes; Remedy - Fever / Remedy - Flux / Remedy - Gangrene / Remedy - Infection; Remedy - Malaise / Remedy - Nausea / Remedy - Pox; **Retainer** (new) ("Herb Gatherer"); **Workshop** (new) ("Herbalist")                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| 4 Herbwise      | Book (Herbs), Pony and Cart                                                  | **Book - Herbs** (new); Pony, Cart                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Hunter

- [x] reviewed

| Level         | Book text                                                            | Proposed                                                                                                                                   |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Trapper     | Hand Weapon (Axe), Selection of Animal Traps, Sturdy Boots and Cloak | Hand Weapon ("Axe"); 1d6 × Animal Trap; Boots, Cloak                                                                                       |
| 2 Hunter      | Hunting Dog, Ranged Weapon (Any One), Spear                          | Hunting Dog; Bow, 10 × Arrow / Longbow, 10 × Arrow / Shortbow, 10 × Arrow / Crossbow, 10 × Bolt / Sling, 10 × Lead Bullet / Javelin; Spear |
| 3 Tracker     | Backpack, Bedroll, Tent                                              | Backpack; Bedroll; Tent - Medium                                                                                                           |
| 4 Huntsmaster | Hawk Mews or Kennel of Hunting Dogs, Riding Horse                    | **Command** (new) ("Hawk Mews") / **Command** (new) ("Kennel of Hunting Dogs"); Riding Horse                                               |

## Investigator

- [x] reviewed

| Level          | Book text                                             | Proposed                                                                                      |
| -------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1 Enquirer     | Lamp Oil, Lantern, Journal, Writing Kit               | Lamp Oil; Lantern; Book - Blank ("Journal"); Writing Kit                                      |
| 2 Investigator | Leather Jack, Hand Weapon, Magnifying Glass, Lockpick | Leather Jack; Hand Weapon; Reading Lens ("Magnifying Glass"); Lockpicks |
| 3 Sleuth       | Assistant, Office                                     | **Retainer** (new) ("Assistant"); **Holding** (new) ("Office")                                |
| 4 Detective    | Network of Informers, Spyglass                        | **Command** (new) ("Network of Informers"); Telescope ("Spyglass")                            |

## Knave

- [x] reviewed

| Level        | Book text                                               | Proposed                                                                                            |
| ------------ | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| 1 Hustler    | Flask of Spirits                                        | Flask of Spirits                                                                                    |
| 2 Knave      | Dose of Weirdroot, Quality Clothing                     | Weirdroot; **Clothing (Fine)** (new)                                                                |
| 3 Procurer   | A Ring of Hustlers                                      | **Command** (new) ("A Ring of Hustlers")                                                            |
| 4 Ringleader | A Ring of Knaves, Townhouse with Discreet Back Entrance | **Command** (new) ("A Ring of Knaves"); **Holding** (new) ("Townhouse with Discreet Back Entrance") |

## Knight

- [x] reviewed

| Level                        | Book text                                                                          | Proposed                                                                                                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Squire                     | Leather Jack, Mail Shirt, Riding Horse, Shield, Trade Tools (Farrier)              | Leather Jack; Mail Shirt; Riding Horse; Shield; **Trade Tools** (new) ("Farrier")                                                                             |
| 2 Knight                     | Destrier, Melee Weapon (Any), Lance, Plate Armour, Sword                           | Destrier; Hand Weapon / Cavalry Hammer / Warhammer / Greataxe / Zweihänder / Flail / Military Flail; Lance; Breastplate, Bracers, Plate Leggings, Helm; Sword |
| 3 First Knight               | Barding, Small Unit of Knights                                                     | **Barding** (new); **Command** (new) ("Small Unit of Knights")                                                                                                |
| 4 Knight of the Inner Circle | Large Unit of Knights or Several Small Units of Knights, Plumed Great Helm, Squire | **Command** (new) ("Large Unit of Knights") / **Command** (new) ("Several Small Units of Knights"); Helm ("With a plume"); **Retainer** (new) ("Squire")      |

## Lawyer

- [x] reviewed

| Level            | Book text                               | Proposed                                                                                      |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1 Student Lawyer | Book (Law), Magnifying Glass            | Book - Law; Reading Lens ("Magnifying Glass")                                                 |
| 2 Lawyer         | Court Robes, Guild Licence, Writing Kit | Robes ("Court Robes"); Guild Licence; Writing Kit                                             |
| 3 Barrister      | Assistant (Student or Servant), Office  | **Retainer** (new) ("Student") / **Retainer** (new) ("Servant"); **Holding** (new) ("Office") |
| 4 Judge          | Gavel, Ostentatious Wig                 | Gavel; **Wig** (new)                                                                          |

## Merchant

- [x] reviewed

| Level             | Book text                                                                         | Proposed                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Trader          | Abacus, Canvas Tarpaulin, Mule and Cart, 3d10 Shillings                           | Abacus; Canvas Tarp; Mule, Cart; *3d10 shillings: money*                                                                                              |
| 2 Merchant        | Barge or 2 Wagons, 20 GC, Guild Licence                                           | River Barge / 2 × Wagon; *20 gc: money*; Guild Licence                                                                                                |
| 3 Master Merchant | 100 GC, Townhouse with Servants, Warehouse                                        | *100 gc: money*; **Holding** (new) ("Townhouse with Servants"); **Holding** (new) ("Warehouse")                                                       |
| 4 Merchant Prince | 2 Barges and 4 Wagons, Large Town Estate, 1000 GC, Quality Clothing, 2 Warehouses | 2 × River Barge, 4 × Wagon; **Holding** (new) ("Large Town Estate"); *1000 gc: money*; **Clothing (Fine)** (new); 2 × **Holding** (new) ("Warehouse") |

## Messenger

- [x] reviewed

| Level             | Book text                               | Proposed                                                      |
| ----------------- | --------------------------------------- | ------------------------------------------------------------- |
| 1 Runner          | Scroll Case                             | Scroll Case                                                   |
| 2 Messenger       | Hand Weapon, Leather Jack, Riding Horse | Hand Weapon; Leather Jack; Riding Horse |
| 3 Courier         | Backpack, Saddlebags, Shield            | Backpack; Saddlebags; Shield                                  |
| 4 Courier-captain | Couriers, Mail Shirt, Writing Kit       | **Retainer** (new) ("Couriers"); Mail Shirt; Writing Kit      |

## Miner

- [x] reviewed

| Level          | Book text                                                                                 | Proposed                                                                              |
| -------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1 Prospector   | Charcoal Stick, Crude Map, Great Weapon (Two-handed Pick), Hand Weapon (Pick), Pan, Spade | Charcoal Stick; Map; Pick (the weapon variant); Hand Weapon ("Pick"); Pan; Spade      |
| 2 Miner        | Davrich Lamp, Lamp Oil, Leather Jack, Open Helm (Miner’s Helm)                            | Feinkopf Lamp; Lamp Oil; Leather Jack; Open Helm ("Miner’s Helm")                     |
| 3 Master Miner | Trade Tools (Engineer)                                                                    | **Trade Tools** (new) ("Engineer")                                                    |
| 4 Mine Foreman | Crew of Miners, Writing Kit                                                               | **Command** (new) ("Crew of Miners"); Writing Kit                                     |

## Mystic

- [x] reviewed

| Level            | Book text                              | Proposed                                         |
| ---------------- | -------------------------------------- | ------------------------------------------------ |
| 1 Fortune Teller | Cheap Jewellery, Deck of Cards or Dice | **Jewellery (Ugly)** (new); Deck of Cards / Dice |
| 2 Mystic         | Selection of Amulets                   | 1d6 × Amulet                                     |
| 3 Augur          | Writing Kit                            | Writing Kit                                      |
| 4 Seer           | Trade Tools (Astrology)                | **Trade Tools** (new) ("Astrology")              |

## Noble

- [x] reviewed

| Level        | Book text                                                                                                                     | Proposed                                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Scion      | Courtly Garb, Foil or Hand Mirror, Velvet Cloak, Jewellery worth 3d10 GC, Personal Servant                                    | Courtly Garb; Foil / Hand Mirror; Velvet Cloak; Jewellery ("worth 3d10 GC"); **Retainer** (new) ("Personal Servant")                                                       |
| 2 Noble      | Coach or Riding Horse, 4 Household Servants, Jewellery worth 50 GC, Main-gauche or Pistol with 10 Shots, Quality Courtly Garb | Coach / Riding Horse; 4 × **Retainer** (new) ("Household Servant"); Jewellery ("worth 50 GC"); Main Gauche / Pistol, 10 × Bullet and Powder; **Courtly Garb (Fine)** (new) |
| 3 Grandee    | Fiefdom, 200 GC, Jewellery worth 200 GC, 2 sets of Quality Courtly Garb, Signet Ring                                          | **Holding** (new) ("Fiefdom"); *200 gc: money*; Jewellery ("worth 200 GC"); 2 × **Courtly Garb (Fine)** (new); Signet Ring                                                 |
| 4 Noble Lord | 500 GC, Jewellery worth 500 GC, Province                                                                                      | *500 gc: money*; Jewellery ("worth 500 GC"); **Holding** (new) ("Province")                                                                                                |

## Nun

- [x] reviewed

| Level              | Book text                        | Proposed                                                              |
| ------------------ | -------------------------------- | --------------------------------------------------------------------- |
| 1 Novice           | Religious Symbol, Robes          | Religious Symbol; Robes                                               |
| 2 Nun              | Book (Religion), Religious Relic | Book - Religion; **Religious Relic** (new)                            |
| 3 Abbess           | Abbey, Library (Theology)        | **Command** (new) ("Abbey"); **Holding** (new) ("Library - Theology") |
| 4 Prioress General | Religious Order                  | **Command** (new) ("Religious Order")                                 |

## Outlaw

- [x] reviewed

| Level          | Book text                                                    | Proposed                                                                     |
| -------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| 1 Brigand      | Bedroll, Hand Weapon, Leather Jerkin, Tinderbox              | Bedroll; Hand Weapon; Leather Jerkin; Tinderbox                              |
| 2 Outlaw       | Bow with 10 Arrows or Crossbow with 10 Bolts or Shield, Tent | Bow, 10 × Arrow / Crossbow, 10 × Bolt / Shield; Tent - Medium                |
| 3 Outlaw Chief | Band of Outlaws, Helmet, Sleeved Mail Shirt                  | **Command** (new) ("Band of Outlaws"); Helm; Mail Coat                       |
| 4 Bandit King  | ‘Fiefdom’ of Outlaw Chiefs, Lair                             | **Command** (new) ("‘Fiefdom’ of Outlaw Chiefs"); **Holding** (new) ("Lair") |

## Pedlar

- [x] reviewed

| Level              | Book text                                                                                    | Proposed                                                                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Vagabond         | Basket, Blanket, Goods worth 2d10 Pennies, Small Tent                                        | **Basket** (new); Blanket; **Trade Goods** (new) ("worth 2d10 Pennies"); Tent - Small                                                    |
| 2 Pedlar           | Backpack or Handcart, Bedroll, Goods worth 8d20 Pennies, Pots and Pans, Trade Tools (Tinker) | Backpack / **Handcart** (new); Bedroll; **Trade Goods** (new) ("worth 8d20 Pennies"); Cooking Pot, Pan; **Trade Tools** (new) ("Tinker") |
| 3 Carter           | Mule and Cart, Goods worth at least 2d10 Shillings, Sling with 10 Bullets                    | Mule, Cart; **Trade Goods** (new) ("worth at least 2d10 Shillings"); Sling, 10 × Lead Bullet                                             |
| 4 Wandering Trader | Draught Horse and Wagon, Goods worth at least 3d10 Shillings, 4d10 Shillings                 | 2 × Draught Horse, Wagon; **Trade Goods** (new) ("worth at least 3d10 Shillings"); *4d10 shillings: money*                               |

## Physician

- [x] reviewed

| Level                    | Book text                                               | Proposed                                                            |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------- |
| 1 Physician’s Apprentice | Bandages, Vitality Draught                              | Bandage; Vitality Draught                                           |
| 2 Physician              | Book (Medicine), Guild Licence, Trade Tools (Physician) | Book - Medicine; Guild Licence; **Trade Tools** (new) ("Physician") |
| 3 Doktor                 | Apprentice, Workshop (Physician)                        | **Retainer** (new) ("Apprentice"); **Workshop** (new) ("Physician") |
| 4 Court Physician        | Courtly Attire, Letter of Appointment                   | Courtly Garb; Legal Document ("Letter of Appointment")              |

## Pilot

- [x] reviewed

| Level          | Book text                     | Proposed                                             |
| -------------- | ----------------------------- | ---------------------------------------------------- |
| 1 Riverguide   | Hand Weapon (Boat Hook)       | Hand Weapon ("Boat Hook")                            |
| 2 Pilot        | Leather Jerkin, Rope, Rowboat | Leather Jerkin; Rope - 10 yards; Row Boat            |
| 3 Navigator    | Pole, Storm Lantern and Oil   | Pole (3 yards); Storm Lantern, Lamp Oil              |
| 4 Master Pilot | Boathand, Small Riverboat     | **Retainer** (new) ("Boathand"); **Riverboat** (new) |

## Pit Fighter

- [x] reviewed

| Level          | Book text                                  | Proposed                                                                                                     |
| -------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| 1 Pugilist     | Bandages, Knuckledusters, Leather Jack     | Bandage; Knuckledusters; Leather Jack                                                                        |
| 2 Pit Fighter  | Flail or Great Weapon, Net or Whip, Shield | Flail / Bastard Sword / Greataxe / Pick / Warhammer / Zweihänder; Net / Whip; Shield                         |
| 3 Pit Champion | Breastplate, Helmet                        | Breastplate; Helm                                                                                            |
| 4 Pit Legend   | Quality Helmet                             | **Helm (Fine)** (new)                                                                                        |

## Priest

- [x] reviewed

| Level         | Book text                                                   | Proposed                                                                                                                   |
| ------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1 Initiate    | Religious Symbol, Robes                                     | Religious Symbol; Robes                                                                                                    |
| 2 Priest      | Book (Religion), Ceremonial Robes                           | Book - Religion; Robes ("Ceremonial Robes")                                                                                |
| 3 High Priest | Quality Robes, Religious Relic, Subordinate Priests, Temple | **Robes (Fine)** (new); **Religious Relic** (new); **Command** (new) ("Subordinate Priests"); **Command** (new) ("Temple") |
| 4 Lector      | Library (Theology), Subordinate High Priests                | **Holding** (new) ("Library - Theology"); **Command** (new) ("Subordinate High Priests")                                   |

## Protagonist

- [x] reviewed

| Level         | Book text                                                                                   | Proposed                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Braggart    | Hood or Mask, Knuckledusters, Leather Jack                                                  | Hood / Mask; Knuckledusters; Leather Jack                                                                                                                                        |
| 2 Protagonist | Mail Shirt, Riding Horse, Shield                                                            | Mail Shirt; Riding Horse; Shield                                                                                                                                                 |
| 3 Hitman      | Cloak, Crossbow with 10 Bolts or Pistol with 10 Shots or 5 Throwing Knives, Garotte, Poison | Cloak; Crossbow, 10 × Bolt / Pistol, 10 × Bullet and Powder / 5 × Throwing Knife; Garrote; Adder Root / Black Lotus (Sap) / Heartkill / Manbane / Spider Spittle / Schlafenkraut |
| 4 Assassin    | Disguise Kit                                                                                | Disguise Kit                                                                                                                                                                     |

## Racketeer

- [x] reviewed

| Level        | Book text                                                               | Proposed                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Thug       | Hand Weapon, Knuckledusters, Leather Jack                               | Hand Weapon; Knuckledusters; Leather Jack                                                                            |
| 2 Racketeer  | Hat, Mail Shirt                                                         | Hat; Mail Shirt                                                                                                                            |
| 3 Gang Boss  | Crossbow Pistol with 10 Bolts, Gang of Thugs and Racketeers, Lair       | Crossbow Pistol, 10 × Bolt; **Command** (new) ("Gang of Thugs and Racketeers"); **Holding** (new) ("Lair")                                 |
| 4 Crime Lord | Network of Informers, Quality Clothing and Hat, Subordinate Gang Bosses | **Command** (new) ("Network of Informers"); **Clothing (Fine)** (new), **Hat (Fine)** (new); **Command** (new) ("Subordinate Gang Bosses") |

## Rat Catcher

- [x] reviewed

| Level          | Book text                                                       | Proposed                                                                                |
| -------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1 Rat Hunter   | Hand Weapon, Sack, Small Animal Traps, Small but Vicious Dog    | Hand Weapon; Sack; Animal Trap ("For Small Animals"); Hunting Dog ("Small but Vicious") |
| 2 Rat Catcher  | Pole for Dead Rats, Rat Poison                                  | Pole (3 yards); Rat Poison                                                              |
| 3 Sewer Jack   | Crossbow with 10 Bolts or Spear, Feinkopf Lantern, Leather Jack | Crossbow, 10 × Bolt / Spear; Feinkopf Lamp; Leather Jack                                |
| 4 Exterminator | Assistant, Sack of Poisoned Bait                                | **Retainer** (new) ("Assistant"); Sack, 1d10 × Rat Poison ("Rat Bait")                  |

## Riverwarden

- [x] reviewed

| Level              | Book text                                     | Proposed                                                              |
| ------------------ | --------------------------------------------- | --------------------------------------------------------------------- |
| 1 River Recruit    | Hand Weapon, Leather Jack, Uniform            | Hand Weapon; Leather Jack; Uniform              |
| 2 Riverwarden      | Lantern and Oil, Pistol with 10 Shots, Shield | Lantern, Lamp Oil; Pistol, 10 × Bullet and Powder; Shield             |
| 3 Shipsword        | Grappling Hook, Helmet, Mail Shirt            | Grappling Hook; Helm; Mail Shirt                                      |
| 4 Shipsword Master | Patrol Boats and Crew, Symbol of Rank         | **Command** (new) ("Patrol Boats and Crew"); **Symbol of Rank** (new) |

## Riverwoman

- [x] reviewed

| Level         | Book text                                      | Proposed                                        |
| ------------- | ---------------------------------------------- | ----------------------------------------------- |
| 1 Greenfish   | Bucket, Fishing Rod and Bait, Leather Leggings | Bucket; **Fishing Rod** (new); Leather Leggings |
| 2 Riverwoman  | Eel Trap, Leather Jerkin, Net, Spear           | Animal Trap; Leather Jerkin; Net; Spear         |
| 3 Riverwise   | Rowboat, Storm Lantern and Oil                 | Row Boat; Storm Lantern, Lamp Oil               |
| 4 River Elder | Barge or Hut                                   | River Barge / **Holding** (new) ("Hut")         |

## Roadwarden

- [x] reviewed

| Level           | Book text                                              | Proposed                                                                                |
| --------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| 1 Toll Keeper   | Crossbow with 10 Bolts, Hand Weapon, Leather Jack      | Crossbow, 10 × Bolt; Hand Weapon; Leather Jack                                          |
| 2 Roadwarden    | Light Warhorse, Mail Shirt, Pistol with 10 Shots, Rope | Light Warhorse; Mail Shirt; Pistol, 10 × Bullet and Powder; Rope - 10 yards             |
| 3 Road Sergeant | Squad of Roadwardens, Symbol of Rank                   | **Command** (new) ("Squad of Roadwardens"); **Symbol of Rank** (new)                    |
| 4 Road Captain  | Quality Hat and Cloak, Unit of Roadwardens             | **Hat (Fine)** (new), **Cloak (Fine)** (new); **Command** (new) ("Unit of Roadwardens") |

## Sailor

- [x] reviewed

| Level           | Book text                                                 | Proposed                                                                                                             |
| --------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1 Landsman      | Brush, Bucket, Mop                                        | Floor Brush; Bucket; Mop                                                                                             |
| 2 Sailor        | Hand Weapon (Boat Hook), Leather Jerkin                   | Hand Weapon ("Boat Hook"); Leather Jerkin                                                                            |
| 3 Boatswain     | Trade Tools (Carpenter), Trade Tools (Physician)          | **Trade Tools** (new) ("Carpenter"); **Trade Tools** (new) ("Physician")                                             |
| 4 Ship’s Master | Sailing Ship and Crew, Sextant, Shipping Charts, Spyglass | **Command** (new) ("Sailing Ship and Crew"); **Sextant** (new); 1d6 × Map ("Shipping Chart"); Telescope ("Spyglass") |

## Scholar

- [x] reviewed

| Level       | Book text                   | Proposed                                                             |
| ----------- | --------------------------- | -------------------------------------------------------------------- |
| 1 Student   | Alcohol, Book               | Flask of Spirits; **Book** (new)                                     |
| 2 Scholar   | Access to a Library, Degree | **Holding** (new) ("Access to a Library"); Legal Document ("Degree") |
| 3 Fellow    | Mortarboard, Robes          | Hat ("Mortarboard"); Robes                                           |
| 4 Professor | Study                       | **Holding** (new) ("Study")                                          |

## Scout

- [x] reviewed

| Level        | Book text                                                                              | Proposed                                                                    |
| ------------ | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1 Guide      | Hand Weapon, Leather Jack, Sturdy Boots and Cloak, Rope                                | Hand Weapon; Leather Jack; Boots, Cloak; Rope - 10 yards                    |
| 2 Scout      | Bow with 10 Arrows or Crossbow with 10 Bolts or Sling with 10 Lead Bullets, Mail Shirt | Bow, 10 × Arrow / Crossbow, 10 × Bolt / Sling, 10 × Lead Bullet; Mail Shirt |
| 3 Pathfinder | Map, Riding Horse, Saddlebags with 2 weeks’ Rations, Tent                              | Map; Riding Horse; Saddlebags, 14 × Rations - 1 day; Tent - Medium          |
| 4 Explorer   | Selection of Maps, Trade Tools (Cartographer)                                          | 1d6 × Map; **Trade Tools** (new) ("Cartographer")                           |

## Servant

- [x] reviewed

| Level       | Book text                                          | Proposed                                                                               |
| ----------- | -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1 Menial    | Floor Brush                                        | Floor Brush                                                                            |
| 2 Servant   | Livery                                             | Courtly Garb (Servant) ("Livery")                                                      |
| 3 Attendant | Lamp Oil, Quality Livery, Storm Lantern, Tinderbox | Lamp Oil; **Courtly Garb (Servant) (Fine)** (new) ("Livery"); Storm Lantern; Tinderbox |
| 4 Steward   | Hand Weapon, Fine Clothes, Servant                 | Hand Weapon; **Clothing (Fine)** (new); **Retainer** (new) ("Servant")                 |

## Slayer

- [x] reviewed

| Level           | Book text                                          | Proposed                                            |
| --------------- | -------------------------------------------------- | --------------------------------------------------- |
| 1 Troll Slayer  | Flask of Spirits, Hand Weapon (Dwarf Axe), Tattoos | Flask of Spirits; Hand Weapon ("Dwarf Axe"); Tattoo |
| 2 Giant Slayer  | Great Weapon (Dwarf Greataxe)                      | Greataxe ("Dwarf Greataxe")                         |
| 3 Dragon Slayer | 2 Dwarf Throwing Axes                              | 2 × Throwing Axe ("Dwarf Axe")                      |
| 4 Daemon Slayer | Rune Axe                                           | **Magic Item** (new) ("Rune Axe")                   |

## Smuggler

- [x] reviewed

| Level             | Book text                                                     | Proposed                                                                         |
| ----------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1 River Runner    | Large Sack, Mask or Scarves, Storm Lantern and Oil, Tinderbox | Sack - Large; Mask / **Scarf** (new); Storm Lantern, Lamp Oil; Tinderbox         |
| 2 Smuggler        | 2 Barrels, Hand Weapon, Rowboat                               | 2 × Barrel; Hand Weapon; Row Boat                          |
| 3 Master Smuggler | Pistol with 10 Shots, River Runners, Speedy Barge             | Pistol, 10 × Bullet and Powder; **Command** (new) ("River Runners"); River Barge |
| 4 Smuggler King   | Disguise Kit, Small Fleet of Barges                           | Disguise Kit; **Command** (new) ("Small Fleet of Barges")                        |

## Soldier

- [x] reviewed

| Level      | Book text                                                                                                | Proposed                                                                                                                                                                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Recruit  | Leather Jack, Uniform, Weapon (Crossbow, Handgun, Halberd, Spear, or Sword)                              | Leather Jack; Uniform; Crossbow, 10 × Bolt / Handgun, 10 × Bullet and Powder / Halberd / Spear / Sword                                                                                                                                                             |
| 2 Soldier  | Breastplate, Helmet, Weapon (Any)                                                                        | Breastplate; Helm; Hand Weapon / Sword / Bastard Sword / Warhammer / Greataxe / Flail / Military Flail / Halberd / Spear / Pike / Zweihänder / Crossbow, 10 × Bolt / Handgun, 10 × Bullet and Powder / Bow, 10 × Arrow / Longbow, 10 × Arrow                       |
| 3 Sergeant | Symbol of Rank, Regiment of Recruits                                                                     | **Symbol of Rank** (new); **Command** (new) ("Regiment of Recruits")                                                                                                                                                                                               |
| 4 Officer  | Letter of Commission, Light Warhorse, Map, Orders, Quality Uniform, Symbol of Rank, Regiment of Soldiers | Legal Document ("Letter of Commission"); Light Warhorse; Map; Legal Document ("Orders"); **Uniform (Fine)** (new); **Symbol of Rank** (new); **Command** (new) ("Regiment of Soldiers")                                                                            |

## Spy

- [x] reviewed

| Level       | Book text                                                                             | Proposed                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1 Informer  | Charcoal Stick, Sling Bag containing 2 different sets of Clothing and Hooded Cloak    | Charcoal Stick; Sling Bag, 2 × Clothing, Hooded Cloak                                                                             |
| 2 Spy       | Disguise Kit, Informer, Telescope                                                     | Disguise Kit; **Retainer** (new) ("Informer"); Telescope                                                                          |
| 3 Agent     | Book (Cryptography), Loft of Homing Pigeons, Ring of Spies and Informers, Writing Kit | Book - Cryptography; **Holding** (new) ("Loft of Homing Pigeons"); **Command** (new) ("Ring of Spies and Informers"); Writing Kit |
| 4 Spymaster | Office and Staff                                                                      | **Command** (new) ("Office and Staff")                                                                                            |

## Stevedore

- [x] reviewed

| Level         | Book text                                                   | Proposed                                                            |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| 1 Dockhand    | Hand Weapon (Boat Hook), Leather Gloves                     | Hand Weapon ("Boat Hook"); Gloves                                   |
| 2 Stevedore   | Guild Licence, Leather Jerkin, Pipe and Tobacco, Porter Cap | Guild Licence; Leather Jerkin; Pipe and Tobacco; Hat ("Porter Cap") |
| 3 Foreman     | Gang of Stevedores, Whistle                                 | **Command** (new) ("Gang of Stevedores"); **Whistle** (new)         |
| 4 Dock Master | Office and Staff, Writing Kit                               | **Command** (new) ("Office and Staff"); Writing Kit                 |

## Thief

- [x] reviewed

| Level          | Book text                                                             | Proposed                                                                         |
| -------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1 Prowler      | Crowbar, Leather Jerkin, Sack                                         | Crowbar; Leather Jerkin; Sack                                                    |
| 2 Thief        | Fence Contact, Rope, Trade Tools (Thief)                              | **Contact** (new) ("Fence"); Rope - 10 yards; **Trade Tools** (new) ("Thief")    |
| 3 Master Thief | Crossbow Pistol with 10 Bolts, Grappling Hook, Several Fence Contacts | Crossbow Pistol, 10 × Bolt; Grappling Hook; **Contact** (new) ("Several Fences") |
| 4 Cat Burglar  | Calling Card, Dark Clothing                                           | **Calling Card** (new); Clothing                                                 |

## Townsman

- [x] reviewed

| Level          | Book text                                                                                        | Proposed                                                                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Clerk        | Lodgings                                                                                         | **Holding** (new) ("Lodgings")                                                                                                                                      |
| 2 Townsman     | Modest Shop                                                                                      | **Holding** (new) ("Modest Shop")                                                                                                                                   |
| 3 Proprietor   | Blunderbuss with 10 Shots, Inn or Townhouse, Staff                                               | Blunderbuss, 10 × Small Shot and Powder; **Holding** (new) ("Inn") / **Holding** (new) ("Townhouse"); **Command** (new) ("Staff")                                   |
| 4 Burgomeister | Chains of Office, Coach and Footman, Large Townhouse with Gardens and Servants, Quality Clothing | **Symbol of Rank** (new) ("Chains of Office"); Coach ("with a Footman"); **Holding** (new) ("Large Townhouse, Gardens and Servants"); **Clothing (Fine)** (new)     |

## Villager

- [x] reviewed

| Level           | Book text                                                                                       | Proposed                                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1 Peasant       | None                                                                                            | *none: none*                                                                                               |
| 2 Villager      | Hand Weapon (Axe), Lasso or Sling with 10 Stone Bullets, Leather Jerkin, Trade Tools (as Trade) | Hand Weapon ("Axe"); Lasso / Sling, 10 × Stone Bullet; Leather Jerkin; **Trade Tools** (new) ("own trade") |
| 3 Councillor    | Cottage, Mule and Cart, Workshop (as Trade)                                                     | **Holding** (new) ("Cottage"); Mule, Cart; **Workshop** (new) ("own trade")                                |
| 4 Village Elder | The Respect of the Village                                                                      | **Reputation** (new) ("Respected by the Village")                                                          |

## Warden

- [x] reviewed

| Level       | Book text                                                     | Proposed                                                                                                |
| ----------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1 Custodian | Keys, Lamp Oil, Lantern, Livery                               | Key; Lamp Oil; Lantern; Courtly Garb (Servant) ("Livery")                                               |
| 2 Warden    | Bow with 10 Arrows or Hand Weapon, Leather Jack, Riding Horse | Bow, 10 × Arrow / Hand Weapon; Leather Jack; Riding Horse                                               |
| 3 Seneschal | Breastplate, Rod of Office, Staff of Custodians               | Breastplate; **Symbol of Rank** (new) ("Rod of Office"); **Command** (new) ("Staff of Custodians")      |
| 4 Governor  | Aide, Governor’s Residence, Servant                           | **Retainer** (new) ("Aide"); **Command** (new) ("Governor’s Residence"); **Retainer** (new) ("Servant") |

## Warrior Priest

- [x] reviewed

| Level             | Book text                                                                    | Proposed                                                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Neophyte        | Book (Religion), Melee Weapon (Any), Leather Jerkin, Religious Symbol, Robes | Book - Religion; Hand Weapon / Sword / Warhammer / Cavalry Hammer / Flail / Military Flail / Greataxe / Zweihänder; Leather Jerkin; Religious Symbol; Robes |
| 2 Warrior Priest  | Breastplate, Weapon (Any)                                                    | Breastplate; Hand Weapon / Sword / Warhammer / Cavalry Hammer / Flail / Military Flail / Greataxe / Zweihänder                                              |
| 3 Priest Sergeant | Light Warhorse                                                               | Light Warhorse                                                                                                                                                                    |
| 4 Priest Captain  | Religious Relic                                                              | **Religious Relic** (new)                                                                                                                                                         |

## Watchman

- [x] reviewed

| Level            | Book text                                                              | Proposed                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Watch Recruit  | Hand Weapon, Leather Jack, Uniform                                     | Hand Weapon; Leather Jack; Uniform                                                                                                                                                                                                                                                                                                                                 |
| 2 Watchman       | Copper Badge, Lamp Oil, Lantern and Pole                               | **Symbol of Rank** (new) ("Copper Badge"); Lamp Oil; Lantern, Pole (3 yards)                                                                                                                                                                                                                                                                                                             |
| 3 Watch Sergeant | Breastplate, Open Helm, Symbol of Rank                                 | Breastplate; Open Helm; **Symbol of Rank** (new)                                                                                                                                                                                                                                                                                                                                         |
| 4 Watch Captain  | Quality Hand Weapon, Quality Hat, Quality Symbol of Rank, Riding Horse | **Hand Weapon (Fine)** (new); **Hat (Fine)** (new); **Symbol of Rank (Fine)** (new); Riding Horse                                                                                                             |

## Witch

- [x] reviewed

| Level       | Book text                                                | Proposed                                                                                                |
| ----------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1 Dabbler   | Notes Stuffed in Locked Drawer, Writing Kit              | Parchment ("Notes Stuffed in Locked Drawer"); Writing Kit                                               |
| 2 Witch     | Grimoire, Hand Weapon or Quarterstaff                    | **Grimoire** (new); Hand Weapon / Quarterstaff                                                          |
| 3 Enchanter | Assistant, Enchanted Staff, Tomes of Forbidden Knowledge | **Retainer** (new) ("Assistant"); Enchanted Staff; Book - Magic ("Tomes of Forbidden Knowledge")        |
| 4 Warlock   | Minions, Library (Magic), Remote Lair                    | **Command** (new) ("Minions"); **Holding** (new) ("Library - Magic"); **Holding** (new) ("Remote Lair") |

## Witch Hunter

- [x] reviewed

| Level                  | Book text                                                                                    | Proposed                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1 Interrogator         | Hand Weapon, Instruments of Torture                                                          | Hand Weapon; **Instruments of Torture** (new)                                           |
| 2 Witch Hunter         | Crossbow with 10 Bolts or Pistol with 10 Shots, Hat, Leather Jack, Riding Horse, Rope, Sword | Crossbow, 10 × Bolt / Pistol, 10 × Bullet and Powder; Hat; Leather Jack; Riding Horse; Rope - 10 yards; Sword |
| 3 Witch Hunter Captain | Quality Clothing, Subordinate Interrogators                                                  | **Clothing (Fine)** (new); **Command** (new) ("Subordinate Interrogators")                                    |
| 4 Witchfinder General  | Quality Courtly Garb, Subordinate Witch Hunters                                              | **Courtly Garb (Fine)** (new); **Command** (new) ("Subordinate Witch Hunters")                                |

## Wizard

- [x] reviewed

| Level                 | Book text                                | Proposed                                                                                       |
| --------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1 Wizard’s Apprentice | Grimoire, Quarterstaff                   | **Grimoire** (new); Quarterstaff                                                               |
| 2 Wizard              | Enchanted Staff, Magic Licence, Robes    | Enchanted Staff; **Magic Licence** (new); Robes                                                |
| 3 Master Wizard       | Apprentice, Light Warhorse, Magical Item | **Retainer** (new) ("Apprentice"); Light Warhorse; **Magic Item** (new) ("chosen with the GM") |
| 4 Wizard Lord         | Library (Magic), Workshop (Magic)        | **Holding** (new) ("Library - Magic"); **Workshop** (new) ("Magic")                            |

## Wrecker

- [x] reviewed

| Level             | Book text                                                    | Proposed                                                         |
| ----------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1 Cargo Scavenger | Crowbar, Large Sack, Leather Gloves                          | Crowbar; Sack - Large; Gloves                                    |
| 2 Wrecker         | Hand Weapon (Boat Hook), Leather Jack, Storm Lantern and Oil | Hand Weapon ("Boat Hook"); Leather Jack; Storm Lantern, Lamp Oil |
| 3 River Pirate    | Crossbow with 10 Bolts or Javelin, Grappling Hook and Rope   | Crossbow, 10 × Bolt / Javelin; Grappling Hook, Rope - 10 yards   |
| 4 Wrecker Captain | Barge and Wrecker Crew, Keg of Ale, Manacles                 | River Barge ("with Wrecker Crew"); Ale - Keg; Manacles           |
