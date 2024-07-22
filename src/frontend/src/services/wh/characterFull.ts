import {
  getSizeFormula,
  getMovementFormula,
  getWoundsFormula,
  printSize,
  printSpeciesWithRegion,
  SpeciesWithRegion,
} from "./characterUtils.ts";
import { CareerApiData, printClassName, printStatusTier, StatusStanding, StatusTier } from "./career.ts";
import {
  Attributes,
  getAttributes,
  getAttributeValue,
  multiplyAttributes,
  printAttributeName,
  sumAttributes,
} from "./attributes.ts";
import { ApiResponse } from "./common.ts";
import { SkillApiData } from "./skill.ts";
import { TalentApiData } from "./talent.ts";
import {
  AmmoType,
  ArmourType,
  Availability,
  ContainerType,
  ItemType,
  MeleeType,
  OtherType,
  printAmmoGroup,
  printArmourGroup,
  printArmourLocation,
  printItemType,
  printMeleeGroup,
  printMeleeReach,
  printRangedGroup,
  RangedType,
} from "./item.ts";
import { SpellApiData } from "./spell.ts";
import { PrayerApiData } from "./prayer.ts";
import { MutationApiData, printMutationType } from "./mutation.ts";
import { Source } from "./source.ts";
import { ItemPropertyApiData } from "./itemproperty.ts";
import { ModifierEffect } from "./characterModifiers.ts";

export interface ItemFullApiData {
  name: string;
  description: string;
  price: number;
  enc: number;
  availability: Availability;
  properties: ApiResponse<ItemPropertyApiData>[];
  type: ItemType;
  melee: MeleeType;
  ranged: RangedType;
  ammunition: AmmoType;
  armour: ArmourType;
  grimoire: { spells: ApiResponse<SpellApiData>[] };
  container: ContainerType;
  other: OtherType;
  shared: boolean;
  source: Source;
}

export interface WhNumber<WhApiData> {
  wh: ApiResponse<WhApiData>;
  number: number;
}

export interface CharacterFullApiData {
  name: string;
  description: string;
  notes: string;
  species: SpeciesWithRegion;
  fate: number;
  fortune: number;
  resilience: number;
  resolve: number;
  brass: number;
  silver: number;
  gold: number;
  spentExp: number;
  currentExp: number;
  sin: number;
  corruption: number;
  status: StatusTier;
  standing: StatusStanding;
  baseAttributes: Attributes;
  attributeAdvances: Attributes;
  career: WhNumber<CareerApiData>;
  skills: WhNumber<SkillApiData>[];
  talents: WhNumber<TalentApiData>[];
  equippedItems: WhNumber<ItemFullApiData>[];
  carriedItems: WhNumber<ItemFullApiData>[];
  storedItems: WhNumber<ItemFullApiData>[];
  spells: ApiResponse<SpellApiData>[];
  prayers: ApiResponse<PrayerApiData>[];
  mutations: ApiResponse<MutationApiData>[];
  careerPath: WhNumber<CareerApiData>[];
  shared: boolean;
}

export interface CharacterFullCareer {
  name: string;
  levelName: string;
  id: string;
  className: string;
}

export interface CharacterFullTalent {
  id: string;
  name: string;
  rank: number;
}

export interface CharacterFullSkill {
  id: string;
  name: string;
  attributeName: string;
  attributeValue: number;
  advances: number;
  skill: number;
}

export interface CharacterFullSpell {
  name: string;
  range: string;
  target: string;
  duration: string;
  description: string;
  cn: number;
}

export interface CharacterFullPrayer {
  name: string;
  range: string;
  target: string;
  duration: string;
  description: string;
}

export interface CharacterFullMutation {
  name: string;
  type: string;
  description: string;
}

export interface CharacterFullItem {
  id: string;
  name: string;
  enc: number;
  qualitiesFlawsRunes: string[];
  number: number;
  description: string;
  type: string;

  group?: string;
  rng?: string;
  dmg?: string;
  locations?: string[];
  ap?: number;
  spells?: CharacterFullSpell[];
}

