// Class trappings from the generation data (choices like "A,B" and quantities like "1d10") and career trappings and
// money from the career levels (HG-40).
import { Career, CareerLevel, GenerationLevel } from "@/services/wh/content/career.ts";
import { Item } from "@/services/wh/content/item.ts";
import { CareerMoney, CareerTrappingEntry } from "@/services/wh/content/careerTrapping.ts";
import { GenerationProps } from "./generationProps.ts";
import { randomOptions, rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "@/utils/random.ts";
import { fillUp, IdNumberValue, mergeEntries } from "@/utils/idNumberValue.ts";
import { Character } from "@/services/wh/character/character.ts";

// A class trapping from the generation data: one trapping, or a choice of trappings ("hood,mask"), with a quantity.
export interface ClassTrappingEntry {
  options: string[];
  number: string;
}

// classTrappingEntries lists the class trappings of the career's class. The generation data still names some as
// equipped; they all start carried, and players equip them themselves.
export function classTrappingEntries(career: Career, generationProps: GenerationProps): ClassTrappingEntry[] {
  const classItems = generationProps.classItems[career.careerClass];
  if (classItems === undefined) {
    return [];
  }
  return [...Object.entries(classItems.equipped), ...Object.entries(classItems.carried)].map(([ids, number]) => ({
    options: ids.split(","),
    number: number,
  }));
}

// rollClassTrappings gives the chosen option of each entry (chosen: option index per entry), quantities rolled, as one
// list without values; a trapping named twice gets the sum of the quantities.
export function rollClassTrappings(
  entries: ClassTrappingEntry[],
  chosen: number[],
  rollDiceFn: RollDiceFn = rollDice,
): IdNumberValue[] {
  return mergeEntries(
    entries.map((entry, index) => ({
      id: entry.options[chosen[index]],
      number: rollQuantity(entry.number, rollDiceFn),
      value: "",
    })),
  );
}

// generateClassItems gives the class trappings, with one option of each choice picked at random.
export function generateClassItems(
  career: Career,
  generationProps: GenerationProps,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): IdNumberValue[] {
  const entries = classTrappingEntries(career, generationProps);
  return rollClassTrappings(entries, randomOptions(entries, selectRandomFn), rollDiceFn);
}

// rollQuantity gives a quantity: a number ("10"), or dice with an optional modifier ("1d10", "2d6+3") rolled.
function rollQuantity(quantity: string, rollDiceFn: RollDiceFn): number {
  const match = /^(\d+)(?:d(\d+)([+-]\d+)?)?$/.exec(quantity);
  if (match === null) {
    throw new Error(`Invalid quantity "${quantity}"`);
  }
  const [, count, sides, modifier] = match;
  if (sides === undefined) {
    return parseInt(count, 10);
  }
  return rollDiceFn(parseInt(sides, 10), parseInt(count, 10)) + (modifier === undefined ? 0 : parseInt(modifier, 10));
}

function careerLevels(career: Career, level: GenerationLevel): CareerLevel[] {
  return [career.level1, career.level2, career.level3, career.level4].slice(0, level);
}

// rollCareerTrappings gives the chosen option of each entry (chosen: option index per entry); quantities are rolled
// and a trapping's note becomes its value. Trappings that can be carried start carried, the others (places,
// retainers…) stored. Trappings not in items, and those whose roll is below 1, are left out.
export function rollCareerTrappings(
  entries: CareerTrappingEntry[],
  chosen: number[],
  items: Item[],
  rollDiceFn: RollDiceFn = rollDice,
): { carried: IdNumberValue[]; stored: IdNumberValue[] } {
  const itemMap = new Map(items.map((x) => [x.id, x]));
  const carried: IdNumberValue[] = [];
  const stored: IdNumberValue[] = [];
  entries.forEach((entry, index) => {
    for (const trapping of entry.options[chosen[index]]) {
      const item = itemMap.get(trapping.id);
      const number = rollQuantity(trapping.number, rollDiceFn);
      if (item === undefined || number < 1) {
        continue;
      }
      (item.canBeCarried() ? carried : stored).push({ id: trapping.id, number: number, value: trapping.value });
    }
  });
  return { carried: mergeEntries(carried), stored: mergeEntries(stored) };
}

// generateCareerItems gives the trappings of career levels 1 to level, with one option of each choice picked at random.
export function generateCareerItems(
  career: Career,
  level: GenerationLevel,
  items: Item[],
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): { carried: IdNumberValue[]; stored: IdNumberValue[] } {
  const entries = careerLevels(career, level).flatMap((x) => x.trappings);
  return rollCareerTrappings(entries, randomOptions(entries, selectRandomFn), items, rollDiceFn);
}

// rollCareerMoney rolls career money items into coins: [brass, silver, gold].
export function rollCareerMoney(money: CareerMoney[], rollDiceFn: RollDiceFn = rollDice): [number, number, number] {
  const coins = { brass: 0, silver: 0, gold: 0 };
  for (const item of money) {
    coins[item.coin] += Math.max(rollQuantity(item.number, rollDiceFn), 0);
  }
  return [coins.brass, coins.silver, coins.gold];
}

// generateCareerCoins gives the money of career levels 1 to level (D3), rolled: [brass, silver, gold].
export function generateCareerCoins(
  career: Career,
  level: GenerationLevel,
  rollDiceFn: RollDiceFn = rollDice,
): [number, number, number] {
  return rollCareerMoney(
    careerLevels(career, level).flatMap((x) => x.money),
    rollDiceFn,
  );
}

export function populateClassItems(
  character: Character,
  careerList: Career[],
  generationProps: GenerationProps,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): void {
  const current = character.career;
  const selectedCareer = current && careerList.find((x) => x.id === current.id);
  if (!selectedCareer) {
    return;
  }
  fillUp(character.carriedItems, generateClassItems(selectedCareer, generationProps, rollDiceFn, selectRandomFn));
}
