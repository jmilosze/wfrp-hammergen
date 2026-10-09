// Class trappings from the generation data (choices like "A,B" and quantities like "1d10").
import { Career } from "../../../content/career.ts";
import { GenerationProps } from "./generationProps.ts";
import { rollDice, RollDiceFn, selectRandom, SelectRandomFn } from "../../../../../utils/random.ts";
import { IdNumber, fillUpIdNumberRecord, idNumberArrayToRecord } from "../../../../../utils/idNumber.ts";
import { Character } from "../../character.ts";

export function generateClassItems(
  career: Career,
  generationProps: GenerationProps,
  rollDiceFn: RollDiceFn = rollDice,
  selectRandomFn: SelectRandomFn = selectRandom,
): { equipped: IdNumber[]; carried: IdNumber[] } {
  if (generationProps.classItems.length === 0 || !(career.careerClass in generationProps.classItems)) {
    return { equipped: [], carried: [] };
  }
  const classItems = generationProps.classItems[career.careerClass];
  const items: { equipped: IdNumber[]; carried: IdNumber[] } = { equipped: [], carried: [] };

  for (const [itemIds, itemNumber] of Object.entries(classItems.equipped)) {
    const id = selectIdFromCandidates(itemIds, selectRandomFn);
    const number = parseQuantityOrRoll(itemNumber, rollDiceFn);
    items.equipped.push({ id, number });
  }

  for (const [itemIds, itemNumber] of Object.entries(classItems.carried)) {
    const id = selectIdFromCandidates(itemIds, selectRandomFn);
    const number = parseQuantityOrRoll(itemNumber, rollDiceFn);
    items.carried.push({ id, number });
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
  const generatedItems = generateClassItems(selectedCareer, generationProps, rollDiceFn, selectRandomFn);
  const newEquipped = { ...character.equippedItems };
  const newCarried = { ...character.carriedItems };
  fillUpIdNumberRecord(newEquipped, idNumberArrayToRecord(generatedItems.equipped));
  fillUpIdNumberRecord(newCarried, idNumberArrayToRecord(generatedItems.carried));
  character.equippedItems = newEquipped;
  character.carriedItems = newCarried;
}
