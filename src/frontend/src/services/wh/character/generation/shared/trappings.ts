// Class trappings from the generation data (choices like "A,B" and quantities like "1d10").
import { Career } from "@/services/wh/content/career.ts";
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
  if (generationProps.classItems.length === 0 || !(career.careerClass in generationProps.classItems)) {
    return [];
  }
  const classItems = generationProps.classItems[career.careerClass];
  const items = [...Object.entries(classItems.equipped), ...Object.entries(classItems.carried)].map(
    ([itemIds, itemNumber]) => ({
      id: selectIdFromCandidates(itemIds, selectRandomFn),
      number: parseQuantityOrRoll(itemNumber, rollDiceFn),
      value: "",
    }),
  );
  return mergeEntries(items);
}

function selectIdFromCandidates(itemIds: string, selectRandomFn: SelectRandomFn): string {
  const ids = itemIds.split(",");
  return ids.length === 1 ? ids[0] : selectRandomFn(ids);
}

function parseQuantityOrRoll(roll: string, rollDiceFn: RollDiceFn): number {
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
