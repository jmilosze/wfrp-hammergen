// Class trappings from the generation data (choices like "A,B" and quantities like "1d10").
import { Career } from "../../../content/career.ts";
import { GenerationProps } from "./generationProps.ts";
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "../../../../../utils/random.ts";
import { fillUpIdNumberRecord } from "../../../../../utils/idNumber.ts";
import { Character } from "../../character.ts";

// generateClassItems returns the class trappings as one list: they all start carried, and players equip them themselves.
// The generation data still names some as equipped; a trapping named in both lists gets the sum of the quantities.
export function generateClassItems(
  career: Career,
  generationProps: GenerationProps,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): Record<string, number> {
  if (generationProps.classItems.length === 0 || !(career.careerClass in generationProps.classItems)) {
    return {};
  }
  const classItems = generationProps.classItems[career.careerClass];
  const items: Record<string, number> = {};

  for (const [itemIds, itemNumber] of [...Object.entries(classItems.equipped), ...Object.entries(classItems.carried)]) {
    const id = selectIdFromCandidates(itemIds, selectRandomFn);
    items[id] = (items[id] ?? 0) + parseQuantityOrRoll(itemNumber, rollDiceFn);
  }

  return items;
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
  const newCarried = { ...character.carriedItems };
  fillUpIdNumberRecord(newCarried, generateClassItems(selectedCareer, generationProps, rollDiceFn, selectRandomFn));
  character.carriedItems = newCarried;
}
