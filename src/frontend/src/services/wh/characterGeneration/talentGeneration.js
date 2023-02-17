import { rollInTable, selectRandom } from "../../../utils/randomUtils";
import { generateAdv, fillUpAdv } from "./attGeneration";
import { sumAndMultAttr, attributes, getAttributes } from "../attributes";

let LEVEL_1_TALENTS = 1;
let LEVEL_N_TALENTS = 2;
let LEVEL_1_ATTS = 5;
let LEVEL_N_ATTS = 5;

export function genTalentsAndAdvances(
  speciesTalents,
  randomTalents,
  careerTalents,
  baseAtts,
  listOfTalents,
  careerAtts,
  level
) {
  let talentGroups = getTalentGroups(listOfTalents);
  let dictOfTalents = listOfTalents.reduce((a, v) => ({ ...a, [v.id]: v }), {});

  let expSpent = 0;
  let advances = getAttributes();
  if (careerAtts[0].length > 0) {
    [advances, expSpent] = generateAdv(careerAtts[0], LEVEL_1_ATTS, advances, expSpent);
  }

  let talents = generateSpeciesTalents(speciesTalents, talentGroups, randomTalents);

  let talentsRank = getAllTalentsMaxRank(talents, dictOfTalents, baseAtts, advances);
  let availTalents = generateAvailableTalents(careerTalents[0], talentGroups, talentsRank);
  [talents, expSpent] = generateLevelTalent(talents, availTalents, talentsRank, LEVEL_1_TALENTS, expSpent);

  expSpent = 0;

  if (level > 1) {
    talentsRank = getAllTalentsMaxRank(talents, dictOfTalents, baseAtts, advances);
    availTalents = generateAvailableTalents(careerTalents[0], talentGroups, talentsRank);
    [talents, expSpent] = generateLevelTalent(talents, availTalents, talentsRank, LEVEL_1_TALENTS, expSpent);
  }

  let allCareerAtts = careerAtts[0];
  for (let tmpLvl = 2; tmpLvl <= level; ++tmpLvl) {
    let fillUpAtt = 5 * (tmpLvl - 1);
    [advances, expSpent] = fillUpAdv(allCareerAtts, fillUpAtt, advances, expSpent);

    allCareerAtts = allCareerAtts.concat(careerAtts[tmpLvl - 1]);
    if (allCareerAtts.length > 0) {
      [advances, expSpent] = generateAdv(allCareerAtts, LEVEL_N_ATTS, advances, expSpent);
    }

    talentsRank = getAllTalentsMaxRank(talents, dictOfTalents, baseAtts, advances);
    let availTalents = generateAvailableTalents(careerTalents[tmpLvl - 1], talentGroups, talentsRank);
    [talents, expSpent] = generateLevelTalent(talents, availTalents, talentsRank, LEVEL_N_TALENTS, expSpent);
  }

  return [talents, advances, expSpent];
}

export function getTalentGroups(listOfTalents) {
  let resolvedGroups = {};

  for (let talent of listOfTalents) {
    if (talent.group.length > 0) {
      for (let group of talent.group) {
        if (Object.hasOwn(resolvedGroups, group)) {
          resolvedGroups[group].push(talent.id);
        } else {
          resolvedGroups[group] = [talent.id];
        }
      }
    }
  }

  return resolvedGroups;
}

export function generateSpeciesTalents(speciesTalents, talentGroups, randomTalents) {
  let generatedTalents = [];
  let numberOfRandom = 0;

  for (let talent of speciesTalents) {
    if (typeof talent === "string") {
      if (talent === "random") {
        numberOfRandom += 1;
      } else {
        addOrIncrementIdNumberList(talent, generatedTalents);
      }
    } else {
      let newTalent = selectRandom(talent);
      addOrIncrementIdNumberList(newTalent, generatedTalents);
    }
  }

  for (let i = 0; i < numberOfRandom; ++i) {
    let validSelection = false;
    while (validSelection === false) {
      let newSelection = rollInTable(100, 1, randomTalents);
      if (Object.hasOwn(talentGroups, newSelection)) {
        newSelection = selectRandom(talentGroups[newSelection]);
      }

      if (!generatedTalents.find((x) => x.id === newSelection)) {
        generatedTalents.push({ id: newSelection, number: 1 });
        validSelection = true;
      }
    }
  }

  return generatedTalents;
}

