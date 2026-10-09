// Characteristic rolls (2d10), the same in both editions.
import { Attributes, zeroAttributes } from "../../../core/attributes.ts";
import { RollDiceFn } from "../../../../../utils/random.ts";
import { isKey } from "../../../../../utils/object.ts";

// 2d10 for each characteristic (both editions).
export function generateRolls(rollDiceFn: RollDiceFn): Attributes {
  const rolls = zeroAttributes();
  for (const key of Object.keys(rolls)) {
    if (isKey(rolls, key)) {
      rolls[key] = rollDiceFn(10, 2);
    }
  }
  return rolls;
}
