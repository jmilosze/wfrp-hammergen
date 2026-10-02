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
import { ApiResponse, CharacterApiResponse, Edition, variant, Visibility } from "./common.ts";
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
import { TraitApiData } from "./trait.ts";
import { RuneApiData } from "./rune.ts";
import { printWithValue } from "../../utils/idValue.ts";

export interface ItemFullApiData {
  name: string;
  description: string;
  price: number;
  enc: number;
  availability: Availability;
  properties: WhValue<ItemPropertyApiData>[];
  runes: WhNumber<RuneApiData>[];
  type: ItemType;
  melee: MeleeType;
  ranged: RangedType;
  ammunition: AmmoType;
  armour: ArmourType;
  grimoire: { spells: ApiResponse<SpellApiData>[] };
  container: ContainerType;
  other: OtherType;
  source: Source;
}

export interface WhNumber<WhApiData> {
  wh: ApiResponse<WhApiData>;
  number: number;
}

export interface WhValue<WhApiData> {
  wh: ApiResponse<WhApiData>;
  value: string;
}

export interface CharacterFullApiData {
  edition: Edition;
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
  traits: WhValue<TraitApiData>[];
  mutations: ApiResponse<MutationApiData>[];
  careerPath: WhNumber<CareerApiData>[];
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
  id: string;
  name: string;
  range: string;
  target: string;
  duration: string;
  description: string;
  cn: number;
}

export interface CharacterFullPrayer {
  id: string;
  name: string;
  range: string;
  target: string;
  duration: string;
  description: string;
}

export interface CharacterFullTrait {
  id: string;
  name: string;
  description: string;
}

export interface CharacterFullMutation {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface CharacterFullItemProperty {
  id: string;
  name: string;
}

export interface CharacterFullRune {
  id: string;
  name: string;
  number: number;
}

export interface CharacterFullItem {
  id: string;
  name: string;
  enc: number;
  qualitiesFlaws: CharacterFullItemProperty[];
  runes: CharacterFullRune[];
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
  ownerId: string;
  visibility: Visibility;
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
  traits: CharacterFullTrait[];
  mutations: CharacterFullMutation[];

