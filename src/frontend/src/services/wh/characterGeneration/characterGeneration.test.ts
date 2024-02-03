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
import { StatusStanding, StatusTier } from "../career.ts";
import { RollDiceFn, SelectRandomFn } from "../../../utils/randomUtils.ts";
import { IdNumber } from "../common.ts";

export function generateCharacter(
  genSpeciesWithRegion,
  genCareer,
  listOfCareers,
  listOfSkills,
  listOfTalents,
  generationProps,
  level,
) {
  const careerLevels = { 1: "levelOne", 2: "levelTwo", 3: "levelThree", 4: "levelFour" };
  const levelName = careerLevels[level];
  let character = {};

  let exp = 50; // From random characteristics
  let career = listOfCareers[genCareer];
  let speciesWithRegion = genSpeciesWithRegion;

  let items = generateClassItems(generationProps.classItems[career.class]);

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
    listOfSkills,
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
    listOfTalents,
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

export function generateFateAndResilience(species: SpeciesWithRegion, rollDiceFn: RollDiceFn) {
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
  classItems: { equipped: IdNumber[]; carried: IdNumber[] },
  rollDiceFn: RollDiceFn,
  selectRandomFn: SelectRandomFn,
): { equipped: IdNumber[]; carried: IdNumber[] } {
  const items = { equipped: [], carried: [] };
  for (const itemType of Object.keys(items)) {
    for (const [itemIds, itemNumber] of Object.entries(classItems[itemType])) {
      let id = "";
      let number = "";

      const itemIdsList = itemIds.split(",");
      if (itemIdsList.length === 1) {
        id = itemIdsList[0];
      } else {
        id = selectRandomFn(itemIdsList);
      }

      if (isIntegerString(itemNumber)) {
        number = parseInt(itemNumber);
      } else {
        let roll = itemNumber.split("d");
        number = rollDiceFn(parseInt(roll[1]), parseInt(roll[0]));
      }
      items[itemType].push({ id: id, number: number });
    }
  }
  return items;
}

function isIntegerString(str: string) {
  // Use parseInt() to convert the string to an integer.
  // If the result is not NaN and the string is equal to its string representation,
  // then the input is a valid integer string.
  return !isNaN(parseInt(str)) && String(parseInt(str)) === str;
}
