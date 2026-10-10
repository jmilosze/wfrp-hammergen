import { printSize } from "./size.ts";
import { printSpeciesWithRegion, SpeciesWithRegion } from "../core/species.ts";
import { rulesFor } from "./rules/rules.ts";
import { CareerApiData, printClassName, printStatusTier, StatusStanding, StatusTier } from "../content/career.ts";
import {
  Attributes,
  getAttributeValue,
  multiplyAttributes,
  printAttributeName,
  sumAttributes,
  zeroAttributes,
} from "../core/attributes.ts";
import { ApiResponse, CharacterApiResponse } from "../core/api.ts";
import { contentEdition, Edition, variant, variantFor, with4eMark } from "../core/edition.ts";
import { Visibility } from "../core/entity.ts";
import { SkillApiData } from "../content/skill.ts";
import { TalentApiData } from "../content/talent.ts";
import {
  AmmoType,
  ArmourType,
  Availability,
  ContainerType,
  ItemType,
  MeleeType,
  OtherType,
  printAmmoGroup,
  ArmourGroup,
  printArmourGroup,
  printArmourLocation,
  printItemType,
  printMeleeGroup,
  printMeleeReach,
  printRangedGroup,
  RangedType,
} from "../content/item.ts";
import { SpellApiData } from "../content/spell.ts";
import { PrayerApiData } from "../content/prayer.ts";
import { MutationApiData, printMutationType } from "../content/mutation.ts";
import { Source } from "../core/source.ts";
import { ItemPropertyApiData } from "../content/itemproperty.ts";
import { CharacterModifiersData, hasModifiers, ModifierEffect } from "../core/characterModifiers.ts";
import { TraitApiData } from "../content/trait.ts";
import { RuneApiData } from "../content/rune.ts";
import { printWithValue } from "../../../utils/idValue.ts";

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
  careerTicks: number;
  allow4e: boolean;
  sin: number;
  corruption: number;
  status: StatusTier;
  standing: StatusStanding;
  baseAttributes: Attributes;
  attributeAdvances: Attributes;
  // Absent when the character has no current career.
  career?: WhNumber<CareerApiData>;
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
  edition: Edition;
  allow4e: boolean;
  // Names of 4e talents, traits and mutations whose modifiers are not applied (shown as a warning).
  ignored4eModifiers: string[];
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
  careerTicks: number;
  sin: number;
  corruption: number;
  status: string;
  standing: StatusStanding;

  currentCareer: CharacterFullCareer | undefined;
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
  // Language skills (also in basic/advanced skills); the 5e sheet shows them as Known Languages.
  languageSkills: CharacterFullSkill[];

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
  edition = "4e" as Edition,
  allow4e = false,
  ignored4eModifiers = [] as string[],
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
  careerTicks = 0,
  sin = 0,
  corruption = 0,
  status = printStatusTier(StatusTier.Brass),
  standing = 0 as StatusStanding,
  currentCareer = undefined as CharacterFullCareer | undefined,
  pastCareers = [] as CharacterFullCareer[],
  baseAttributes = zeroAttributes(),
  attributeAdvances = zeroAttributes(),
  otherAttributes = zeroAttributes(),
  attributes = zeroAttributes(),
  movement = 0,
  walk = 0,
  run = 0,
  wounds = 0,
  talents = [] as CharacterFullTalent[],
  basicSkills = [] as CharacterFullSkill[],
  advancedSkills = [] as CharacterFullSkill[],
  languageSkills = [] as CharacterFullSkill[],
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
    edition: edition,
    allow4e: allow4e,
    ignored4eModifiers: ignored4eModifiers,
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
    careerTicks: careerTicks,
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
    languageSkills: languageSkills,
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
  // Modifiers of 4e talents, traits and mutations on a 5e character are not applied; 4e trappings count fully.
  const modTalents = fullCharacterApi.object.talents.filter((x) => contentEdition(x.wh, e) === e);
  const modTraits = uniqueTraits.filter((x) => contentEdition(x, e) === e);
  const modMutations = fullCharacterApi.object.mutations.filter((x) => contentEdition(x, e) === e);
  const ignored4eModifiers = [
    ...namesWithIgnoredModifiers(
      e,
      fullCharacterApi.object.talents.map((x) => x.wh),
    ),
    ...namesWithIgnoredModifiers(e, uniqueTraits),
    ...namesWithIgnoredModifiers(e, fullCharacterApi.object.mutations),
  ];
  const mutationAttributes: Attributes = modMutations.reduce(
    (a, v) => sumAttributes(a, variantFor(v, e).modifiers.attributes),
    zeroAttributes(),
  );

  const traitAttributes: Attributes = modTraits.reduce(
    (a, v) => sumAttributes(a, variantFor(v, e).modifiers.attributes),
    zeroAttributes(),
  );

  const talentAttributes: Attributes = modTalents.reduce(
    (a, v) => sumAttributes(a, multiplyAttributes(v.number, variantFor(v.wh, e).modifiers.attributes)),
    zeroAttributes(),
  );

  const otherAttributes = sumAttributes(mutationAttributes, traitAttributes, talentAttributes);

  const attributes = sumAttributes(
    fullCharacterApi.object.baseAttributes,
    fullCharacterApi.object.attributeAdvances,
    otherAttributes,
  );

  const sizeModifier: number =
    modMutations.reduce((a, v) => a + variantFor(v, e).modifiers.size, 0) +
    modTraits.reduce((a, v) => a + variantFor(v, e).modifiers.size, 0) +
    modTalents.reduce((a, v) => a + v.number * variantFor(v.wh, e).modifiers.size, 0);
  const movementModifier =
    modMutations.reduce((a, v) => a + variantFor(v, e).modifiers.movement, 0) +
    modTraits.reduce((a, v) => a + variantFor(v, e).modifiers.movement, 0) +
    modTalents.reduce((a, v) => a + v.number * variantFor(v.wh, e).modifiers.movement, 0);

  const rules = rulesFor(e);
  const size = rules.getSize(sizeModifier);

  const hardyRanks =
    modMutations.reduce((a, v) => a + (variantFor(v, e).modifiers.effects.includes(ModifierEffect.Hardy) ? 1 : 0), 0) +
    modTraits.reduce((a, v) => a + (variantFor(v, e).modifiers.effects.includes(ModifierEffect.Hardy) ? 1 : 0), 0) +
    modTalents.reduce(
      (a, v) => a + v.number * (variantFor(v.wh, e).modifiers.effects.includes(ModifierEffect.Hardy) ? 1 : 0),
      0,
    );

  const [basicSkills, advancedSkills] = getSkills(e, fullCharacterApi.object.skills, attributes);
  const languageSkills = getLanguageSkills(e, fullCharacterApi.object.skills, attributes);

  const equippedArmor = fullCharacterApi.object.equippedItems.filter(
    (x) => variantFor(x.wh, e).type === ItemType.Armour,
  );
  const equippedWeapon = fullCharacterApi.object.equippedItems.filter((x) =>
    [ItemType.Melee, ItemType.Ranged, ItemType.Ammunition].includes(variantFor(x.wh, e).type),
  );
  const equippedOther = fullCharacterApi.object.equippedItems.filter((x) =>
    [ItemType.Container, ItemType.Other].includes(variantFor(x.wh, e).type),
  );

  return {
    id: fullCharacterApi.id,
    ownerId: fullCharacterApi.ownerId,
    edition: e,
    allow4e: fullCharacterApi.object.allow4e,
    ignored4eModifiers: ignored4eModifiers,
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
    careerTicks: fullCharacterApi.object.careerTicks,
    sin: fullCharacterApi.object.sin,
    corruption: fullCharacterApi.object.corruption,
    status: printStatusTier(fullCharacterApi.object.status),
    standing: fullCharacterApi.object.standing,

    currentCareer: fullCharacterApi.object.career ? getFullCareer(e, fullCharacterApi.object.career) : undefined,
    pastCareers: fullCharacterApi.object.careerPath.map((x) => getFullCareer(e, x)),

    baseAttributes: fullCharacterApi.object.baseAttributes,
    attributeAdvances: fullCharacterApi.object.attributeAdvances,
    otherAttributes: otherAttributes,
    attributes: attributes,

    movement: rules.getMovement(fullCharacterApi.object.species, movementModifier),
    walk: 2 * rules.getMovement(fullCharacterApi.object.species, movementModifier),
    run: 4 * rules.getMovement(fullCharacterApi.object.species, movementModifier),
    wounds: rules.getWounds(size, attributes.T, attributes.WP, attributes.S, hardyRanks),

    talents: fullCharacterApi.object.talents.map((x) => ({
      id: x.wh.id,
      name: with4eMark(x.wh, e, variantFor(x.wh, e).name),
      rank: x.number,
    })),
    basicSkills: basicSkills,
    advancedSkills: advancedSkills,
    languageSkills: languageSkills,

    equippedArmor: getItems(e, equippedArmor, attributes),
    equippedWeapon: getItems(e, equippedWeapon, attributes),
    equippedOther: getItems(e, equippedOther, attributes),
    carried: getItems(e, fullCharacterApi.object.carriedItems, attributes),
    stored: getItems(e, fullCharacterApi.object.storedItems, attributes),

    spells: getSpells(e, fullCharacterApi.object.spells),
    prayers: getPrayers(e, fullCharacterApi.object.prayers),
    traits: getTraits(e, fullCharacterApi.object.traits),
    mutations: getMutations(e, fullCharacterApi.object.mutations),

    encWeapon: equippedWeapon.map((x) => variantFor(x.wh, e).enc * x.number).reduce((x, y) => x + y, 0),
    encArmor: equippedArmor
      .map((x) => (variantFor(x.wh, e).enc > 0 ? variantFor(x.wh, e).enc - 1 : 0) * x.number)
      .reduce((x, y) => x + y, 0),
    encOther: equippedOther
      .map((x) => (variantFor(x.wh, e).enc > 0 ? variantFor(x.wh, e).enc - 1 : 0) * x.number)
      .reduce((x, y) => x + y, 0),
    encCarried: fullCharacterApi.object.carriedItems.map((x) => variantFor(x.wh, e).enc).reduce((x, y) => x + y, 0),
  };
}

