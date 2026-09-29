import { rollDice, RollDiceFn, selectRandom, SelectRandomFn, selectWeighted } from "../../../utils/random.ts";
import { EntityGroupMap, GroupPicker } from "./resolveEntityGroups.ts";

const RANDOM_TALENTS_ROLL = 100;

export type RandomTalents = Array<{
  id: string;
  minRoll: number;
  maxRoll: number;
}>;
export type SpeciesTalents = string[];

export function generateSpeciesTalents(
  speciesTalents: SpeciesTalents | undefined,
  groupTalents: EntityGroupMap,
  randomTalents: RandomTalents,
  selectRandomFn: SelectRandomFn = selectRandom,
  rollDiceFn: RollDiceFn = rollDice,
): Record<string, number> {
  if (speciesTalents === undefined) {
    return {};
  }

  if (!randomTalentsValid(randomTalents)) {
    throw new Error("invalid random talents table");
  }

  if (!speciesTalentsValid(speciesTalents, groupTalents)) {
    throw new Error("invalid species talents object");
  }

  const talents: string[] = [];
  const groupPicker = new GroupPicker(groupTalents, selectRandomFn);
  const randomTalentPicker = new RandomTalentPicker(randomTalents, rollDiceFn, groupPicker);

  for (const speciesTalent of speciesTalents) {
    const talent = chooseTalent(speciesTalent, selectRandomFn);
    if (talent === "random") {
      const pickedTalent = randomTalentPicker.pickFromRandom(talents);
      if (pickedTalent !== null) {
        talents.push(pickedTalent);
      }
    } else if (groupPicker.isGroup(talent)) {
      const pickedTalent = groupPicker.pick(talent, talents);
      if (pickedTalent !== null) {
        talents.push(pickedTalent);
      }
    } else {
      talents.push(talent);
    }
  }

  const generatedTalents: Record<string, number> = {};
  for (const talent of talents) {
    generatedTalents[talent] = 1;
  }
  return generatedTalents;
}

function chooseTalent(speciesTalent: string, selectRandomFn: SelectRandomFn): string {
  const options = speciesTalent.split(",").map((s) => s.trim());
  return options.length === 1 ? options[0] : selectRandomFn(options);
}

function randomTalentsValid(randomTalents: RandomTalents): boolean {
  if (randomTalents.length === 0) {
    return true;
  }

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
  return prevMax === RANDOM_TALENTS_ROLL + 1;
}

function speciesTalentsValid(speciesTalents: string[], talentGroups: EntityGroupMap): boolean {
  let allTalents: string[] = [];
  for (const talents of speciesTalents) {
    for (const talent of talents.split(",").map((s) => s.trim())) {
      allTalents.push(talent);
    }
  }

  allTalents = allTalents.filter((x) => x !== "random" && !(x in talentGroups));

  return new Set(allTalents).size === allTalents.length;
}

class RandomTalentPicker {
  private remainingTalents: Array<{ id: string; weight: number }>;
  private readonly rollDiceFn: RollDiceFn;
  private readonly groupPicker: GroupPicker;

  constructor(randomTalents: RandomTalents, rollDiceFn: RollDiceFn, groupPicker: GroupPicker) {
    this.remainingTalents = randomTalents.map((t) => ({ id: t.id, weight: t.maxRoll - t.minRoll }));
    this.rollDiceFn = rollDiceFn;
    this.groupPicker = groupPicker;
  }

  pickFromRandom(selectedTalents: string[]): string | null {
    while (this.remainingTalents.length > 0) {
      const rolled = selectWeighted(this.remainingTalents, (t) => t.weight, this.rollDiceFn);
      this.remainingTalents = this.remainingTalents.filter((t) => t.id !== rolled.id);

      if (this.groupPicker.isGroup(rolled.id)) {
        const pickedTalent = this.groupPicker.pick(rolled.id, selectedTalents);
        if (pickedTalent !== null) {
          return pickedTalent;
        }
      } else if (!selectedTalents.includes(rolled.id)) {
        return rolled.id;
      }
    }
    return null;
  }
}
