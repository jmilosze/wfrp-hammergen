import {
  DEFAULT_SIZE,
  getMovementFormula,
  getWoundsFormula,
  printSpecies,
  SpeciesWithRegion,
} from "./characterUtils.ts";
import { CareerApiData, printClassName, printStatusTier, StatusStanding, StatusTier } from "./career.ts";
import { Attributes, getAttributeValue, printAttributeName, sumAttributes } from "./attributes.ts";
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
  printItemType,
  RangedType,
} from "./item.ts";
import { SpellApiData } from "./spell.ts";
import { PrayerApiData } from "./prayer.ts";
import { MutationApiData } from "./mutation.ts";
import { CharacterModifiers } from "./characterModifiers.ts";
import { Source } from "./source.ts";
import { ItemPropertyApiData } from "./itemproperty.ts";

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
  career: { number: number; wh: ApiResponse<CareerApiData> };
  skills: { number: number; wh: ApiResponse<SkillApiData> }[];
  talents: { number: number; wh: ApiResponse<TalentApiData> }[];
  equippedItems: { number: number; wh: ApiResponse<ItemFullApiData> }[];
  carriedItems: { number: number; wh: ApiResponse<ItemFullApiData> }[];
  storedItems: { number: number; wh: ApiResponse<ItemFullApiData> }[];
  spells: ApiResponse<SpellApiData>[];
  prayers: ApiResponse<PrayerApiData>[];
  mutations: ApiResponse<MutationApiData>[];
  careerPath: { number: number; wh: ApiResponse<CareerApiData> }[];
  shared: boolean;
}

export interface CharacterFullTalent {
  name: string;
  rank: number;
}

export interface CharacterFullSkill {
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
  name: string;
  enc: number;
  qualitiesFlawsRunes: string[];
  number: number;
  description: string;
  type: string;

  group?: string;
  rng?: string | number;
  dmg?: number;
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
  status: string;
  standing: StatusStanding;

