// 5e characteristics at creation: rolls plus points over the level 1 career characteristics.
import { SelectRandomFn } from "@/utils/random.ts";
import {
  AttributeName,
  Attributes,
  characteristicList,
  getAttributeValue,
  setAttributeValue,
  zeroAttributes,
} from "@/services/wh/core/attributes.ts";

// The ways to settle the characteristics (p. 38): the rolls kept in order (A), rearranged (B), ten new rolls assigned
// freely or 100 points spread (C).
export type CharacteristicsMethod5e = "inOrder" | "rearranged" | "rolledAgain" | "pointSpread";

// The points each method gives over the three level 1 career characteristics. They are not Advances, so they are
// added to the rolls.
export const CREATION_CHARACTERISTIC_POINTS_5E: Record<CharacteristicsMethod5e, number> = {
  inOrder: 6,
  rearranged: 3,
  rolledAgain: 0,
  pointSpread: 0,
};

// randomCreationPoints5e spreads the points over the level 1 career characteristics at random.
export function randomCreationPoints5e(
  level1Attributes: AttributeName[],
  points: number,
  selectRandomFn: SelectRandomFn,
): Attributes {
  const spread = zeroAttributes();
  if (level1Attributes.length === 0) {
    return spread;
  }
  for (let i = 0; i < points; ++i) {
    const att = selectRandomFn(level1Attributes);
    setAttributeValue(att, getAttributeValue(att, spread) + 1, spread);
  }
  return spread;
}

// The point spread of method C: 100 points over the ten characteristics, 4 to 16 each.
export const POINT_SPREAD_TOTAL_5E = 100;
export const POINT_SPREAD_MIN_5E = 4;
export const POINT_SPREAD_MAX_5E = 16;

// The characteristics step of guided creation. Once the new rolls of C are made, A and B are gone (Q2).
export interface GuidedCharacteristics5e {
  firstRolls: Attributes | null;
  newRolls: Attributes | null;
  method: CharacteristicsMethod5e | null;
  // The values as the player has them: the first rolls rearranged (B), the new rolls assigned (C) or the point spread
  // (C); unused when the first rolls are kept in order (A).
  assigned: Attributes;
  // The creation points over the level 1 career characteristics (A and B).
  points: Attributes;
}

export function newGuidedCharacteristics5e(): GuidedCharacteristics5e {
  return { firstRolls: null, newRolls: null, method: null, assigned: zeroAttributes(), points: zeroAttributes() };
}

// The values the method gives, before the species and the points: the first rolls in order (A), else as assigned.
export function characteristicRolls5e(c: GuidedCharacteristics5e): Attributes | null {
  if (c.method === null) {
    return null;
  }
  return c.method === "inOrder" ? c.firstRolls : c.assigned;
}

// pointsFit5e tells whether the creation points stay within the method's points and on the level 1 career
// characteristics.
export function pointsFit5e(
  points: Attributes,
  method: CharacteristicsMethod5e,
  level1Attributes: AttributeName[],
): boolean {
  const total = Object.values(points).reduce((sum, x) => sum + x, 0);
  return (
    total <= CREATION_CHARACTERISTIC_POINTS_5E[method] &&
    characteristicList.every((name) => {
      const x = getAttributeValue(name, points);
      return x >= 0 && (x === 0 || level1Attributes.includes(name));
    })
  );
}

export function pointSpreadValid5e(values: Attributes): boolean {
  const list = Object.values(values);
  return (
    list.reduce((sum, x) => sum + x, 0) === POINT_SPREAD_TOTAL_5E &&
    list.every((x) => Number.isInteger(x) && x >= POINT_SPREAD_MIN_5E && x <= POINT_SPREAD_MAX_5E)
  );
}

function sameValues(a: Attributes, b: Attributes): boolean {
  const sorted = (x: Attributes) =>
    Object.values(x)
      .sort((m, n) => m - n)
      .join();
  return sorted(a) === sorted(b);
}

// characteristicsValid5e tells whether the step is settled by the rules (p. 38).
export function characteristicsValid5e(c: GuidedCharacteristics5e, level1Attributes: AttributeName[]): boolean {
  if (c.method === null || !pointsFit5e(c.points, c.method, level1Attributes)) {
    return false;
  }
  switch (c.method) {
    case "inOrder":
      return c.firstRolls !== null && c.newRolls === null;
    case "rearranged":
      return c.firstRolls !== null && c.newRolls === null && sameValues(c.assigned, c.firstRolls);
    case "rolledAgain":
      return c.newRolls !== null && sameValues(c.assigned, c.newRolls);
    case "pointSpread":
      return pointSpreadValid5e(c.assigned);
  }
}
