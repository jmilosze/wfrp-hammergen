import { IdNumber } from "../common.ts";
import { RollInTableFn, SelectRandomFn } from "../../../utils/random.ts";

const RANDOM_TALENTS_ROLL = 100;

export type RandomTalents = Array<{
  id: string;
  minRoll: number;
  maxRoll: number;
}>;
export type GroupTalents = Record<string, string[]>;
export type SpeciesTalents = string[];

export function generateSpeciesTalents(
  speciesTalents: SpeciesTalents,
  groupTalents: GroupTalents,
  randomTalents: RandomTalents,
  selectRandomFn: SelectRandomFn,
  rollInTableFn: RollInTableFn,
): IdNumber[] {
  if (!randomTalentsValid(randomTalents)) {
    throw new Error("invalid random talents table");
  }

  if (!speciesTalentsValid(speciesTalents, groupTalents)) {
    throw new Error("invalid species talents object");
  }

  const talents = [] as string[];
  const groupTalentPicker = new GroupTalentPicker(groupTalents, selectRandomFn);
  const randomTalentPicker = new RandomTalentPicker(RANDOM_TALENTS_ROLL, randomTalents, rollInTableFn);

  for (const speciesTalent of speciesTalents) {
    const newTalents = speciesTalent.split(",");
    const newTalent = newTalents.length === 1 ? newTalents[0] : selectRandomFn(newTalents);
    if (newTalent === "random") {
      selectRandomTalent(randomTalentPicker, talents, groupTalentPicker);
    } else {
      selectTalent(newTalent, talents, groupTalentPicker);
    }
  }

  return convertToIdNumberArray(talents);
}

function randomTalentsValid(randomTalents: RandomTalents): boolean {
  const uniqueTalents = new Set(randomTalents.map((x) => x.id));
  if (uniqueTalents.size !== randomTalents.length) {
    return false;
  }

  const sortedRanges = randomTalents.map((x) => [x.minRoll, x.maxRoll]);
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

function speciesTalentsValid(speciesTalents: string[], talentGroups: Record<string, string[]>): boolean {
  let allTalents = [] as string[];
  for (const talents of speciesTalents) {
    for (const talent of talents.split(",")) {
      allTalents.push(talent);
    }
  }

  allTalents = allTalents.filter((x) => x !== "random" && !(x in talentGroups));

  return new Set(allTalents).size === allTalents.length;
}

function convertToIdNumberArray(talents: string[]): IdNumber[] {
  return talents.map((x) => ({ id: x, number: 1 }));
}

class GroupTalentPicker {
  groupTalents: Record<string, string[]>;
  selectRandomFn: SelectRandomFn;

  constructor(groupTalents: Record<string, string[]>, selectRandomFn: SelectRandomFn) {
    this.groupTalents = JSON.parse(JSON.stringify(groupTalents));
    this.selectRandomFn = selectRandomFn;
  }

  isGroupTalent(talent: string): boolean {
    return talent in this.groupTalents;
  }

  pickFromGroup(group: string, selectedTalents: string[]): string | null {
    if (!this.isGroupTalent(group)) {
      return null;
    }

    while (this.groupTalents[group].length > 0) {
      const pickedTalent = this.selectRandomFn(this.groupTalents[group]);
      removeFromTalentGroup(this.groupTalents[group], pickedTalent);
      if (!selectedTalents.includes(pickedTalent)) {
        return pickedTalent;
      }
    }
    return null;
  }
}

function removeFromTalentGroup(talentGroup: string[], talentToRemove: string): void {
  const indexToRemove = talentGroup.indexOf(talentToRemove);
  talentGroup.splice(indexToRemove, 1);
}

class RandomTalentPicker {
  maxRandomRoll: number;
  randomTalents: [string, number, number][];
  rollInTableFn: RollInTableFn;

  constructor(initialMaxRandomRoll: number, randomTalents: RandomTalents, rollInTableFn: RollInTableFn) {
    this.maxRandomRoll = initialMaxRandomRoll;
    this.randomTalents = [];
    for (const talent of randomTalents) {
      this.randomTalents.push([talent.id, talent.minRoll, talent.maxRoll]);
    }
    this.rollInTableFn = rollInTableFn;
  }

  pickFromRandom(selectedTalents: string[], groupTalentPicker: GroupTalentPicker): string | null {
    while (this.randomTalents.length > 0) {
      const newRandom = this.rollInTableFn(this.maxRandomRoll, 1, this.randomTalents);
      const shiftMaxRandomRoll = removeTalentFromRandomTalents(this.randomTalents, newRandom);
      this.maxRandomRoll -= shiftMaxRandomRoll;
      if (groupTalentPicker.isGroupTalent(newRandom)) {
        const newSelectedTalent = groupTalentPicker.pickFromGroup(newRandom, selectedTalents);
        if (newSelectedTalent !== null) {
          return newSelectedTalent;
        }
      } else {
        if (!selectedTalents.includes(newRandom)) {
          return newRandom;
        }
      }
    }
    return null;
  }
}

function removeTalentFromRandomTalents(randomTalents: [string, number, number][], talentToRemove: string): number {
  let indexToRemove;
  let shift;
  for (const [i, element] of randomTalents.entries()) {
    if (talentToRemove === element[0]) {
      indexToRemove = i;
      shift = element[2] - element[1];
      break;
    }
  }

  if (indexToRemove === undefined || shift === undefined) {
    return 0;
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

function selectRandomTalent(
  randomTalentPicker: RandomTalentPicker,
  selectedTalents: string[],
  groupTalentPicker: GroupTalentPicker,
): void {
  const newSelectedTalent = randomTalentPicker.pickFromRandom(selectedTalents, groupTalentPicker);
  if (newSelectedTalent !== null) {
    selectedTalents.push(newSelectedTalent);
  }
}

function selectTalent(newTalent: string, selectedTalents: string[], groupTalentPicker: GroupTalentPicker): void {
  if (groupTalentPicker.isGroupTalent(newTalent)) {
    const newSelectedTalent = groupTalentPicker.pickFromGroup(newTalent, selectedTalents);
    if (newSelectedTalent !== null) {
      selectedTalents.push(newSelectedTalent);
    }
  } else {
    selectedTalents.push(newTalent);
  }
}
