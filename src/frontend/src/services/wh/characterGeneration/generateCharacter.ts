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
import { rollDice, RollDiceFn, rollInTable, selectRandom, SelectRandomFn } from "../../../utils/randomUtils.ts";
import { IdNumber } from "../common.ts";
import { RandomTalents } from "./generateSpeciesTalents.ts";
import { Talent } from "../talent.ts";
import { Skill } from "../skill.ts";
import generateName from "./generateName.ts";
import { Character } from "../character.ts";
import generateDescription from "./generateDescription.ts";
import { generateRolls } from "./generateAttributes.ts";
import { generateSkills } from "./generateSkills.ts";
import { getAttributes, sumAttributes } from "../attributes.ts";
import { genTalentsAndAdvances } from "./generateTalents.ts";

interface GenerationProps {
  classItems: { equipped: Record<string, string>; carried: Record<string, string> }[];
  randomTalents: RandomTalents;
  speciesTalents: Record<string, string[]>;
  speciesSkills: Record<string, string[]>;
}

export function generateCharacter(
  species: SpeciesWithRegion,
  whCareer: Career,
  listOfWhSkills: Skill[],
  listOfWhTalents: Talent[],
  generationProps: GenerationProps,
  level: 1 | 2 | 3 | 4,
) {
  const character = new Character();

  const exp = 50; // From random characteristics

  let classItems: { equipped: IdNumber[]; carried: IdNumber[] };
  if (whCareer.careerClass in generationProps.classItems) {
    classItems = generateClassItems(generationProps.classItems[whCareer.careerClass], rollDice, selectRandom);
  } else {
    classItems = { equipped: [], carried: [] };
  }

  character.name = generateName(species);
  character.species = species;
  character.career = { id: whCareer.id, number: level };
  character.careerPath = [];
  for (let i = 1; i < level; ++i) {
    character.careerPath.push({ id: whCareer.id, number: i });
  }
  character.description = generateDescription(species);
  character.notes = "";
  [character.fate, character.resilience] = generateFateAndResilience(species, rollDice);
  character.fortune = character.fate;
  character.resolve = character.resilience;
  character.status = whCareer.getLevel(level).status;
  character.standing = whCareer.getLevel(level).standing;
  [character.brass, character.silver, character.gold] = generateCoins(character.status, character.standing, rollDice);
  character.attributeRolls = generateRolls(rollDice);
  character.storedItems = [];
  character.equippedItems = classItems.equipped;
  character.carriedItems = classItems.carried;

  let skillExpSpent = 0;
  if (species in generationProps.speciesSkills) {
    [character.skills, skillExpSpent] = generateSkills(
      generationProps.speciesSkills[species],
      [whCareer.level1.skills, whCareer.level2.skills, whCareer.level3.skills, whCareer.level4.skills],
      listOfWhSkills,
      level,
      selectRandom,
    );
  }

  const baseAttributes = sumAttributes(getAttributes(species), character.attributeRolls);

  let talentAndAttExpSpent = 0;
  if (species in generationProps.speciesTalents) {
    [character.talents, character.attributeAdvances, talentAndAttExpSpent] = genTalentsAndAdvances(
      generationProps.speciesTalents[species],
      generationProps.randomTalents,
      [whCareer.level1.talents, whCareer.level2.talents, whCareer.level3.talents, whCareer.level4.talents],
      baseAttributes,
      listOfWhTalents,
      [whCareer.level1.attributes, whCareer.level2.attributes, whCareer.level3.attributes, whCareer.level4.attributes],
      level,
      selectRandom,
      rollInTable,
    );
  }

  const totalExSpent = skillExpSpent + talentAndAttExpSpent + 100 * (level - 1);
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