  encWeapon: number;
  encArmor: number;
  encOther: number;
  encCarried: number;
}

export function newCharacterFull({
  id = "",
  ownerId = "",
  visibility = Visibility.Private,
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
  traits = [] as CharacterFullTrait[],
  mutations = [] as CharacterFullMutation[],
  encWeapon = 0,
  encArmor = 0,
  encOther = 0,
  encCarried = 0,
} = {}): CharacterFull {
  return {
    id: id,
    ownerId: ownerId,
    visibility: visibility,
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
    traits: traits,
    mutations: mutations,
    encWeapon: encWeapon,
    encArmor: encArmor,
    encOther: encOther,
    encCarried: encCarried,
  };
}

export function apiResponseToCharacterFull(
  fullCharacterApi: CharacterApiResponse<CharacterFullApiData>,
): CharacterFull {
  // Referenced content is resolved in the character's edition.
  const e = fullCharacterApi.object.edition;
  // A trait that takes a value can be on the character more than once; its modifiers count once.
  const uniqueTraits = [...new Map(fullCharacterApi.object.traits.map((x) => [x.wh.id, x.wh])).values()];
  const mutationAttributes: Attributes = fullCharacterApi.object.mutations.reduce(
    (a, v) => sumAttributes(a, variant(v, e).modifiers.attributes),
    getAttributes(),
  );

  const traitAttributes: Attributes = uniqueTraits.reduce(
    (a, v) => sumAttributes(a, variant(v, e).modifiers.attributes),
    getAttributes(),
  );

  const talentAttributes: Attributes = fullCharacterApi.object.talents.reduce(
    (a, v) => sumAttributes(a, multiplyAttributes(v.number, variant(v.wh, e).modifiers.attributes)),
    getAttributes(),
  );

  const otherAttributes = sumAttributes(mutationAttributes, traitAttributes, talentAttributes);

  const attributes = sumAttributes(
    fullCharacterApi.object.baseAttributes,
    fullCharacterApi.object.attributeAdvances,
    otherAttributes,
  );

  const sizeModifier: number =
    fullCharacterApi.object.mutations.reduce((a, v) => a + variant(v, e).modifiers.size, 0) +
    uniqueTraits.reduce((a, v) => a + variant(v, e).modifiers.size, 0) +
    fullCharacterApi.object.talents.reduce((a, v) => a + v.number * variant(v.wh, e).modifiers.size, 0);
  const movementModifier =
    fullCharacterApi.object.mutations.reduce((a, v) => a + variant(v, e).modifiers.movement, 0) +
    uniqueTraits.reduce((a, v) => a + variant(v, e).modifiers.movement, 0) +
    fullCharacterApi.object.talents.reduce((a, v) => a + v.number * variant(v.wh, e).modifiers.movement, 0);

  const size = getSizeFormula(sizeModifier);

  const hardyRanks =
    fullCharacterApi.object.mutations.reduce(
      (a, v) => a + (variant(v, e).modifiers.effects.includes(ModifierEffect.Hardy) ? 1 : 0),
      0,
    ) +
    uniqueTraits.reduce((a, v) => a + (variant(v, e).modifiers.effects.includes(ModifierEffect.Hardy) ? 1 : 0), 0) +
    fullCharacterApi.object.talents.reduce(
      (a, v) => a + v.number * (variant(v.wh, e).modifiers.effects.includes(ModifierEffect.Hardy) ? 1 : 0),
      0,
    );

  const [basicSkills, advancedSkills] = getSkills(e, fullCharacterApi.object.skills, attributes);

  const equippedArmor = fullCharacterApi.object.equippedItems.filter((x) => variant(x.wh, e).type === ItemType.Armour);
  const equippedWeapon = fullCharacterApi.object.equippedItems.filter((x) =>
    [ItemType.Melee, ItemType.Ranged, ItemType.Ammunition].includes(variant(x.wh, e).type),
  );
  const equippedOther = fullCharacterApi.object.equippedItems.filter((x) =>
    [ItemType.Container, ItemType.Other].includes(variant(x.wh, e).type),
  );

  return {
    id: fullCharacterApi.id,
    ownerId: fullCharacterApi.ownerId,
    visibility: fullCharacterApi.visibility ?? Visibility.Private,
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
      name: getCareerName(e, fullCharacterApi.object.career),
      levelName: getCareerLevel(e, fullCharacterApi.object.career),
      className: printClassName(variant(fullCharacterApi.object.career.wh, e).class),
    },
    pastCareers: fullCharacterApi.object.careerPath.map((x) => ({
      id: x.wh.id,
      name: getCareerName(e, x),
      levelName: getCareerLevel(e, x),
      className: printClassName(variant(x.wh, e).class),
    })),

    baseAttributes: fullCharacterApi.object.baseAttributes,
    attributeAdvances: fullCharacterApi.object.attributeAdvances,
    otherAttributes: otherAttributes,
    attributes: attributes,

    movement: getMovementFormula(fullCharacterApi.object.species, movementModifier),
    walk: 2 * getMovementFormula(fullCharacterApi.object.species, movementModifier),
    run: 4 * getMovementFormula(fullCharacterApi.object.species, movementModifier),
    wounds: getWoundsFormula(size, attributes.T, attributes.WP, attributes.S, hardyRanks),

    talents: fullCharacterApi.object.talents.map((x) => ({ id: x.wh.id, name: variant(x.wh, e).name, rank: x.number })),
    basicSkills: basicSkills,
    advancedSkills: advancedSkills,

    equippedArmor: getItems(e, equippedArmor, attributes),
    equippedWeapon: getItems(e, equippedWeapon, attributes),
    equippedOther: getItems(e, equippedOther, attributes),
    carried: getItems(e, fullCharacterApi.object.carriedItems, attributes),
    stored: getItems(e, fullCharacterApi.object.storedItems, attributes),

    spells: getSpells(e, fullCharacterApi.object.spells),
    prayers: getPrayers(e, fullCharacterApi.object.prayers),
    traits: getTraits(e, fullCharacterApi.object.traits),
    mutations: getMutations(e, fullCharacterApi.object.mutations),

    encWeapon: equippedWeapon.map((x) => variant(x.wh, e).enc * x.number).reduce((x, y) => x + y, 0),
    encArmor: equippedArmor
      .map((x) => (variant(x.wh, e).enc > 0 ? variant(x.wh, e).enc - 1 : 0) * x.number)
      .reduce((x, y) => x + y, 0),
    encOther: equippedOther
      .map((x) => (variant(x.wh, e).enc > 0 ? variant(x.wh, e).enc - 1 : 0) * x.number)
      .reduce((x, y) => x + y, 0),
    encCarried: fullCharacterApi.object.carriedItems.map((x) => variant(x.wh, e).enc).reduce((x, y) => x + y, 0),
  };
}

