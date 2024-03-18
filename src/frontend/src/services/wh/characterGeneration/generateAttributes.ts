import { attCost } from "./calculateExperience.ts";
import {
  Attributes,
  getAttributes,
  AttributeName,
  copyAttributes,
  getAttributeValue,
  setAttributeValue,
} from "../attributes.ts";
import { RollDiceFn, SelectRandomFn } from "../../../utils/random.ts";
import { isKey } from "../../../utils/object.ts";

const MAX_FILL_UP_TO = 1000;

export function generateRolls(rollDiceFn: RollDiceFn): Attributes {
  const rolls = getAttributes();
  for (const key of Object.keys(rolls)) {
    if (isKey(rolls, key)) {
      rolls[key] = rollDiceFn(10, 2);
    }
  }
  return rolls;
}

export function generateAdv(
  attNames: AttributeName[],
  attPoints: number,
  currentAttAdvances: Attributes,
  currentCost: number,
  selectRandomFn: SelectRandomFn,
): [Attributes, number] {
  const updatedAttAdvances = copyAttributes(currentAttAdvances);
  let cost = currentCost;

  for (let i = 0; i < attPoints; ++i) {
    const randomAttName = selectRandomFn(attNames);
    const randomAttValue = getAttributeValue(randomAttName, updatedAttAdvances);
    cost += attCost(randomAttValue);
    setAttributeValue(randomAttName, randomAttValue + 1, updatedAttAdvances);
  }
  return [updatedAttAdvances, cost];
}

export function fillUpAdv(
  attNames: AttributeName[],
  fillUpTo: number,
  currentAttAdvances: Attributes,
  currentCost: number,
): [Attributes, number] {
  const updatedAttAdvances = copyAttributes(currentAttAdvances);
  let cost = currentCost;

  if (fillUpTo > MAX_FILL_UP_TO) {
    throw new Error(`fillUpTo to cannot exceed ${MAX_FILL_UP_TO}, value used: ${fillUpTo}`);
  }

  for (const attName of attNames) {
    for (let i = 0; i < fillUpTo; ++i) {
      const careerAttValue = getAttributeValue(attName, updatedAttAdvances);
      if (careerAttValue >= fillUpTo) {
        break;
      }
      cost += attCost(careerAttValue);
      setAttributeValue(attName, careerAttValue + 1, updatedAttAdvances);
    }
  }
  return [updatedAttAdvances, cost];
}