  careerName: string;
  careerLevelName: string;
  className: string;
  pastCareers: string[];

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

export function apiResponseToFullCharacter(fullCharacterApi: ApiResponse<CharacterFullApiData>): CharacterFull {
  const totalModifiers = new CharacterModifiers();
  const mutationModifiers = fullCharacterApi.object.mutations.map((x) => x.object.modifiers);
  const talentModifiers = fullCharacterApi.object.talents.map((x) => x.wh.object.modifiers);
  totalModifiers.add(...mutationModifiers, ...talentModifiers);

  const otherAttributes = totalModifiers.attributes;
  const attributes = sumAttributes(
    fullCharacterApi.object.baseAttributes,
    fullCharacterApi.object.attributeAdvances,
    totalModifiers.attributes,
  );

  const sizeModifier = totalModifiers.size;
  const movementModifier = totalModifiers.movement;

  const [basicSkills, advancedSkills] = getSkills(fullCharacterApi.object.skills, attributes);

  return {
    id: fullCharacterApi.id,
    canEdit: fullCharacterApi.canEdit,
    shared: fullCharacterApi.object.shared,
    name: fullCharacterApi.object.name,
    description: fullCharacterApi.object.description,
    notes: fullCharacterApi.object.description,
    species: printSpecies(fullCharacterApi.object.species),
    fate: fullCharacterApi.object.fate,
    fortune: fullCharacterApi.object.fortune,
    resilience: fullCharacterApi.object.resilience,
    resolve: fullCharacterApi.object.resolve,
    brass: fullCharacterApi.object.brass,
    silver: fullCharacterApi.object.silver,
    gold: fullCharacterApi.object.gold,
    spentExp: fullCharacterApi.object.spentExp,
    currentExp: fullCharacterApi.object.currentExp,
    sin: fullCharacterApi.object.sin,
    corruption: fullCharacterApi.object.corruption,
    status: printStatusTier(fullCharacterApi.object.status),
    standing: fullCharacterApi.object.standing,

    careerName: getCareerName(fullCharacterApi.object.career),
    careerLevelName: getCareerLevel(fullCharacterApi.object.career),
    className: printClassName(fullCharacterApi.object.career.wh.object.class),
    pastCareers: fullCharacterApi.object.careerPath.map((x) => `${getCareerName(x)}`),

    baseAttributes: fullCharacterApi.object.baseAttributes,
    attributeAdvances: fullCharacterApi.object.attributeAdvances,
    otherAttributes: otherAttributes,
    attributes: attributes,

    movement: getMovementFormula(fullCharacterApi.object.species) + movementModifier,
    walk: 2 * (getMovementFormula(fullCharacterApi.object.species) + movementModifier),
    run: 4 * (getMovementFormula(fullCharacterApi.object.species) + movementModifier),
    wounds: getWoundsFormula(DEFAULT_SIZE + sizeModifier, attributes.T, attributes.WP, attributes.S),

    talents: fullCharacterApi.object.talents.map((x) => ({ name: x.wh.object.name, rank: x.number })),
    basicSkills: basicSkills,
    advancedSkills: advancedSkills,
  };
}

function getCareerName(career: { number: number; wh: ApiResponse<CareerApiData> }): string {
  return `${career.wh.object.name} ${career.number}`;
}

function getCareerLevel(career: { number: number; wh: ApiResponse<CareerApiData> }): string {
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

function getSkills(characterSkills: { number: number; wh: ApiResponse<SkillApiData> }[], attributes: Attributes) {
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

function getItems(characterItems: { number: number; wh: ApiResponse<ItemFullApiData> }[], attributes: Attributes) {
  const SB = Math.floor(attributes.S / 10);
  const items = [] as CharacterFullItem[];

  for (const charItem of characterItems) {
    const item = {
      name: charItem.wh.object.name,
      enc: charItem.wh.object.enc,
      qualitiesFlawsRunes: charItem.wh.object.properties.map((x) => x.object.name),
      number: charItem.number,
      description: charItem.wh.object.description,
      type: printItemType(charItem.wh.object.type),
    } as CharacterFullItem;

    if (charItem.wh.object.type === ItemType.Melee) {
      item.group = meleeGroups[charItem.wh.object.melee.group];
      item.rng = meleeReach[charItem.wh.object.melee.reach];
      item.dmg = charItem.wh.object.melee.dmg + charItem.wh.object.melee.dmgSbMult * SB;
    } else if (charItem.wh.object.type === 1) {
      item.group = rangedGroups[charItem.wh.object.ranged.group];
      item.rng = charItem.wh.object.ranged.rng + charItem.wh.object.ranged.rngSbMult * SB;
      item.dmg = charItem.wh.object.ranged.dmg + charItem.wh.object.ranged.dmgSbMult * SB;
    } else if (charItem.wh.object.type === 2) {
      let range =
        charItem.wh.object.ammunition.rngMult !== 1 ? `Weapon x${charItem.wh.object.ammunition.rngMult}` : "Weapon";
      if (charItem.wh.object.ammunition.rng > 0) {
        range += `+${parseInt(charItem.wh.object.ammunition.rng)}`;
      } else if (charItem.wh.object.ammunition.rng < 0) {
        range += `${parseInt(charItem.wh.object.ammunition.rng)}`;
      }

      let damage = "Weapon";
      if (charItem.wh.object.ammunition.dmg > 0) {
        damage += `+${parseInt(charItem.wh.object.ammunition.dmg)}`;
      } else if (charItem.wh.object.ammunition.rng < 0) {
        damage += `${parseInt(charItem.wh.object.ammunition.dmg)}`;
      }

      item.group = ammunitionGroups[charItem.wh.object.ammunition.group];
      item.rng = range;
      item.dmg = damage;
    } else if (charItem.wh.object.type === 3) {
      item.group = armorGroups[charItem.wh.object.armour.group];
      item.locations = charItem.wh.object.armour.location.map((x) => armorLocations[x]);
      item.ap = charItem.wh.object.armour.points;
    } else if (charItem.wh.object.type === 6) {
      item.spells = formatSpells(charItem.wh.object.grimoire.spells);
    } else {
      item.desc =
        (charItem.wh.object.type === 4 ? `(Capacity ${charItem.wh.object.container.capacity}) ` : "") +
        charItem.wh.object.description;
    }
    items.push(item);
  }

  return items;
}
