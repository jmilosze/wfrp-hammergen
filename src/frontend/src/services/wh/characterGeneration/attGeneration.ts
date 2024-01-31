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

const MAX_FILL_UP_TO = 1000;

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

  for (const attName of attNames) {
    let i: number;
    for (i = 0; i < MAX_FILL_UP_TO; ++i) {
      const careerAttValue = getAttributeValue(attName, updatedAttAdvances);
      if (careerAttValue >= fillUpTo) {
        break;
      }
      cost += attCost(careerAttValue);
      setAttributeValue(attName, careerAttValue + 1, updatedAttAdvances);
    }
    if (i === MAX_FILL_UP_TO - 1) {
      throw new Error(`fillUpTo to cannot exceed ${MAX_FILL_UP_TO}, value used: ${fillUpTo}`);
    }
  }
  return [updatedAttAdvances, cost];
}
