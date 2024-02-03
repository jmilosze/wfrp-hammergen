import { rollDice } from "../../../utils/randomUtils";
import { attCost } from "./expCost";
import {
  Attributes,
  getAttributes,
  AttributeName,
  copyAttributes,
  getAttributeValue,
  setAttributeValue,
} from "../attributes";

const MAX_FILL_UP_TO = 1000;

export function generateRolls(): Attributes {
  const rolls = getAttributes();
  for (const key of Object.keys(rolls)) {
    rolls[key] = rollDice(10, 2);
  }
  return rolls;
}

export function generateAdv(
  attNames: AttributeName[],
  attPoints: number,
  currentAttAdvances: Attributes,
  currentCost: number,
): [Attributes, number] {
  const updatedAttAdvances = copyAttributes(currentAttAdvances);
  let cost = currentCost;

  for (let i = 0; i < attPoints; ++i) {
    const randomAttName = attNames[rollDice(attNames.length, 1) - 1];
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
