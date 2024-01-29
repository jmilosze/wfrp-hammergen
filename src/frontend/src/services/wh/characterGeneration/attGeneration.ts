import { diceRoll } from "../../../utils/randomUtils";
import { attCost } from "./expCost";
import {
  Attributes,
  getAttributes,
  AttributeName,
  copyAttributes,
  getAttributeValue,
  setAttributeValue,
} from "../attributes";

export function generateRolls(): Attributes {
  const rolls = getAttributes();
  for (const key of Object.keys(rolls)) {
    rolls[key] = diceRoll(10, 2);
  }
  return rolls;
}

export function generateAdv(
  attNames: AttributeName[],
  attPoints: number,
  currentAttAdvances: Attributes,
): [Attributes, number] {
  const updatedAttAdvances = copyAttributes(currentAttAdvances);
  let cost = 0;

  for (let i = 0; i < attPoints; ++i) {
    const randomAttName = attNames[diceRoll(attNames.length, 1) - 1];
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

  if (fillUpTo > 10000) {
    throw new Error(`fillUpTo to cannot exceed 10000, value used: ${fillUpTo}`);
  }

  for (const attName of attNames) {
    while (getAttributeValue(attName, updatedAttAdvances) < fillUpTo) {
      const careerAttValue = getAttributeValue(attName, updatedAttAdvances);
      cost += attCost(careerAttValue);
      setAttributeValue(attName, careerAttValue + 1, updatedAttAdvances);
    }
  }
  return [updatedAttAdvances, cost];
}
