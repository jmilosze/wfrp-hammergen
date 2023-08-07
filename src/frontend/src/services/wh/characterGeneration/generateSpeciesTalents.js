import { rollInTable, selectRandom } from "../../../utils/randomUtils";

const RANDOM_TALENTS_ROLL = 100;

export function generateSpeciesTalents(speciesTalents, groupTalents, randomTalents) {
  if (!randomTalentsValid(randomTalents)) {
    throw new Error("invalid random talents table");
  }

  if (!speciesTalentsValid(speciesTalents, groupTalents)) {
    throw new Error("invalid species talents object");
  }

  const talents = new Set();
  const groupTalentPicker = new GroupTalentPicker(groupTalents);
  const randomTalentPicker = new RandomTalentPicker(RANDOM_TALENTS_ROLL, randomTalents);

  for (const speciesTalent of speciesTalents) {
    const newTalents = speciesTalent.split(",");
    let newTalent = newTalents > 1 ? speciesTalent : selectRandom(newTalents);
    if (newTalent === "random") {
      selectRandomTalent(randomTalentPicker, talents, groupTalentPicker);
    } else {
      selectTalent(newTalent, talents, groupTalentPicker);
    }
  }

  return convertToIdNumberArray(talents);
}

function randomTalentsValid(randomTalents) {
  const uniqueTalents = new Set(randomTalents.map((x) => x.id));
  if (uniqueTalents.size !== randomTalents.length) {
    return false;
  }

  let sortedRanges = randomTalents.map((x) => [x.minRoll, x.maxRoll]);
  sortedRanges.sort((a, b) => a[0] - b[0]);

  let prevMax = 1;
  for (let i = 0; i < sortedRanges.length; i++) {
    const [start, end] = sortedRanges[i];
    if (start !== prevMax || end > RANDOM_TALENTS_ROLL + 1) {
      return false;
    }
    prevMax = end;
  }
  return true;
}

function speciesTalentsValid(speciesTalents, talentGroups) {
  let allTalents = [];
  for (const talents of speciesTalents) {
    for (const talent of talents.split(",")) {
      allTalents.push(talent);
    }
  }

  allTalents = allTalents.filter((x) => x !== "random" && !Object.hasOwn(talentGroups, x));

  return new Set(allTalents).size === allTalents.length;
}

class GroupTalentPicker {
  constructor(talentGroups) {
    this.talentGroups = JSON.parse(JSON.stringify(talentGroups));
  }

  isGroupTalent(talent) {
    return Object.hasOwn(this.talentGroups, talent);
  }

  pickFromGroup(group, selectedTalents) {
    while (this.talentGroups[group].length > 0) {
      let pickedTalent = selectRandom(this.talentGroups[group]);
      removeFromTalentGroup(this.talentGroups[group], pickedTalent);
      if (!selectedTalents.has(pickedTalent)) {
        return pickedTalent;
      }
    }
    return null;
  }
}

function removeFromTalentGroup(talentGroup, talentToRemove) {
  let indexToRemove = talentGroup.indexOf(talentToRemove);
  talentGroup.splice(indexToRemove, 1);
}

class RandomTalentPicker {
  constructor(initialMaxRandomRoll, randomTalents) {
    this.maxRandomRoll = initialMaxRandomRoll;
    this.randomTalents = [];
    for (const talent of randomTalents) {
      this.randomTalents.push([talent.id, talent.minRoll, talent.maxRoll]);
    }
  }

  pickFromRandom(selectedTalents, groupTalentPicker) {
    while (this.randomTalents.length > 0) {
      let newRandom = rollInTable(this.maxRandomRoll, 1, this.randomTalents);
      let shiftMaxRandomRoll = removeTalentFromRandomTalents(this.randomTalents, newRandom);
      this.maxRandomRoll -= shiftMaxRandomRoll;
      if (groupTalentPicker.isGroupTalent(newRandom)) {
        let newSelectedTalent = groupTalentPicker.pickFromGroup(newRandom, selectedTalents);
        if (newSelectedTalent !== null) {
          return newSelectedTalent;
        }
      } else {
        if (!selectedTalents.has(newRandom)) {
          return newRandom;
        }
      }
    }
    return null;
  }
}

function removeTalentFromRandomTalents(randomTalents, talentToRemove) {
  let indexToRemove;
  let shift;
  for (const [i, element] of randomTalents.entries()) {
    if (talentToRemove === element[0]) {
      indexToRemove = i;
      shift = element[2] - element[1];
      break;
    }
  }

  randomTalents.splice(indexToRemove, 1);
  if (randomTalents.length === 0) {
    return shift;
  }

  for (let i = indexToRemove; i < randomTalents.length; i++) {
    randomTalents[i][1] -= shift;
    randomTalents[i][2] -= shift;
  }

  return shift;
}

function selectRandomTalent(randomTalentPicker, selectedTalents, groupTalentPicker) {
  let newSelectedTalent = randomTalentPicker.pickFromRandom(selectedTalents, groupTalentPicker);
  if (newSelectedTalent === null) {
    throw new Error("not enough talents in random talents");
  }
  selectedTalents.add(newSelectedTalent);
}

function selectTalent(newTalent, selectedTalents, groupTalentPicker) {
  let newSelectedTalent;
  if (groupTalentPicker.isGroupTalent(newTalent)) {
    newSelectedTalent = groupTalentPicker.pickFromGroup(newTalent, selectedTalents);
    if (newSelectedTalent === null) {
      throw new Error(`not enough talents in group ${newTalent}`);
    }
  } else {
    newSelectedTalent = newTalent;
  }
  selectedTalents.add(newSelectedTalent);
}

function convertToIdNumberArray(talents) {
  return Array.from(talents).map((x) => ({ id: x, number: 1 }));
}
