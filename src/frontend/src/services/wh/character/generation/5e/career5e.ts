// The 5e career at creation (pp. 36–37): rolling on the Random Class and Career Table or choosing, in guided creation.
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { rollOnTable, RollTable } from "@/services/wh/character/generation/shared/rollTables.ts";
import { rollDice, RollDiceFn } from "@/utils/random.ts";

// A roll on a species' column of the table. Rolls made before the species changed stay in the list (they count
// towards the roll sequence) but can't be kept.
export interface CareerRoll5e {
  roll: number;
  species: SpeciesWithRegion;
  career: string;
}

// How the career was settled: one of the rolls kept (its index), or chosen.
export type CareerPick5e = { fromRoll: number } | { chosen: string };

// Where the roll sequence is (p. 36): no roll yet; the first roll, to keep or to follow with two more; three rolls, to
// take one of; later rolls, one at a time, the latest to keep.
export type CareerRollStage5e = "none" | "first" | "three" | "later";

export function careerRollStage5e(rolls: CareerRoll5e[]): CareerRollStage5e {
  if (rolls.length === 0) {
    return "none";
  } else if (rolls.length === 1) {
    return "first";
  } else if (rolls.length === 3) {
    return "three";
  }
  return "later";
}

// rollCareers5e makes the next rolls of the sequence: the first roll, then two more, then one at a time.
export function rollCareers5e(
  rolls: CareerRoll5e[],
  table: RollTable,
  species: SpeciesWithRegion,
  rollDiceFn: RollDiceFn = rollDice,
): CareerRoll5e[] {
  const count = rolls.length === 1 ? 2 : 1;
  const newRolls = Array.from({ length: count }, () => {
    const { roll, id } = rollOnTable(table, rollDiceFn);
    return { roll: roll, species: species, career: id };
  });
  return [...rolls, ...newRolls];
}

// canKeepCareerRoll5e tells whether a roll can be kept: it was rolled for the current species and, in the stage the
// sequence is at, it is the first roll, one of the three, or the latest.
export function canKeepCareerRoll5e(rolls: CareerRoll5e[], index: number, species: SpeciesWithRegion): boolean {
  if (rolls[index].species !== species) {
    return false;
  }
  const stage = careerRollStage5e(rolls);
  return stage === "three" ? index < 3 : index === rolls.length - 1;
}

export function pickedCareer5e(rolls: CareerRoll5e[], pick: CareerPick5e): string {
  return "chosen" in pick ? pick.chosen : rolls[pick.fromRoll].career;
}

// The number of level 2 trappings the career gives (p. 36): two for keeping the first roll, one for taking one of
// three, none after that or for choosing.
export function careerBonusTrappings5e(rolls: CareerRoll5e[], pick: CareerPick5e): number {
  if ("chosen" in pick) {
    return 0;
  }
  const stage = careerRollStage5e(rolls);
  return stage === "first" ? 2 : stage === "three" ? 1 : 0;
}
