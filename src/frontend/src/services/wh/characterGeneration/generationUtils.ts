import { RollDiceFn, SelectRandomFn } from "../../../utils/random.ts";

export function selectIdFromCandidates(itemIds: string, selectRandomFn: SelectRandomFn): string {
  const ids = itemIds.split(",");
  return ids.length === 1 ? ids[0] : selectRandomFn(ids);
}

export function parseQuantityOrRoll(roll: string, rollDiceFn: RollDiceFn): number {
  // If the quantity is a fixed integer (e.g. "1", "2"), return it directly without rolling dice.
  if (/^\d+$/.test(roll)) {
    return parseInt(roll, 10);
  }
  // Dice expression in "XdY" format (e.g. "1d10", "2d6").
  const [rollsStr, sidesStr] = roll.split("d");
  const rolls = parseInt(rollsStr, 10);
  const sides = parseInt(sidesStr, 10);
  return rollDiceFn(sides, rolls);
}