function addOrIncrementIdNumberList(newId, idNumberList) {
  let idNumber = idNumberList.find((x) => x.id === newId);
  if (idNumber) {
    idNumber.number += 1;
  } else {
    idNumberList.push({ id: newId, number: 1 });
  }
}

export function getAllTalentsMaxRank(talents, talentDict, baseAtts, advances) {
  let talentAtts = getTalentAtts(talents, talentDict);

  let atts = sumAndMultAttr([
    { multiplier: 1, attributes: baseAtts },
    { multiplier: 1, attributes: talentAtts },
    { multiplier: 1, attributes: advances },
  ]);

  let talentsRank = {};
  for (let talent of Object.values(talentDict)) {
    talentsRank[talent.id] = getMaxRank(talent, atts);
  }
  return talentsRank;
}

export function getTalentAtts(selectedTalents, talentDict) {
  let modifiersList = selectedTalents.map((t) => ({
    multiplier: t.number,
    attributes: talentDict[t.id].modifiers.attributes,
  }));
  return sumAndMultAttr(modifiersList);
}

function getMaxRank(talent, atts) {
  if (talent.maxRankAtt > 0) {
    return talent.maxRank + Math.floor(atts[attributes[talent.maxRankAtt]] / 10);
  } else {
    return talent.maxRank;
  }
}

function generateAvailableTalents(newTalentList, talentGroups, talentMaxRank) {
  let talentGroupsCopy = JSON.parse(JSON.stringify(talentGroups));
  let availTalents = [];

  for (let talent of newTalentList) {
    if (Object.hasOwn(talentGroupsCopy, talent)) {
      if (talentGroupsCopy[talent].length > 0) {
        let newTalent = selectRandom(talentGroupsCopy[talent]);
        let indexToRemove = talentGroupsCopy[talent].indexOf(newTalent);
        talentGroupsCopy[talent].splice(indexToRemove, 1);
        if (talentMaxRank[newTalent] > 0) {
          availTalents.push(newTalent);
        }
      }
    } else {
      if (talentMaxRank[talent] > 0) {
        availTalents.push(talent);
      }
    }
  }

  return [...new Set(availTalents)];
}

function generateLevelTalent(previousTalents, availTalents, talentsRank, talentNumber, currentCost) {
  let selectedTalents = {};
  for (let talent of previousTalents) {
    selectedTalents[talent.id] = talent.number;
    if (availTalents.includes(talent.id) && talent.number >= talentsRank[talent.id]) {
      let indexToRemove = availTalents.indexOf(talent.id);
      availTalents.splice(indexToRemove, 1);
    }
  }

  let cost = currentCost;
  for (let adv = 0; adv < talentNumber; ++adv) {
    if (availTalents.length < 1) {
      break;
    }
    let newSelected = selectRandom(availTalents);
    if (Object.hasOwn(selectedTalents, newSelected)) {
      selectedTalents[newSelected] += 1;
    } else {
      selectedTalents[newSelected] = 1;
    }
    cost += 100 * selectedTalents[newSelected];

    if (selectedTalents[newSelected] >= talentsRank[newSelected]) {
      let indexToRemove = availTalents.indexOf(newSelected);
      availTalents.splice(indexToRemove, 1);
    }
  }

  let generatedTalents = [];
  for (let [id, number] of Object.entries(selectedTalents)) {
    if (number > 0) {
      generatedTalents.push({ id: id, number: number });
    }
  }

  return [generatedTalents, cost];
}
