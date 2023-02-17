import generateName from "./nameGeneration";
import generateDescription from "./descriptionGeneration";
import { selectRandom, rollInTable, diceRoll } from "../../../utils/randomUtils";
import { generateRolls, getBaseAttributes } from "./attGeneration";
import { generateSkills } from "./skillGeneration";
import { genTalentsAndAdvances } from "./talentGeneration";

const SPECIES_ROLLS = [
  [0, 1, 90],
  [1, 90, 94],
  [2, 94, 98],
  [5, 98, 99],
  [3, 99, 100],
  [4, 100, 101],
];

function generateSpecies() {
  return rollInTable(100, 1, SPECIES_ROLLS);
}

function generateFateAndResilience(species) {
  let fate;
  let resilience;
  let extra;

  if (species === 0) {
    fate = 2;
    resilience = 1;
    extra = 3;
  } else if (species === 1) {
    fate = 0;
    resilience = 2;
    extra = 3;
  } else if (species === 2) {
    fate = 0;
    resilience = 2;
    extra = 2;
  } else if (species === 5) {
    fate = 2;
    resilience = 0;
    extra = 2;
  } else {
    fate = 0;
    resilience = 0;
    extra = 2;
  }

  for (let pt = 0; pt < extra; pt++) {
    let roll = diceRoll(2, 1);
    fate += roll % 2;
    resilience += Math.floor(roll / 2);
  }
  return [fate, resilience];
}

function generateCoins(status, standing) {
  if (status === 0) {
    return [diceRoll(10, 2 * standing), 0, 0];
  } else if (status === 1) {
    return [0, diceRoll(10, standing), 0];
  } else {
    return [0, 0, standing];
  }
}

export function generateClassItems(classItems) {
  let items = { equipped: [], carried: [] };

  for (let itemType of Object.keys(items)) {
    for (let item of classItems[itemType]) {
      let id = "";
      let number = "";

      if (typeof item.id === "string") {
        id = item.id;
      } else {
        id = selectRandom(item.id);
      }

      if (Number.isInteger(item.number)) {
        number = item.number;
      } else {
        let roll = item.number.split("d");
        number = diceRoll(parseInt(roll[1]), parseInt(roll[0]));
      }
      items[itemType].push({ id: id, number: number });
    }
  }
  return items;
}

export default function generateCharacter(
  genSpecies,
  genCareer,
  listOfCareers,
  listOfSkills,
  listOfTalents,
  generationProps,
  level
) {
  const careerLevels = { 1: "levelOne", 2: "levelTwo", 3: "levelThree", 4: "levelFour" };
  const levelName = careerLevels[level];
  let character = {};

  let exp = 50;
  let species;
  let career;

  if (genSpecies === -1) {
    species = generateSpecies();
    exp += 20;
  } else {
    species = genSpecies;
  }

  if (genCareer === -1) {
    let careerTable = generationProps.career_gen_table[species];
    let careerId = rollInTable(10000, 1, careerTable);
    career = listOfCareers.find((x) => x.id === careerId);
    exp += 50;
  } else {
    career = listOfCareers[genCareer];
  }

  let items = generateClassItems(generationProps.class_items[career.class]);

  character.name = generateName(species, 2);
  character.species = species;
  character.career = { id: career.id, number: level };
  character.careerPath = [];
  for (let i = 1; i < level; ++i) {
    character.careerPath.push({ id: career.id, number: i });
  }
  character.description = generateDescription(species);
  character.notes = "";
  [character.fate, character.resilience] = generateFateAndResilience(species);
  character.fortune = character.fate;
  character.resolve = character.resilience;
  character.status = career[levelName].status;
  character.standing = career[levelName].standing;
  [character.brass, character.silver, character.gold] = generateCoins(character.status, character.standing);
  character.attributeRolls = generateRolls(species);
  character.storedItems = [];
  character.equippedItems = items.equipped;
  character.carriedItems = items.carried;

  let lvl1 = career.levelOne;
  let lvl2 = career.levelTwo;
  let lvl3 = career.levelThree;
  let lvl4 = career.levelFour;

  let skillExpSpent;
  [character.skills, skillExpSpent] = generateSkills(
    species,
    generationProps.species_skills,
    [lvl1.skills, lvl2.skills, lvl3.skills, lvl4.skills],
    listOfSkills,
    level
  );

  let talentAndAttExpSpent;
  [character.talents, character.attributeAdvances, talentAndAttExpSpent] = genTalentsAndAdvances(
    generationProps.species_talents[species],
    generationProps.random_talents,
    [lvl1.talents, lvl2.talents, lvl3.talents, lvl4.talents],
    getBaseAttributes(species, character.attributeRolls),
    listOfTalents,
    [lvl1.attributes, lvl2.attributes, lvl3.attributes, lvl4.attributes],
    level
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
