// 4e characteristic advances (creation and career levels).
import { attCost4e } from "./experience4e.ts";
import {
  Attributes,
  AttributeName,
  copyAttributes,
  getAttributeValue,
  setAttributeValue,
} from "../../../core/attributes.ts";
import { SelectRandomFn } from "../../../../../utils/random.ts";

const MAX_FILL_UP_TO = 1000;

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
    cost += attCost4e(randomAttValue);
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
      cost += attCost4e(careerAttValue);
      setAttributeValue(attName, careerAttValue + 1, updatedAttAdvances);
    }
  }
  return [updatedAttAdvances, cost];
}