// namesWithIgnoredModifiers returns the names of 4e content (on a 5e character) whose modifiers are not applied.
function namesWithIgnoredModifiers<T extends { name: string; modifiers: CharacterModifiersData }>(
  e: Edition,
  docs: ApiResponse<T>[],
): string[] {
  return docs
    .filter((x) => contentEdition(x, e) !== e && hasModifiers(variantFor(x, e).modifiers))
    .map((x) => variantFor(x, e).name);
}

function getFullCareer(e: Edition, career: WhNumber<CareerApiData>): CharacterFullCareer {
  return {
    id: career.wh.id,
    name: getCareerName(e, career),
    levelName: getCareerLevel(e, career),
    className: printClassName(variantFor(career.wh, e).class),
  };
}

function getCareerName(e: Edition, career: WhNumber<CareerApiData>): string {
  return with4eMark(career.wh, e, `${variantFor(career.wh, e).name} ${career.number}`);
}

function getCareerLevel(e: Edition, career: WhNumber<CareerApiData>): string {
  switch (career.number) {
    case 1:
      return variantFor(career.wh, e).level1.name;
    case 2:
      return variantFor(career.wh, e).level2.name;
    case 3:
      return variantFor(career.wh, e).level3.name;
    case 4:
      return variantFor(career.wh, e).level4.name;
    default:
      return "";
  }
}