export interface CharacterFull {
  id: string;
  canEdit: boolean;
  shared: boolean;
  name: string;
  description: string;
  notes: string;
  species: string;
  size: string;
  fate: number;
  fortune: number;
  resilience: number;
  resolve: number;
  brass: number;
  silver: number;
  gold: number;
  spentExp: number;
  currentExp: number;
  totalExp: number;
  sin: number;
  corruption: number;
  status: string;
  standing: StatusStanding;

  currentCareer: CharacterFullCareer;
  pastCareers: CharacterFullCareer[];

  baseAttributes: Attributes;
  attributeAdvances: Attributes;
  otherAttributes: Attributes;
  attributes: Attributes;

  movement: number;
  walk: number;
  run: number;
  wounds: number;

  talents: CharacterFullTalent[];
  basicSkills: CharacterFullSkill[];
  advancedSkills: CharacterFullSkill[];

  equippedArmor: CharacterFullItem[];
  equippedWeapon: CharacterFullItem[];
  equippedOther: CharacterFullItem[];
  carried: CharacterFullItem[];
  stored: CharacterFullItem[];

  spells: CharacterFullSpell[];
  prayers: CharacterFullPrayer[];
  mutations: CharacterFullMutation[];

  encWeapon: number;
  encArmor: number;
  encOther: number;
  encCarried: number;
}

export function newCharacterFull({
  id = "",
  canEdit = false,
  shared = false,
  name = "",
  description = "",
  notes = "",
  species = printSpeciesWithRegion(SpeciesWithRegion.None),
  size = "",
  fate = 0,
  fortune = 0,
  resilience = 0,
  resolve = 0,
  brass = 0,
  silver = 0,
  gold = 0,
  spentExp = 0,
  currentExp = 0,
  totalExp = 0,
  sin = 0,
  corruption = 0,
  status = printStatusTier(StatusTier.Brass),
  standing = 0 as StatusStanding,
  currentCareer = {} as CharacterFullCareer,
  pastCareers = [] as CharacterFullCareer[],
  baseAttributes = getAttributes(),
  attributeAdvances = getAttributes(),
  otherAttributes = getAttributes(),
  attributes = getAttributes(),
  movement = 0,
  walk = 0,
  run = 0,
  wounds = 0,
  talents = [] as CharacterFullTalent[],
  basicSkills = [] as CharacterFullSkill[],
  advancedSkills = [] as CharacterFullSkill[],
  equippedArmor = [] as CharacterFullItem[],
  equippedWeapon = [] as CharacterFullItem[],
  equippedOther = [] as CharacterFullItem[],
  carried = [] as CharacterFullItem[],
  stored = [] as CharacterFullItem[],
  spells = [] as CharacterFullSpell[],
  prayers = [] as CharacterFullPrayer[],
  mutations = [] as CharacterFullMutation[],
  encWeapon = 0,
  encArmor = 0,
  encOther = 0,
  encCarried = 0,
} = {}): CharacterFull {
  return {
    id: id,
    canEdit: canEdit,
    shared: shared,
    name: name,
    description: description,
    notes: notes,
    species: species,
    size: size,
    fate: fate,
    fortune: fortune,
    resilience: resilience,
    resolve: resolve,
    brass: brass,
    silver: silver,
    gold: gold,
    spentExp: spentExp,
    currentExp: currentExp,
    totalExp: totalExp,
    sin: sin,
    corruption: corruption,
    status: status,
    standing: standing,
    currentCareer: currentCareer,
    pastCareers: pastCareers,
    baseAttributes: baseAttributes,
    attributeAdvances: attributeAdvances,
    otherAttributes: otherAttributes,
    attributes: attributes,
    movement: movement,
    walk: walk,
    run: run,
    wounds: wounds,
    talents: talents,
    basicSkills: basicSkills,
    advancedSkills: advancedSkills,
    equippedArmor: equippedArmor,
    equippedWeapon: equippedWeapon,
    equippedOther: equippedOther,
    carried: carried,
    stored: stored,
    spells: spells,
    prayers: prayers,
    mutations: mutations,
    encWeapon: encWeapon,
    encArmor: encArmor,
    encOther: encOther,
    encCarried: encCarried,
  };
}

