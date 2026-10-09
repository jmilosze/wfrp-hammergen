import { selectFirst } from "../fixtures.ts";
import { describe, expect, test } from "vitest";
import { AttributeName } from "../../../core/attributes.ts";
import { generateRolls5e } from "./characteristics5e.ts";

describe("characteristics5e", () => {
  test("generateRolls5e adds six points to the level 1 career characteristics only", () => {
    for (let i = 0; i < 20; ++i) {
      const level1 = [AttributeName.WS, AttributeName.Dex, AttributeName.Fel];
      const rolls = generateRolls5e(
        level1,
        () => 10,
        (array) => array[Math.floor(Math.random() * array.length)],
      );
      expect(rolls.WS + rolls.Dex + rolls.Fel).toBe(36);
      expect([rolls.BS, rolls.S, rolls.T, rolls.I, rolls.Ag, rolls.Int, rolls.WP]).toEqual(Array(7).fill(10));
    }
    expect(generateRolls5e([AttributeName.WS, AttributeName.BS, AttributeName.S], () => 10, selectFirst).WS).toBe(16);
  });
});