function getCareerName(e: Edition, career: WhNumber<CareerApiData>): string {
  return `${variant(career.wh, e).name} ${career.number}`;
}

function getCareerLevel(e: Edition, career: WhNumber<CareerApiData>): string {
  switch (career.number) {
    case 1:
      return variant(career.wh, e).level1.name;
    case 2:
      return variant(career.wh, e).level2.name;
    case 3:
      return variant(career.wh, e).level3.name;
    case 4:
      return variant(career.wh, e).level4.name;
    default:
      return "";
  }
}

function getSkills(e: Edition, characterSkills: WhNumber<SkillApiData>[], attributes: Attributes) {
  const basicSkills = [] as CharacterFullSkill[];
  const advancedSkills = [] as CharacterFullSkill[];

  for (const skill of characterSkills) {
    const formattedSkill = skillForDisplay(e, skill.wh, skill.number, attributes);
    if (variant(skill.wh, e).type === 0) {
      basicSkills.push(formattedSkill);
    } else {
      advancedSkills.push(formattedSkill);
    }
  }

  return [basicSkills.sort(sortByName), advancedSkills.sort(sortByName)];
}

function skillForDisplay(
  e: Edition,
  rawSkill: ApiResponse<SkillApiData>,
  skillRank: number,
  attributes: Attributes,
): CharacterFullSkill {
  return {
    id: rawSkill.id,
    name: variant(rawSkill, e).isGroup ? `${variant(rawSkill, e).name} (Any)` : variant(rawSkill, e).name,
    attributeName: printAttributeName(variant(rawSkill, e).attribute),
    attributeValue: getAttributeValue(variant(rawSkill, e).attribute, attributes),
    advances: skillRank,
    skill: getAttributeValue(variant(rawSkill, e).attribute, attributes) + skillRank,
  };
}

function sortByName(x: { name: string }, y: { name: string }): -1 | 0 | 1 {
  return x.name === y.name ? 0 : x.name < y.name ? -1 : 1;
}

function getItems(
  e: Edition,
  characterItems: WhNumber<ItemFullApiData>[],
  attributes: Attributes,
): CharacterFullItem[] {
  const SB = Math.floor(attributes.S / 10);
  const items = [] as CharacterFullItem[];

  for (const charItem of characterItems) {
    const item = {
      id: charItem.wh.id,
      name: variant(charItem.wh, e).name,
      enc: variant(charItem.wh, e).enc,
      qualitiesFlaws: variant(charItem.wh, e).properties.map((x) => ({
        name: printWithValue(variant(x.wh, e).name, variant(x.wh, e).hasValue, x.value),
        id: x.wh.id,
      })),
      runes: variant(charItem.wh, e).runes.map((x) => ({ name: variant(x.wh, e).name, id: x.wh.id, number: x.number })),
      number: charItem.number,
      description: variant(charItem.wh, e).description,
      type: printItemType(variant(charItem.wh, e).type),
    } as CharacterFullItem;

    if (variant(charItem.wh, e).type === ItemType.Melee) {
      item.group = printMeleeGroup(variant(charItem.wh, e).melee.group);
      item.rng = printMeleeReach(variant(charItem.wh, e).melee.reach);
      item.dmg = (variant(charItem.wh, e).melee.dmg + variant(charItem.wh, e).melee.dmgSbMult * SB).toString();
    } else if (variant(charItem.wh, e).type === ItemType.Ranged) {
      item.group = printRangedGroup(variant(charItem.wh, e).ranged.group);
      item.rng = (variant(charItem.wh, e).ranged.rng + variant(charItem.wh, e).ranged.rngSbMult * SB).toString();
      item.dmg = (variant(charItem.wh, e).ranged.dmg + variant(charItem.wh, e).ranged.dmgSbMult * SB).toString();
    } else if (variant(charItem.wh, e).type === ItemType.Ammunition) {
      let range =
        variant(charItem.wh, e).ammunition.rngMult !== 1
          ? `Weapon x${variant(charItem.wh, e).ammunition.rngMult}`
          : "Weapon";
      if (variant(charItem.wh, e).ammunition.rng > 0) {
        range += `+${variant(charItem.wh, e).ammunition.rng.toString()}`;
      } else if (variant(charItem.wh, e).ammunition.rng < 0) {
        range += `${variant(charItem.wh, e).ammunition.rng.toString()}`;
      }

      let damage = "Weapon";
      if (variant(charItem.wh, e).ammunition.dmg > 0) {
        damage += `+${variant(charItem.wh, e).ammunition.dmg.toString()}`;
      } else if (variant(charItem.wh, e).ammunition.rng < 0) {
        damage += `${variant(charItem.wh, e).ammunition.dmg.toString()}`;
      }

      item.group = printAmmoGroup(variant(charItem.wh, e).ammunition.group);
      item.rng = range;
      item.dmg = damage;
    } else if (variant(charItem.wh, e).type === ItemType.Armour) {
      item.group = printArmourGroup(variant(charItem.wh, e).armour.group);
      item.locations = variant(charItem.wh, e).armour.location.map((x) => printArmourLocation(x));
      item.ap = variant(charItem.wh, e).armour.points;
    } else if (variant(charItem.wh, e).type === ItemType.Grimoire) {
      item.spells = getSpells(e, variant(charItem.wh, e).grimoire.spells);
    } else {
      item.description =
        (variant(charItem.wh, e).type === ItemType.Container
          ? `(Capacity ${variant(charItem.wh, e).container.capacity}) `
          : "") + variant(charItem.wh, e).description;
    }
    items.push(item);
  }

  return items;
}