function getSkills(e: Edition, characterSkills: WhNumber<SkillApiData>[], attributes: Attributes) {
  const basicSkills = [] as CharacterFullSkill[];
  const advancedSkills = [] as CharacterFullSkill[];

  for (const skill of characterSkills) {
    const formattedSkill = skillForDisplay(e, skill.wh, skill.number, attributes);
    if (variantFor(skill.wh, e).type === 0) {
      basicSkills.push(formattedSkill);
    } else {
      advancedSkills.push(formattedSkill);
    }
  }

  return [basicSkills.sort(sortByName), advancedSkills.sort(sortByName)];
}

// Public Language and Language - Guilder group skills: their members are languages.
const LANGUAGE_GROUP_IDS = ["5cadc6a3828dc9389cc7b15a", "5d187bb123353e73dca2ec60"];

function isLanguage(e: Edition, skill: ApiResponse<SkillApiData>): boolean {
  return (
    LANGUAGE_GROUP_IDS.includes(skill.id) || variantFor(skill, e).group.some((x) => LANGUAGE_GROUP_IDS.includes(x))
  );
}

function getLanguageSkills(e: Edition, characterSkills: WhNumber<SkillApiData>[], attributes: Attributes) {
  return characterSkills
    .filter((x) => isLanguage(e, x.wh))
    .map((x) => skillForDisplay(e, x.wh, x.number, attributes))
    .sort(sortByName);
}

