import { selectFirst } from "@/services/wh/character/generation/fixtures.ts";
import { describe, expect, test } from "vitest";
import { AttributeName, zeroAttributes } from "@/services/wh/core/attributes.ts";
import {
  characteristicRolls5e,
  characteristicsValid5e,
  GuidedCharacteristics5e,
  newGuidedCharacteristics5e,
  pointSpreadValid5e,
  randomCreationPoints5e,
} from "./characteristics5e.ts";

describe("characteristics5e", () => {
  test("randomCreationPoints5e spreads the points over the given characteristics only", () => {
    for (let i = 0; i < 20; ++i) {
      const points = randomCreationPoints5e(
        [AttributeName.WS, AttributeName.Dex, AttributeName.Fel],
        6,
        (array) => array[Math.floor(Math.random() * array.length)],
      );
      expect(points.WS + points.Dex + points.Fel).toBe(6);
      expect([points.BS, points.S, points.T, points.I, points.Ag, points.Int, points.WP]).toEqual(Array(7).fill(0));
    }
    expect(randomCreationPoints5e([AttributeName.WS, AttributeName.Dex], 3, selectFirst).WS).toBe(3);
    expect(Object.values(randomCreationPoints5e([], 6, selectFirst)).every((x) => x === 0)).toBe(true);
  });
});

describe("guided characteristics5e", () => {
  const level1 = [AttributeName.WS, AttributeName.BS, AttributeName.S];
  const rolls = { WS: 2, BS: 3, S: 4, T: 5, I: 6, Ag: 7, Dex: 8, Int: 9, WP: 10, Fel: 11 };
  const step = (c: Partial<GuidedCharacteristics5e>): GuidedCharacteristics5e => ({
    ...newGuidedCharacteristics5e(),
    firstRolls: rolls,
    ...c,
  });

  test("A keeps the rolls in order with all 6 points on the level 1 characteristics", () => {
    const a = step({ method: "inOrder", points: { ...zeroAttributes(), WS: 4, S: 2 } });
    expect(characteristicsValid5e(a, level1)).toBe(true);
    expect(characteristicRolls5e(a)).toEqual(rolls);
    expect(characteristicsValid5e({ ...a, points: { ...zeroAttributes(), WS: 7 } }, level1)).toBe(false);
    expect(characteristicsValid5e({ ...a, points: { ...zeroAttributes(), WS: 5 } }, level1)).toBe(false);
    expect(characteristicsValid5e({ ...a, points: { ...zeroAttributes(), T: 1 } }, level1)).toBe(false);
  });

  test("B rearranges the same rolls, with all 3 points", () => {
    const b = step({
      method: "rearranged",
      assigned: { ...rolls, WS: 11, Fel: 2 },
      points: { ...zeroAttributes(), BS: 3 },
    });
    expect(characteristicsValid5e(b, level1)).toBe(true);
    expect(characteristicsValid5e({ ...b, points: zeroAttributes() }, level1)).toBe(false);
    expect(characteristicRolls5e(b)?.WS).toBe(11);
    expect(characteristicsValid5e({ ...b, assigned: { ...rolls, WS: 20 } }, level1)).toBe(false);
    expect(characteristicsValid5e({ ...b, points: { ...zeroAttributes(), WS: 4 } }, level1)).toBe(false);
  });

  test("once new rolls are made, A and B are gone; C assigns them with no points", () => {
    const newRolls = { ...rolls, WS: 20 };
    expect(characteristicsValid5e(step({ method: "inOrder", newRolls }), level1)).toBe(false);
    const c = step({ method: "rolledAgain", newRolls, assigned: { ...newRolls, WS: 11, Fel: 20 } });
    expect(characteristicsValid5e(c, level1)).toBe(true);
    expect(characteristicsValid5e({ ...c, points: { ...zeroAttributes(), WS: 1 } }, level1)).toBe(false);
  });

  test("the point spread is 100 points, 4 to 16 each", () => {
    const spread = { WS: 16, BS: 4, S: 10, T: 10, I: 10, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 };
    expect(pointSpreadValid5e(spread)).toBe(true);
    expect(pointSpreadValid5e({ ...spread, WS: 17, BS: 3 })).toBe(false);
    expect(pointSpreadValid5e({ ...spread, WS: 15 })).toBe(false);
    expect(characteristicsValid5e(step({ method: "pointSpread", firstRolls: null, assigned: spread }), level1)).toBe(
      true,
    );
  });

  test("a career with no level 1 characteristics has no points to spend", () => {
    expect(characteristicsValid5e(step({ method: "inOrder" }), [])).toBe(true);
    expect(characteristicsValid5e(step({ method: "rearranged", assigned: rolls }), [])).toBe(true);
    expect(characteristicsValid5e(step({ method: "inOrder" }), level1)).toBe(false);
  });
});