function getSpells(e: Edition, spells: ApiResponse<SpellApiData>[]): CharacterFullSpell[] {
  return spells.map((x) => ({
    id: x.id,
    name: variant(x, e).name,
    range: variant(x, e).range,
    target: variant(x, e).target,
    duration: variant(x, e).duration,
    description: variant(x, e).description,
    cn: variant(x, e).cn,
  }));
}

function getPrayers(e: Edition, prayers: ApiResponse<PrayerApiData>[]): CharacterFullPrayer[] {
  return prayers.map((x) => ({
    id: x.id,
    name: variant(x, e).name,
    range: variant(x, e).range,
    target: variant(x, e).target,
    duration: variant(x, e).duration,
    description: variant(x, e).description,
  }));
}

function getTraits(e: Edition, traits: WhValue<TraitApiData>[]): CharacterFullTrait[] {
  return traits.map((x) => ({
    id: x.wh.id,
    name: printWithValue(variant(x.wh, e).name, variant(x.wh, e).hasValue, x.value),
    description: variant(x.wh, e).description,
  }));
}

function getMutations(e: Edition, mutations: ApiResponse<MutationApiData>[]): CharacterFullMutation[] {
  return mutations.map((x) => {
    return {
      id: x.id,
      name: variant(x, e).name,
      type: printMutationType(variant(x, e).type),
      description: variant(x, e).description,
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
  csv += "Name,Group,Locations,Enc,AP,Qualities,Runes,Number,,,\n";

  for (const armour of characterFull.equippedArmor) {
    csv += csvStr(armour.name) + "," + csvStr(armour.locations?.join(", ")) + "," + armour.enc + ",";
    csv +=
      armour.ap +
      "," +
      csvStr(armour.qualitiesFlaws.map((x) => x.name).join(", ")) +
      "," +
      csvStr(armour.runes.map((x) => x.name + `(x${x.number})`).join(", ")) +
      "," +
      armour.number +
      ",,,,\n";
  }

  csv += ",,,,,,,,,,\n";
  csv += "Equipped Weapons,,,,,,,,,,\n";
  csv += "Name,Group,Enc,Range/Reach,Damage,Qualities,Runes,Number,,,\n";

  for (const weapon of characterFull.equippedWeapon) {
    csv += csvStr(weapon.name) + "," + weapon.group + "," + weapon.enc + "," + weapon.rng + ",";
    csv +=
      weapon.dmg +
      "," +
      csvStr(weapon.qualitiesFlaws.map((x) => x.name).join(", ")) +
      "," +
      csvStr(weapon.runes.map((x) => x.name + `(x${x.number})`).join(", ")) +
      "," +
      weapon.number +
      ",,,\n";
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
  csv += "Traits,,,,,,,,,,\n";
  csv += "Name,Description,,,,,,,,,\n";

  for (const item of characterFull.traits) {
    csv += csvStr(item.name) + "," + csvStr(item.description) + ",,,,,,,,,\n";
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
