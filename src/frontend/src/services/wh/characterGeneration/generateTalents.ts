import { Talent } from "../talent.ts";
import {
  AttributeName,
  Attributes,
  copyAttributes,
  getAttributes,
  getAttributeValue,
  multiplyAttributes,
  sumAttributes,
} from "../attributes.ts";
import { IdNumber, idNumberArrayToRecord } from "../common.ts";
import { RollInTableFn, SelectRandomFn } from "../../../utils/random.ts";
import { generateSpeciesTalents, RandomTalents, SpeciesTalents } from "./generateSpeciesTalents.ts";
import { fillUpAdv, generateAdv } from "./generateAttributes.ts";

const LEVEL_1_TALENTS = 1;
const LEVEL_N_TALENTS = 2;
const LEVEL_1_ATTS = 5;
const LEVEL_N_ATTS = 5;

export function genTalentsAndAdvances(
  speciesTalents: SpeciesTalents,
  randomTalents: RandomTalents,
  careerTalents: [string[], string[], string[], string[]],
  baseAtts: Attributes,
  listOfWhTalents: Talent[],
  careerAtts: [AttributeName[], AttributeName[], AttributeName[], AttributeName[]],
  level: 1 | 2 | 3 | 4,
  selectRandomFn: SelectRandomFn,
  rollInTableFn: RollInTableFn,
): [Record<string, IdNumber>, Attributes, number] {
  const talentGroups = getTalentGroups(listOfWhTalents);

  let advances = getAttributes();
  if (careerAtts[0].length > 0) {
    advances = generateAdv(careerAtts[0], LEVEL_1_ATTS, advances, 0, selectRandomFn)[0];
  }

  let talents = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents, selectRandomFn, rollInTableFn);
  let talentsRank = getAllTalentsMaxRank(talents, listOfWhTalents, baseAtts, advances);
  let availTalents = generateAvailableTalents(careerTalents[0], talentGroups, selectRandomFn);
  talents = generateLevelTalent(talents, availTalents, talentsRank, LEVEL_1_TALENTS, 0, selectRandomFn)[0];

  let expSpent = 0;

  if (level > 1) {
    talentsRank = getAllTalentsMaxRank(talents, listOfWhTalents, baseAtts, advances);
    availTalents = generateAvailableTalents(careerTalents[0], talentGroups, selectRandomFn);
    [talents, expSpent] = generateLevelTalent(
      talents,
      availTalents,
      talentsRank,
      LEVEL_1_TALENTS,
      expSpent,
      selectRandomFn,
    );
  }

  let allCareerAtts = careerAtts[0];
  for (let tmpLvl = 2; tmpLvl <= level; ++tmpLvl) {
    const fillUpAtt = 5 * (tmpLvl - 1);
    [advances, expSpent] = fillUpAdv(allCareerAtts, fillUpAtt, advances, expSpent);

    allCareerAtts = allCareerAtts.concat(careerAtts[tmpLvl - 1]);
    if (allCareerAtts.length > 0) {
      [advances, expSpent] = generateAdv(allCareerAtts, LEVEL_N_ATTS, advances, expSpent, selectRandomFn);
    }

    talentsRank = getAllTalentsMaxRank(talents, listOfWhTalents, baseAtts, advances);
    const availTalents = generateAvailableTalents(careerTalents[tmpLvl - 1], talentGroups, selectRandomFn);
    [talents, expSpent] = generateLevelTalent(
      talents,
      availTalents,
      talentsRank,
      LEVEL_N_TALENTS,
      expSpent,
      selectRandomFn,
    );
  }

  return [idNumberArrayToRecord(talents), advances, expSpent];
}

export function getTalentGroups(listOfWhTalents: Talent[]): Record<string, string[]> {
  const resolvedGroups: Record<string, string[]> = {};

  for (const talent of listOfWhTalents) {
    if (talent.group) {
      for (const group of talent.group) {
        if (group in resolvedGroups) {
          resolvedGroups[group].push(talent.id);
        } else {
          resolvedGroups[group] = [talent.id];
        }
      }
    }
  }
  return resolvedGroups;
}