export function apiResponseToCharacterFull(fullCharacterApi: ApiResponse<CharacterFullApiData>): CharacterFull {
  const mutationAttributes: Attributes = fullCharacterApi.object.mutations.reduce(
    (a, v) => sumAttributes(a, v.object.modifiers.attributes),
    getAttributes(),
  );

  const talentAttributes: Attributes = fullCharacterApi.object.talents.reduce(
    (a, v) => sumAttributes(a, multiplyAttributes(v.number, v.wh.object.modifiers.attributes)),
    getAttributes(),
  );

  const otherAttributes = sumAttributes(mutationAttributes, talentAttributes);

  const attributes = sumAttributes(
    fullCharacterApi.object.baseAttributes,
    fullCharacterApi.object.attributeAdvances,
    otherAttributes,
  );

  const sizeModifier: number =
    fullCharacterApi.object.mutations.reduce((a, v) => a + v.object.modifiers.size, 0) +
    fullCharacterApi.object.talents.reduce((a, v) => a + v.number * v.wh.object.modifiers.size, 0);
  const movementModifier =
    fullCharacterApi.object.mutations.reduce((a, v) => a + v.object.modifiers.movement, 0) +
    fullCharacterApi.object.talents.reduce((a, v) => a + v.number * v.wh.object.modifiers.movement, 0);

  const size = getSizeFormula(sizeModifier);

  const hardyRanks =
    fullCharacterApi.object.mutations.reduce(
      (a, v) => a + (v.object.modifiers.effects.includes(ModifierEffect.Hardy) ? 1 : 0),
      0,
    ) +
    fullCharacterApi.object.talents.reduce(
      (a, v) => a + v.number * (v.wh.object.modifiers.effects.includes(ModifierEffect.Hardy) ? 1 : 0),
      0,
    );

  const [basicSkills, advancedSkills] = getSkills(fullCharacterApi.object.skills, attributes);

  const equippedArmor = fullCharacterApi.object.equippedItems.filter((x) => x.wh.object.type === ItemType.Armour);
  const equippedWeapon = fullCharacterApi.object.equippedItems.filter((x) =>
    [ItemType.Melee, ItemType.Ranged, ItemType.Ammunition].includes(x.wh.object.type),
  );
  const equippedOther = fullCharacterApi.object.equippedItems.filter((x) =>
    [ItemType.Container, ItemType.Other].includes(x.wh.object.type),
  );

  return {
    id: fullCharacterApi.id,
    canEdit: fullCharacterApi.canEdit,
    shared: fullCharacterApi.object.shared,
    name: fullCharacterApi.object.name,
    description: fullCharacterApi.object.description,
    notes: fullCharacterApi.object.notes,
    species: printSpeciesWithRegion(fullCharacterApi.object.species),
    size: printSize(size),
    fate: fullCharacterApi.object.fate,
    fortune: fullCharacterApi.object.fortune,
    resilience: fullCharacterApi.object.resilience,
    resolve: fullCharacterApi.object.resolve,
    brass: fullCharacterApi.object.brass,
    silver: fullCharacterApi.object.silver,
    gold: fullCharacterApi.object.gold,
    spentExp: fullCharacterApi.object.spentExp,
    currentExp: fullCharacterApi.object.currentExp,
    totalExp: fullCharacterApi.object.spentExp + fullCharacterApi.object.currentExp,
    sin: fullCharacterApi.object.sin,
    corruption: fullCharacterApi.object.corruption,
    status: printStatusTier(fullCharacterApi.object.status),
    standing: fullCharacterApi.object.standing,

    currentCareer: {
      id: fullCharacterApi.object.career.wh.id,
      name: getCareerName(fullCharacterApi.object.career),
      levelName: getCareerLevel(fullCharacterApi.object.career),
      className: printClassName(fullCharacterApi.object.career.wh.object.class),
    },
    pastCareers: fullCharacterApi.object.careerPath.map((x) => ({
      id: x.wh.id,
      name: getCareerName(x),
      levelName: getCareerLevel(x),
      className: printClassName(x.wh.object.class),
    })),

    baseAttributes: fullCharacterApi.object.baseAttributes,
    attributeAdvances: fullCharacterApi.object.attributeAdvances,
    otherAttributes: otherAttributes,
    attributes: attributes,

    movement: getMovementFormula(fullCharacterApi.object.species, movementModifier),
    walk: 2 * getMovementFormula(fullCharacterApi.object.species, movementModifier),
    run: 4 * getMovementFormula(fullCharacterApi.object.species, movementModifier),
    wounds: getWoundsFormula(size, attributes.T, attributes.WP, attributes.S, hardyRanks),

    talents: fullCharacterApi.object.talents.map((x) => ({ id: x.wh.id, name: x.wh.object.name, rank: x.number })),
    basicSkills: basicSkills,
    advancedSkills: advancedSkills,

    equippedArmor: getItems(equippedArmor, attributes),
    equippedWeapon: getItems(equippedWeapon, attributes),
    equippedOther: getItems(equippedOther, attributes),
    carried: getItems(fullCharacterApi.object.carriedItems, attributes),
    stored: getItems(fullCharacterApi.object.storedItems, attributes),

    spells: getSpells(fullCharacterApi.object.spells),
    prayers: getPrayers(fullCharacterApi.object.prayers),
    mutations: getMutations(fullCharacterApi.object.mutations),

    encWeapon: equippedWeapon.map((x) => x.wh.object.enc * x.number).reduce((x, y) => x + y, 0),
    encArmor: equippedArmor
      .map((x) => (x.wh.object.enc > 0 ? x.wh.object.enc - 1 : 0) * x.number)
      .reduce((x, y) => x + y, 0),
    encOther: equippedOther
      .map((x) => (x.wh.object.enc > 0 ? x.wh.object.enc - 1 : 0) * x.number)
      .reduce((x, y) => x + y, 0),
    encCarried: fullCharacterApi.object.carriedItems.map((x) => x.wh.object.enc).reduce((x, y) => x + y, 0),
  };
}

