// Class trappings from the generation data (choices like "A,B" and quantities like "1d10") and career trappings and
// money from the career levels (HG-40).
import { Career, CareerLevel, GenerationLevel } from "@/services/wh/content/career.ts";
import { Item } from "@/services/wh/content/item.ts";
import { GenerationProps } from "./generationProps.ts";
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "@/utils/random.ts";
import { fillUp, IdNumberValue, mergeEntries } from "@/utils/idNumberValue.ts";
import { Character } from "@/services/wh/character/character.ts";

// generateClassItems returns the class trappings as one list (without values): they all start carried, and players
// equip them themselves. The generation data still names some as equipped; a trapping named in both lists gets the sum
// of the quantities.
export function generateClassItems(
  career: Career,
  generationProps: GenerationProps,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): IdNumberValue[] {
  const classItems = generationProps.classItems[career.careerClass];
  if (classItems === undefined) {
    return [];
  }
  const items = [...Object.entries(classItems.equipped), ...Object.entries(classItems.carried)].map(
    ([itemIds, itemNumber]) => ({
      id: selectIdFromCandidates(itemIds, selectRandomFn),
      number: rollQuantity(itemNumber, rollDiceFn),
      value: "",
    }),
  );
  return mergeEntries(items);
}

function selectIdFromCandidates(itemIds: string, selectRandomFn: SelectRandomFn): string {
  const ids = itemIds.split(",");
  return ids.length === 1 ? ids[0] : selectRandomFn(ids);
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

// generateCareerItems gives the trappings of career levels 1 to level (D8): of each entry one option, picked at random
// when there are several; quantities are rolled and a trapping's note becomes its value. Trappings that can be carried
// start carried, the others (places, retainers…) stored. Trappings not in items, and those whose roll is below 1, are
// left out.
export function generateCareerItems(
  career: Career,
  level: GenerationLevel,
  items: Item[],
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): { carried: IdNumberValue[]; stored: IdNumberValue[] } {
  const itemMap = new Map(items.map((x) => [x.id, x]));
  const carried: IdNumberValue[] = [];
  const stored: IdNumberValue[] = [];
  for (const careerLevel of careerLevels(career, level)) {
    for (const entry of careerLevel.trappings) {
      const option = entry.options.length === 1 ? entry.options[0] : selectRandomFn(entry.options);
      for (const trapping of option) {
        const item = itemMap.get(trapping.id);
        const number = rollQuantity(trapping.number, rollDiceFn);
        if (item === undefined || number < 1) {
          continue;
        }
        (item.canBeCarried() ? carried : stored).push({ id: trapping.id, number: number, value: trapping.value });
      }
    }
  }
  return { carried: mergeEntries(carried), stored: mergeEntries(stored) };
}

// generateCareerCoins gives the money of career levels 1 to level (D3), rolled: [brass, silver, gold].
export function generateCareerCoins(
  career: Career,
  level: GenerationLevel,
  rollDiceFn: RollDiceFn = rollDice,
): [number, number, number] {
  const coins = { brass: 0, silver: 0, gold: 0 };
  for (const careerLevel of careerLevels(career, level)) {
    for (const money of careerLevel.money) {
      coins[money.coin] += Math.max(rollQuantity(money.number, rollDiceFn), 0);
    }
  }
  return [coins.brass, coins.silver, coins.gold];
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
