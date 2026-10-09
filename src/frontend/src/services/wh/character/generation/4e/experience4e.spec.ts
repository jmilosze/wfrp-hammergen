import { describe, expect, test } from "vitest";
import { attCost4e, skillCost4e } from "./experience4e.ts";

describe("4e XP costs", () => {
  test("skill and characteristic advances cost by bracket of 5 advances already taken", () => {
    expect(skillCost4e(0)).toBe(10);
    expect(skillCost4e(4)).toBe(10);
    expect(skillCost4e(5)).toBe(15);
    expect(skillCost4e(70)).toBe(440);
    expect(skillCost4e(100)).toBe(440);
    expect(attCost4e(0)).toBe(25);
    expect(attCost4e(10)).toBe(40);
    expect(attCost4e(100)).toBe(520);
  });
});