function getCareerName(career: WhNumber<CareerApiData>): string {
  return `${career.wh.object.name} ${career.number}`;
}

function getCareerLevel(career: WhNumber<CareerApiData>): string {
  switch (career.number) {
    case 1:
      return career.wh.object.level1.name;
    case 2:
      return career.wh.object.level2.name;
    case 3:
      return career.wh.object.level3.name;
    case 4:
      return career.wh.object.level4.name;
    default:
      return "";
  }
}

function getSkills(characterSkills: WhNumber<SkillApiData>[], attributes: Attributes) {
  const basicSkills = [] as CharacterFullSkill[];
  const advancedSkills = [] as CharacterFullSkill[];

  for (const skill of characterSkills) {
    const formattedSkill = skillForDisplay(skill.wh, skill.number, attributes);
    if (skill.wh.object.type === 0) {
      basicSkills.push(formattedSkill);
    } else {
      advancedSkills.push(formattedSkill);
    }
  }

  return [basicSkills.sort(sortByName), advancedSkills.sort(sortByName)];
}

function skillForDisplay(rawSkill: ApiResponse<SkillApiData>, skillRank: number, attributes: Attributes) {
  return {
    id: rawSkill.id,
    name: rawSkill.object.isGroup ? `${rawSkill.object.name} (Any)` : rawSkill.object.name,
    attributeName: printAttributeName(rawSkill.object.attribute),
    attributeValue: getAttributeValue(rawSkill.object.attribute, attributes),
    advances: skillRank,
    skill: getAttributeValue(rawSkill.object.attribute, attributes) + skillRank,
  };
}

function sortByName(x: { name: string }, y: { name: string }): -1 | 0 | 1 {
  return x.name === y.name ? 0 : x.name < y.name ? -1 : 1;
}