export function getAllTalentsMaxRank(
  selectedTalents: IdNumber[],
  listOfWhTalents: Talent[],
  baseAtts: Attributes,
  advances: Attributes,
): Record<string, number> {
  const attributes = sumAttributes(baseAtts, advances, getTalentAtts(selectedTalents, listOfWhTalents));

  const talentsRank: Record<string, number> = {};
  for (const talent of listOfWhTalents) {
    talentsRank[talent.id] = getMaxRank(talent, attributes);
  }
  return talentsRank;
}

function getMaxRank(talent: Talent, atts: Attributes): number {
  if (talent.attribute !== AttributeName.None && talent.attribute !== AttributeName.Various) {
    return talent.maxRank + Math.floor(getAttributeValue(talent.attribute, atts) / 10);
  } else {
    return talent.maxRank;
  }
}

function getTalentAtts(selectedTalents: IdNumber[], listOfWhTalents: Talent[]): Attributes {
  let attributes = getAttributes();

  for (const talent of listOfWhTalents) {
    for (const idNumber of selectedTalents) {
      if (talent.id === idNumber.id) {
        attributes = sumAttributes(
          attributes,
          multiplyAttributes(idNumber.number, copyAttributes(talent.modifiers.attributes)),
        );
      }
    }
  }
  return attributes;
}

export function generateAvailableTalents(
  talents: string[],
  talentGroups: Record<string, string[]>,
  selectRandomFn: SelectRandomFn,
): string[] {
  const talentGroupsCopy: Record<string, string[]> = JSON.parse(JSON.stringify(talentGroups));
  const availTalents: string[] = [];

  for (const talent of talents) {
    if (talent in talentGroupsCopy) {
      if (talentGroupsCopy[talent].length > 0) {
        const newTalent = selectRandomFn(talentGroupsCopy[talent]);
        const indexToRemove = talentGroupsCopy[talent].indexOf(newTalent);
        talentGroupsCopy[talent].splice(indexToRemove, 1);
        availTalents.push(newTalent);
      }
    } else {
      availTalents.push(talent);
    }
  }

  return [...new Set(availTalents)];
}

export function generateLevelTalent(
  previousTalents: IdNumber[],
  availTalents: string[],
  talentsRank: Record<string, number>,
  talentNumber: number,
  currentCost: number,
  selectRandomFn: SelectRandomFn,
): [IdNumber[], number] {
  const selectedTalents: Record<string, number> = {};

  for (const talent of availTalents) {
    if (!(talent in talentsRank)) {
      availTalents.splice(availTalents.indexOf(talent), 1);
    }
  }

  for (const talent of previousTalents) {
    selectedTalents[talent.id] = talent.number;
    if (availTalents.includes(talent.id) && talent.number >= talentsRank[talent.id]) {
      availTalents.splice(availTalents.indexOf(talent.id), 1);
    }
  }

  let cost = currentCost;
  for (let adv = 0; adv < talentNumber; ++adv) {
    let selectionSuccessful = false;
    while (!selectionSuccessful) {
      if (availTalents.length < 1) {
        break;
      }

      const newSelected = selectRandomFn(availTalents);
      let rank;
      if (newSelected in selectedTalents) {
        rank = selectedTalents[newSelected] + 1;
      } else {
        rank = 1;
      }

      if (rank >= talentsRank[newSelected]) {
        availTalents.splice(availTalents.indexOf(newSelected), 1);
      }

      if (rank <= talentsRank[newSelected]) {
        selectionSuccessful = true;
        selectedTalents[newSelected] = rank;
        cost += 100 * selectedTalents[newSelected];
      }
    }
  }

  const generatedTalents: IdNumber[] = [];
  for (const [id, number] of Object.entries(selectedTalents)) {
    if (number > 0) {
      generatedTalents.push({ id: id, number: number });
    }
  }

  return [generatedTalents, cost];
}
