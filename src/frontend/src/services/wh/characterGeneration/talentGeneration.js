import { rollInTable, selectRandom } from "../../../utils/randomUtils";
import { generateAdv, fillUpAdv } from "./attGeneration";
import { racialAttributes, attributes } from "../character";

let LEVEL_1_TALENT_NUMBER = 1;
let LEVEL_N_TALENT_NUMBER = 2;
let LEVEL_1_ATT_NUMBER = 5;
let LEVEL_N_ATT_NUMBER = 5;

export function resolveTalentGroups(listOfTalents) {
  let resolvedGroups = {};

  for (let talent of listOfTalents) {
    if (talent.group.length > 0) {
      for (let group of talent.group) {
        if (resolvedGroups.hasOwnProperty(group)) {
          resolvedGroups[group].push(talent.id);
        } else {
          resolvedGroups[group] = [talent.id];
        }
      }
    }
  }

  return resolvedGroups;
}

export function generateSpeciesTalents(speciesTalents, resolvedTalentGroups, randomTalents, species) {
  let generatedTalents = [];

  for (let talent of speciesTalents) {
    if (typeof talent === "string") {
      generatedTalents.push({ id: talent, number: 1 });
    } else {
      let newTalent = selectRandom(talent);
      generatedTalents.push({ id: newTalent, number: 1 });
    }
  }

  let numOfRandom;
  if (species === 0) {
    numOfRandom = 3;
  } else if (species === 1) {
    numOfRandom = 2;
  } else {
    numOfRandom = 0;
  }

  for (let i = 0; i < numOfRandom; ++i) {
    let validSelection = false;
    while (validSelection === false) {
      let newSelection = rollInTable(100, 1, randomTalents);
      if (resolvedTalentGroups.hasOwnProperty(newSelection)) {
        newSelection = selectRandom(resolvedTalentGroups[newSelection]);
      }

      if (!generatedTalents.find((x) => x.id === newSelection)) {
        generatedTalents.push({ id: newSelection, number: 1 });
        validSelection = true;
      }
    }
  }

  return generatedTalents;
}

function getMaxRank(talent, atts) {
  if (talent.max_rank_att > 0) {
    return talent.max_rank + Math.floor(atts[attributes[talent.max_rank_att]] / 10);
  } else {
    return talent.max_rank;
  }
}

function getTalentsRank(talentList, baseAtts, advAtts) {
  let atts = {};
  for (let attName of Object.keys(baseAtts)) {
    atts[attName] = baseAtts[attName] + advAtts[attName];
  }

  let talentsRank = {};
  for (let talent of talentList) {
    talentsRank[talent.id] = getMaxRank(talent, atts);
  }
  return talentsRank;
}

function generateLevelTalent(previousTalents, talentList, talentGroups, talentsRank, talentNumber, currentCost) {
  let talentGroupsCopy = JSON.parse(JSON.stringify(talentGroups));
  let availTalents = [];
  let cost = currentCost;

  for (let talent of talentList) {
    if (talentGroupsCopy.hasOwnProperty(talent)) {
      if (talentGroupsCopy[talent].length > 0) {
        let newTalent = selectRandom(talentGroupsCopy[talent]);
        let indexToRemove = talentGroupsCopy[talent].indexOf(newTalent);
        talentGroupsCopy[talent].splice(indexToRemove, 1);
        if (talentsRank[newTalent] > 0) {
          availTalents.push(newTalent);
        }
      }
    } else {
      if (talentsRank[talent] > 0) {
        availTalents.push(talent);
      }
    }
  }

  let selectedTalents = {};
  for (let talent of previousTalents) {
    selectedTalents[talent.id] = talent.number;
    if (availTalents.includes(talent.id) && talent.number >= talentsRank[talent.id]) {
      let indexToRemove = availTalents.indexOf(talent.id);
      availTalents.splice(indexToRemove, 1);
    }
  }

  for (let adv = 0; adv < talentNumber; ++adv) {
    if (availTalents.length < 1) {
      break;
    }
    let newSelected = selectRandom(availTalents);
    if (selectedTalents.hasOwnProperty(newSelected)) {
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

export function genTalentsAndAdvances(
  species,
  speciesTalents,
  randomTalents,
  careerTalents,
  baseAtts,
  listOfTalents,
  careerAtts,
  level
) {
  let expSpent = 0;
  let advances = JSON.parse(JSON.stringify(racialAttributes.none));
  if (careerAtts[0].length > 0) {
    [advances, expSpent] = generateAdv(careerAtts[0], LEVEL_1_ATT_NUMBER, advances, expSpent);
  }

  let resolvedTalentGroups = resolveTalentGroups(listOfTalents);
  let genSpecTalents = generateSpeciesTalents(speciesTalents[species], resolvedTalentGroups, randomTalents, species);

  let talentsRank = getTalentsRank(listOfTalents, baseAtts, advances);
  let talents;
  [talents, expSpent] = generateLevelTalent(
    genSpecTalents,
    careerTalents[0],
    resolvedTalentGroups,
    talentsRank,
    LEVEL_1_TALENT_NUMBER,
    expSpent
  );

  expSpent = 0;

  if (level > 1) {
    [talents, expSpent] = generateLevelTalent(
      talents,
      careerTalents[0],
      resolvedTalentGroups,
      talentsRank,
      LEVEL_1_TALENT_NUMBER,
      expSpent
    );
  }

  let allCareerAtts = careerAtts[0];
  for (let tmpLvl = 2; tmpLvl <= level; ++tmpLvl) {
    let fillUpAtt = 5 * (tmpLvl - 1);
    [advances, expSpent] = fillUpAdv(allCareerAtts, fillUpAtt, advances, expSpent);

    allCareerAtts = allCareerAtts.concat(careerAtts[tmpLvl - 1]);
    if (allCareerAtts.length > 0) {
      [advances, expSpent] = generateAdv(allCareerAtts, LEVEL_N_ATT_NUMBER, advances, expSpent);
    }

    talentsRank = getTalentsRank(listOfTalents, baseAtts, advances);
    [talents, expSpent] = generateLevelTalent(
      talents,
      careerTalents[tmpLvl - 1],
      resolvedTalentGroups,
      talentsRank,
      LEVEL_N_TALENT_NUMBER,
      expSpent
    );
  }

  return [talents, advances, expSpent];
}
