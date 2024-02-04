import {
  DWARF_LIST,
  GNOME_LIST,
  HALFLING_LIST,
  HIGH_ELF_LIST,
  HUMAN_LIST,
  OGRE_LIST,
  SpeciesWithRegion,
  WOOD_ELF_LIST,
} from "../characterUtils.ts";
import { Career, StatusStanding, StatusTier } from "../career.ts";
import { RollDiceFn, SelectRandomFn } from "../../../utils/randomUtils.ts";
import { IdNumber } from "../common.ts";
import { RandomTalents } from "./generateSpeciesTalents.ts";
import { Talent } from "../talent.ts";
import { Skill } from "../skill.ts";

interface GenerationProps {
  classItems: { equipped: Record<string, string>; carried: Record<string, string> }[];
  randomTalents: RandomTalents;
  speciesTalents: string[][];
  speciesSkills: string[][];
}

export function generateCharacter(
  species: SpeciesWithRegion,
  whCareer: Career,
  listOfWhSkills: Skill[],
  listOfWhTalents: Talent[],
  generationProps: GenerationProps,
  level: number,
) {
  const character = {};

  const exp = 50; // From random characteristics
  const items = generateClassItems(generationProps.classItems[career.class]);

  character.name = generateName(speciesWithRegion, 2);
  character.speciesWithRegion = speciesWithRegion;
  character.career = { id: career.id, number: level };
  character.careerPath = [];
  for (let i = 1; i < level; ++i) {
    character.careerPath.push({ id: career.id, number: i });
  }
  character.description = generateDescription(speciesWithRegion);
  character.notes = "";
  [character.fate, character.resilience] = generateFateAndResilience(speciesWithRegion);
  character.fortune = character.fate;
  character.resolve = character.resilience;
  character.status = career[levelName].status;
  character.standing = career[levelName].standing;
  [character.brass, character.silver, character.gold] = generateCoins(character.status, character.standing);
  character.attributeRolls = generateRolls();
  character.storedItems = [];
  character.equippedItems = items.equipped;
  character.carriedItems = items.carried;

  let lvl1 = career.levelOne;
  let lvl2 = career.levelTwo;
  let lvl3 = career.levelThree;
  let lvl4 = career.levelFour;

  let skillExpSpent;
  [character.skills, skillExpSpent] = generateSkills(
    speciesWithRegion,
    generationProps.speciesSkills,
    [lvl1.skills, lvl2.skills, lvl3.skills, lvl4.skills],
    listOfWhSkills: Skill[],
    level,
  );

  let baseAttributes = sumAndMultAttr([
    { multiplier: 1, attributes: getAttributes(speciesWithRegion) },
    { multiplier: 1, attributes: character.attributeRolls },
  ]);

  let talentAndAttExpSpent;
  [character.talents, character.attributeAdvances, talentAndAttExpSpent] = genTalentsAndAdvances(
    generationProps.speciesTalents[speciesWithRegion],
    generationProps.randomTalents,
    [lvl1.talents, lvl2.talents, lvl3.talents, lvl4.talents],
    baseAttributes,
    listOfWhTalents,
    [lvl1.attributes, lvl2.attributes, lvl3.attributes, lvl4.attributes],
    level,
  );

  let totalExSpent = skillExpSpent + talentAndAttExpSpent + 100 * (level - 1);
  character.currentExp = exp - totalExSpent > 0 ? exp - totalExSpent : 0;
  character.spentExp = totalExSpent;

  character.sin = 0;
  character.corruption = 0;
  character.spells = [];
  character.mutations = [];

  return character;
}

export function generateFateAndResilience(species: SpeciesWithRegion, rollDiceFn: RollDiceFn): [number, number] {
  let fate;
  let resilience;
  let extra;

  if (HUMAN_LIST.includes(species)) {
    fate = 2;
    resilience = 1;
    extra = 3;
  } else if (HALFLING_LIST.includes(species)) {
    fate = 0;
    resilience = 2;
    extra = 3;
  } else if (DWARF_LIST.includes(species)) {
    fate = 0;
    resilience = 2;
    extra = 2;
  } else if (GNOME_LIST.includes(species)) {
    fate = 2;
    resilience = 0;
    extra = 2;
  } else if (OGRE_LIST.includes(species)) {
    fate = 0;
    resilience = 3;
    extra = 1;
  } else if (HIGH_ELF_LIST.includes(species) || WOOD_ELF_LIST.includes(species)) {
    fate = 0;
    resilience = 0;
    extra = 2;
  } else {
    fate = 0;
    resilience = 0;
    extra = 0;
  }

  for (let pt = 0; pt < extra; pt++) {
    const roll = rollDiceFn(2, 1);
    fate += roll % 2;
    resilience += Math.floor(roll / 2);
  }
  return [fate, resilience];
}

function generateCoins(status: StatusTier, standing: StatusStanding, rollDiceFn: RollDiceFn): [number, number, number] {
  if (status === StatusTier.Brass) {
    return [rollDiceFn(10, 2 * standing), 0, 0];
  } else if (status === StatusTier.Silver) {
    return [0, rollDiceFn(10, standing), 0];
  } else {
    return [0, 0, standing];
  }
}

export function generateClassItems(
  classItems: { equipped: Record<string, string>; carried: Record<string, string> },
  rollDiceFn: RollDiceFn,
  selectRandomFn: SelectRandomFn,
): { equipped: IdNumber[]; carried: IdNumber[] } {
  const items: { equipped: IdNumber[]; carried: IdNumber[] } = { equipped: [], carried: [] };

  for (const [itemIds, itemNumber] of Object.entries(classItems.equipped)) {
    const id = getIdFromCommaSeparatedIds(itemIds, selectRandomFn);
    const number = getNumberFromDiceRollString(itemNumber, rollDiceFn);
    items.equipped.push({ id: id, number: number });
  }

  for (const [itemIds, itemNumber] of Object.entries(classItems.carried)) {
    const id = getIdFromCommaSeparatedIds(itemIds, selectRandomFn);
    const number = getNumberFromDiceRollString(itemNumber, rollDiceFn);
    items.equipped.push({ id: id, number: number });
  }

  return items;
}

function getIdFromCommaSeparatedIds(itemIds: string, selectRandomFn: <T>(array: T[]) => T) {
  const itemIdsList = itemIds.split(",");
  if (itemIdsList.length === 1) {
    return itemIdsList[0];
  } else {
    return selectRandomFn(itemIdsList);
  }
}

function isIntegerString(str: string) {
  // Use parseInt() to convert the string to an integer.
  // If the result is not NaN and the string is equal to its string representation,
  // then the input is a valid integer string.
  return !isNaN(parseInt(str)) && String(parseInt(str)) === str;
}

function getNumberFromDiceRollString(roll: string, rollDiceFn: (sides: number, rolls: number) => number) {
  if (isIntegerString(roll)) {
    return parseInt(roll);
  } else {
    const rollParameters = roll.split("d");
    return rollDiceFn(parseInt(rollParameters[1]), parseInt(rollParameters[0]));
  }
}