function getItems(characterItems: WhNumber<ItemFullApiData>[], attributes: Attributes) {
  const SB = Math.floor(attributes.S / 10);
  const items = [] as CharacterFullItem[];

  for (const charItem of characterItems) {
    const item = {
      id: charItem.wh.id,
      name: charItem.wh.object.name,
      enc: charItem.wh.object.enc,
      qualitiesFlawsRunes: charItem.wh.object.properties.map((x) => x.object.name),
      number: charItem.number,
      description: charItem.wh.object.description,
      type: printItemType(charItem.wh.object.type),
    } as CharacterFullItem;

    if (charItem.wh.object.type === ItemType.Melee) {
      item.group = printMeleeGroup(charItem.wh.object.melee.group);
      item.rng = printMeleeReach(charItem.wh.object.melee.reach);
      item.dmg = (charItem.wh.object.melee.dmg + charItem.wh.object.melee.dmgSbMult * SB).toString();
    } else if (charItem.wh.object.type === ItemType.Ranged) {
      item.group = printRangedGroup(charItem.wh.object.ranged.group);
      item.rng = (charItem.wh.object.ranged.rng + charItem.wh.object.ranged.rngSbMult * SB).toString();
      item.dmg = (charItem.wh.object.ranged.dmg + charItem.wh.object.ranged.dmgSbMult * SB).toString();
    } else if (charItem.wh.object.type === ItemType.Ammunition) {
      let range =
        charItem.wh.object.ammunition.rngMult !== 1 ? `Weapon x${charItem.wh.object.ammunition.rngMult}` : "Weapon";
      if (charItem.wh.object.ammunition.rng > 0) {
        range += `+${charItem.wh.object.ammunition.rng.toString()}`;
      } else if (charItem.wh.object.ammunition.rng < 0) {
        range += `${charItem.wh.object.ammunition.rng.toString()}`;
      }

      let damage = "Weapon";
      if (charItem.wh.object.ammunition.dmg > 0) {
        damage += `+${charItem.wh.object.ammunition.dmg.toString()}`;
      } else if (charItem.wh.object.ammunition.rng < 0) {
        damage += `${charItem.wh.object.ammunition.dmg.toString()}`;
      }

      item.group = printAmmoGroup(charItem.wh.object.ammunition.group);
      item.rng = range;
      item.dmg = damage;
    } else if (charItem.wh.object.type === ItemType.Armour) {
      item.group = printArmourGroup(charItem.wh.object.armour.group);
      item.locations = charItem.wh.object.armour.location.map((x) => printArmourLocation(x));
      item.ap = charItem.wh.object.armour.points;
    } else if (charItem.wh.object.type === ItemType.Grimoire) {
      item.spells = getSpells(charItem.wh.object.grimoire.spells);
    } else {
      item.description =
        (charItem.wh.object.type === ItemType.Container ? `(Capacity ${charItem.wh.object.container.capacity}) ` : "") +
        charItem.wh.object.description;
    }
    items.push(item);
  }

  return items;
}

function getSpells(spells: ApiResponse<SpellApiData>[]) {
  return spells.map((x) => ({
    name: x.object.name,
    range: x.object.range,
    target: x.object.target,
    duration: x.object.duration,
    description: x.object.description,
    cn: x.object.cn,
  }));
}

function getPrayers(prayers: ApiResponse<PrayerApiData>[]) {
  return prayers.map((x) => ({
    name: x.object.name,
    range: x.object.range,
    target: x.object.target,
    duration: x.object.duration,
    description: x.object.description,
  }));
}

function getMutations(mutations: ApiResponse<MutationApiData>[]) {
  return mutations.map((x) => {
    return {
      name: x.object.name,
      type: printMutationType(x.object.type),
      description: x.object.description,
    };
  });
}

