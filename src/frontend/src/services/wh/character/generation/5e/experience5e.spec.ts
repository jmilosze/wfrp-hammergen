import { describe, expect, test } from "vitest";
import { characteristicCost5e, skillCost5e } from "./experience5e.ts";

describe("5e XP costs", () => {
  test("characteristic and skill Advances cost by the Advances already taken", () => {
    expect(characteristicCost5e(0)).toBe(125);
    expect(characteristicCost5e(5)).toBe(175);
    expect(characteristicCost5e(25)).toBe(700);
    expect(characteristicCost5e(70)).toBe(11250);
    expect(characteristicCost5e(100)).toBe(11250);
    expect(skillCost5e(0)).toBe(50);
    expect(skillCost5e(10)).toBe(100);
    expect(skillCost5e(30)).toBe(600);
  });
});