function skillForDisplay(
  e: Edition,
  rawSkill: ApiResponse<SkillApiData>,
  skillRank: number,
  attributes: Attributes,
): CharacterFullSkill {
  return {
    id: rawSkill.id,
    name: with4eMark(
      rawSkill,
      e,
      variantFor(rawSkill, e).isGroup ? `${variantFor(rawSkill, e).name} (Any)` : variantFor(rawSkill, e).name,
    ),
    attributeName: printAttributeName(variantFor(rawSkill, e).attribute),
    attributeValue: getAttributeValue(variantFor(rawSkill, e).attribute, attributes),
    advances: skillRank,
    skill: getAttributeValue(variantFor(rawSkill, e).attribute, attributes) + skillRank,
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
    // The item and its qualities, runes and spells are read in the item's edition (4e for 4e content on a 5e character).
    const ie = contentEdition(charItem.wh, e);
    const item = {
      id: charItem.wh.id,
      name: with4eMark(charItem.wh, e, variant(charItem.wh, ie).name),
      enc: variant(charItem.wh, ie).enc,
      qualitiesFlaws: variant(charItem.wh, ie).properties.map((x) => ({
        name: printWithValue(variant(x.wh, ie).name, variant(x.wh, ie).hasValue, x.value),
        id: x.wh.id,
      })),
      runes: variant(charItem.wh, ie).runes.map((x) => ({
        name: variant(x.wh, ie).name,
        id: x.wh.id,
        number: x.number,
      })),
      number: charItem.number,
      description: variant(charItem.wh, ie).description,
      type: printItemType(variant(charItem.wh, ie).type),
    } as CharacterFullItem;

    if (variant(charItem.wh, ie).type === ItemType.Melee) {
      item.group = printMeleeGroup(variant(charItem.wh, ie).melee.group);
      item.rng = printMeleeReach(variant(charItem.wh, ie).melee.reach);
      item.dmg = (variant(charItem.wh, ie).melee.dmg + variant(charItem.wh, ie).melee.dmgSbMult * SB).toString();
    } else if (variant(charItem.wh, ie).type === ItemType.Ranged) {
      item.group = printRangedGroup(variant(charItem.wh, ie).ranged.group);
      item.rng = (variant(charItem.wh, ie).ranged.rng + variant(charItem.wh, ie).ranged.rngSbMult * SB).toString();
      item.dmg = (variant(charItem.wh, ie).ranged.dmg + variant(charItem.wh, ie).ranged.dmgSbMult * SB).toString();
    } else if (variant(charItem.wh, ie).type === ItemType.Ammunition) {
      let range =
        variant(charItem.wh, ie).ammunition.rngMult !== 1
          ? `Weapon x${variant(charItem.wh, ie).ammunition.rngMult}`
          : "Weapon";
      if (variant(charItem.wh, ie).ammunition.rng > 0) {
        range += `+${variant(charItem.wh, ie).ammunition.rng.toString()}`;
      } else if (variant(charItem.wh, ie).ammunition.rng < 0) {
        range += `${variant(charItem.wh, ie).ammunition.rng.toString()}`;
      }

      let damage = "Weapon";
      if (variant(charItem.wh, ie).ammunition.dmg > 0) {
        damage += `+${variant(charItem.wh, ie).ammunition.dmg.toString()}`;
      } else if (variant(charItem.wh, ie).ammunition.rng < 0) {
        damage += `${variant(charItem.wh, ie).ammunition.dmg.toString()}`;
      }

      item.group = printAmmoGroup(variant(charItem.wh, ie).ammunition.group);
      item.rng = range;
      item.dmg = damage;
    } else if (variant(charItem.wh, ie).type === ItemType.Armour) {
      item.group = printArmourGroup(variant(charItem.wh, ie).armour.group);
      // 5e shields are armour in the Shield group, with no hit location.
      item.locations =
        variant(charItem.wh, ie).armour.group === ArmourGroup.Shield
          ? ["Shield"]
          : variant(charItem.wh, ie).armour.location.map((x) => printArmourLocation(x));
      item.ap = variant(charItem.wh, ie).armour.points;
    } else if (variant(charItem.wh, ie).type === ItemType.Grimoire) {
      item.spells = getSpells(ie, variant(charItem.wh, ie).grimoire.spells);
    } else {
      item.description =
        (variant(charItem.wh, ie).type === ItemType.Container
          ? `(Capacity ${variant(charItem.wh, ie).container.capacity}) `
          : "") + variant(charItem.wh, ie).description;
    }
    items.push(item);
  }

  return items;
}

function getSpells(e: Edition, spells: ApiResponse<SpellApiData>[]): CharacterFullSpell[] {
  return spells.map((x) => ({
    id: x.id,
    name: with4eMark(x, e, variantFor(x, e).name),
    range: variantFor(x, e).range,
    target: variantFor(x, e).target,
    duration: variantFor(x, e).duration,
    description: variantFor(x, e).description,
    cn: variantFor(x, e).cn,
  }));
}

function getPrayers(e: Edition, prayers: ApiResponse<PrayerApiData>[]): CharacterFullPrayer[] {
  return prayers.map((x) => ({
    id: x.id,
    name: with4eMark(x, e, variantFor(x, e).name),
    range: variantFor(x, e).range,
    target: variantFor(x, e).target,
    duration: variantFor(x, e).duration,
    description: variantFor(x, e).description,
  }));
}

function getTraits(e: Edition, traits: WhValue<TraitApiData>[]): CharacterFullTrait[] {
  return traits.map((x) => ({
    id: x.wh.id,
    name: with4eMark(x.wh, e, printWithValue(variantFor(x.wh, e).name, variantFor(x.wh, e).hasValue, x.value)),
    description: variantFor(x.wh, e).description,
  }));
}

function getMutations(e: Edition, mutations: ApiResponse<MutationApiData>[]): CharacterFullMutation[] {
  return mutations.map((x) => {
    return {
      id: x.id,
      name: with4eMark(x, e, variantFor(x, e).name),
      type: printMutationType(variantFor(x, e).type),
      description: variantFor(x, e).description,
    };
  });
}