export function CharacterFullToCsv(characterFull: CharacterFull): string {
  let csv = "Name,Species,Career,Class,Status,,,,,,\n";
  csv += csvStr(characterFull.name) + ",";
  csv += csvStr(characterFull.species) + ",";
  csv += csvStr(`${characterFull.currentCareer.name} (${characterFull.currentCareer.levelName})`) + ",";
  csv += csvStr(characterFull.currentCareer.className) + ",";
  csv += csvStr(characterFull.status + " " + characterFull.standing) + ",";
  csv += ",,,,,\n";

  csv += "Past Careers,";
  csv += csvStr(characterFull.pastCareers.map((x) => x.name).join(", ")) + ",";
  csv += ",,,,,,,,\n";
  csv += "Description,";
  csv += csvStr(characterFull.description) + ",";
  csv += ",,,,,,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Notes,,,,,,,,,,\n";
  csv += csvStr(characterFull.notes) + ",,,,,,,,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Movement,,,Wealth,,,Fate And Resilience,,,,\n";
  csv += "Movement,Walk,Run,D,SS,GC,Fate,Fortune,Resilience,Resolve,\n";

  csv += characterFull.movement + "," + characterFull.walk + "," + characterFull.run + ",";
  csv += characterFull.brass + "," + characterFull.silver + "," + characterFull.gold + ",";
  csv +=
    characterFull.fate +
    "," +
    characterFull.fortune +
    "," +
    characterFull.resilience +
    "," +
    characterFull.resolve +
    ",\n";

  csv += ",,,,,,,,,,\n";
  csv += "Wounds,Sin Points,Corruption Points,Current XP,Spent XP,Total XP,,,,,\n";
  csv += characterFull.wounds + "," + characterFull.sin + "," + characterFull.corruption + ",";
  csv += characterFull.currentExp + "," + characterFull.spentExp + "," + characterFull.totalExp + ",";
  csv += ",,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Attributes,,,,,,,,,,\n";
  csv += ",WS,BS,S,T,I,Ag,Dex,Int,Wp,Fel\n";
  csv += "Base" + "," + characterFull.baseAttributes.WS + "," + characterFull.baseAttributes.BS + ",";
  csv += characterFull.baseAttributes.S + "," + characterFull.baseAttributes.T + ",";
  csv += characterFull.baseAttributes.I + "," + characterFull.baseAttributes.Ag + ",";
  csv += characterFull.baseAttributes.Dex + "," + characterFull.baseAttributes.Int + ",";
  csv += characterFull.baseAttributes.WP + "," + characterFull.baseAttributes.Fel + "\n";

  csv += "Other" + "," + characterFull.otherAttributes.WS + "," + characterFull.otherAttributes.BS + ",";
  csv += characterFull.otherAttributes.S + "," + characterFull.otherAttributes.T + ",";
  csv += characterFull.otherAttributes.I + "," + characterFull.otherAttributes.Ag + ",";
  csv += characterFull.otherAttributes.Dex + "," + characterFull.otherAttributes.Int + ",";
  csv += characterFull.otherAttributes.WP + "," + characterFull.otherAttributes.Fel + "\n";

  csv += "Advances" + "," + characterFull.attributeAdvances.WS + "," + characterFull.attributeAdvances.BS + ",";
  csv += characterFull.attributeAdvances.S + "," + characterFull.attributeAdvances.T + ",";
  csv += characterFull.attributeAdvances.I + "," + characterFull.attributeAdvances.Ag + ",";
  csv += characterFull.attributeAdvances.Dex + "," + characterFull.attributeAdvances.Int + ",";
  csv += characterFull.attributeAdvances.WP + "," + characterFull.attributeAdvances.Fel + "\n";

  csv += "Total" + "," + characterFull.attributes.WS + "," + characterFull.attributes.BS + ",";
  csv += characterFull.attributes.S + "," + characterFull.attributes.T + ",";
  csv += characterFull.attributes.I + "," + characterFull.attributes.Ag + ",";
  csv += characterFull.attributes.Dex + "," + characterFull.attributes.Int + ",";
  csv += characterFull.attributes.WP + "," + characterFull.attributes.Fel + "\n";

  csv += ",,,,,,,,,,\n";
  csv += "Basic Skills,,,,,,,,,,\n";
  csv += "Name,Attr,Attr Val,Adv,Skill,Name,Attr,Attr Val,Adv,Skill,\n";

  const basicSkills1 = characterFull.basicSkills.slice(0, Math.floor(characterFull.basicSkills.length / 2));
  const basicSkills2 = characterFull.basicSkills.slice(Math.floor(characterFull.basicSkills.length / 2));

  for (let i = 0; i < basicSkills2.length; ++i) {
    const s1 = basicSkills1[i];
    const s2 = basicSkills2[i];

    if (s1) {
      csv += csvStr(s1.name) + "," + s1.attributeName + ",";
      csv += s1.attributeValue + "," + s1.advances + ", " + s1.skill + ",";
    } else {
      csv += ",,,,,";
    }

    csv += csvStr(s2.name) + "," + s2.attributeName + ",";
    csv += s2.attributeValue + "," + s2.advances + ", " + s2.skill + ",\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Advanced Skills,,,,,Talents,,,,,\n";
  csv += "Name,Attr,Attr Val,Adv,Skill,Name,Times Taken,,,,\n";

  for (let i = 0; i < Math.max(characterFull.advancedSkills.length, characterFull.talents.length); ++i) {
    const s1 = characterFull.advancedSkills[i];
    const s2 = characterFull.talents[i];

    if (s1) {
      csv += csvStr(s1.name) + "," + s1.attributeName + ",";
      csv += s1.attributeValue + "," + s1.advances + "," + s1.skill + ",";
    } else {
      csv += ",,,,,";
    }

    if (s2) {
      csv += csvStr(s2.name) + "," + s2.rank + ",,,,\n";
    } else {
      csv += ",,,,,\n";
    }
  }

  csv += ",,,,,,,,,,\n";
  csv += "Equipped Armor,,,,,,,,,,\n";
  csv += "Name,Group,Locations,Enc,AP,Qualities,Number,,,,\n";

  for (const armour of characterFull.equippedArmor) {
    csv += csvStr(armour.name) + "," + csvStr(armour.locations?.join(", ")) + "," + armour.enc + ",";
    csv += armour.ap + "," + csvStr(armour.qualitiesFlawsRunes.join(", ")) + "," + armour.number + ",,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Equipped Weapons,,,,,,,,,,\n";
  csv += "Name,Group,Enc,Range/Reach,Damage,Qualities,Number,,,,\n";

  for (const weapon of characterFull.equippedWeapon) {
    csv += csvStr(weapon.name) + "," + weapon.group + "," + weapon.enc + "," + weapon.rng + ",";
    csv += weapon.dmg + "," + csvStr(weapon.qualitiesFlawsRunes.join(", ")) + "," + weapon.number + ",,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Other Equipped,,,,,,,,,,\n";
  csv += "Name,Enc,Number,Description,,,,,,,\n";

  for (const item of characterFull.equippedOther) {
    csv += csvStr(item.name) + "," + item.enc + "," + item.number + "," + csvStr(item.description) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Carried,,,,,,,,,,\n";
  csv += "Name,Enc,Number,Description,,,,,,,\n";

  for (const item of characterFull.carried) {
    csv += csvStr(item.name) + "," + item.enc + "," + item.number + "," + csvStr(item.description) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Encumbrance,,,,,,,,,,\n";
  csv += "Armor,Weapon,Other,Carried,,,,,,,\n";
  csv +=
    characterFull.encArmor +
    "," +
    characterFull.encWeapon +
    "," +
    characterFull.encOther +
    "," +
    characterFull.encCarried +
    ",";
  csv += ",,,,,,\n";

  csv += ",,,,,,,,,,\n";
  csv += "Stored,,,,,,,,,,\n";
  csv += "Name,Number,Description,,,,,,,\n";
  for (const item of characterFull.stored) {
    csv += csvStr(item.name) + "," + item.number + "," + csvStr(item.description) + ",,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Mutations,,,,,,,,,,\n";
  csv += "Name,Type,Description,,,,,,,,\n";

  for (const item of characterFull.mutations) {
    csv += csvStr(item.name) + "," + item.type + "," + csvStr(item.description) + ",,,,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Known Spells,,,,,,,,,,\n";
  csv += "Name,CN,Range,Target,Duration,,,,,,\n";

  for (const item of characterFull.spells) {
    csv += csvStr(item.name) + "," + item.cn + "," + csvStr(item.range) + ",";
    csv += csvStr(item.target) + "," + csvStr(item.duration) + ",,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Known Prayers,,,,,,,,,,\n";
  csv += "Name,Range,Target,Duration,,,,,,\n";

  for (const item of characterFull.prayers) {
    csv += csvStr(item.name) + "," + csvStr(item.range) + ",";
    csv += csvStr(item.target) + "," + csvStr(item.duration) + ",,,,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Spells in Grimoires,,,,,,,,,,\n";
  for (const item of [...characterFull.carried, ...characterFull.stored]) {
    if (item.spells) {
      csv += item.name + ",,,,,,,,,\n";
      csv += "Name,CN,Range,Target,Duration,,,,,,\n";
      for (const spell of item.spells) {
        csv += csvStr(spell.name) + "," + spell.cn + "," + csvStr(spell.range) + ",";
        csv += csvStr(spell.target) + "," + csvStr(spell.duration) + ",,,,,,\n";
      }
    }
  }
  return csv;
}

function csvStr(stringValue: string | undefined): string {
  if (typeof stringValue === "undefined") {
    return "";
  } else {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }
}
