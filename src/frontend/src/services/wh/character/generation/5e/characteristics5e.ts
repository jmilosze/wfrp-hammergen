// 5e characteristics at creation: rolls plus six points over the level 1 career characteristics.
import { RollDiceFn, SelectRandomFn } from "../../../../../utils/random.ts";
import { AttributeName, Attributes, getAttributeValue, setAttributeValue } from "../../../core/attributes.ts";
import { generateRolls } from "../shared/characteristics.ts";

// Kept in order: up to six points over the three level 1 career characteristics (p. 38).
const CREATION_CHARACTERISTIC_POINTS = 6;

// 2d10 for each characteristic, then six points over the career's level 1 characteristics. The points are not
// Advances, so they are added to the rolls.
export function generateRolls5e(
  level1Attributes: AttributeName[],
  rollDiceFn: RollDiceFn,
  selectRandomFn: SelectRandomFn,
): Attributes {
  const rolls = generateRolls(rollDiceFn);
  if (level1Attributes.length === 0) {
    return rolls;
  }
  for (let i = 0; i < CREATION_CHARACTERISTIC_POINTS; ++i) {
    const att = selectRandomFn(level1Attributes);
    setAttributeValue(att, getAttributeValue(att, rolls) + 1, rolls);
  }
  return rolls;
}
