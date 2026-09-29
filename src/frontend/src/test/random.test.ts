import { describe, expect, test } from "vitest";
import { rollDice, rollInTable, selectRandom, selectWeighted } from "../utils/random.ts";
import { getRollDiceTest } from "./commonTests.ts";

describe("random utilities", () => {
  describe("selectRandom", () => {
    test("selects an element from array", () => {
      const items = ["a", "b", "c"];
      const result = selectRandom(items);
      expect(items).toContain(result);
    });
  });

  describe("rollDice", () => {
    test("rolls within expected range", () => {
      const roll = rollDice(6, 2);
      expect(roll).toBeGreaterThanOrEqual(2);
      expect(roll).toBeLessThanOrEqual(12);
    });
  });

  describe("rollInTable", () => {
    test("finds entry corresponding to roll", () => {
      const table: [string, number, number][] = [
        ["first", 1, 5],
        ["second", 5, 11],
      ];
      const result = rollInTable(10, 1, table);
      expect(["first", "second"]).toContain(result);
    });
  });

  describe("selectWeighted", () => {
    const items = [
      { id: "A", weight: 20 },
      { id: "B", weight: 30 },
      { id: "C", weight: 50 },
    ];

    test("selects first item when roll falls in first range", () => {
      const result = selectWeighted(items, (x) => x.weight, getRollDiceTest(15));
      expect(result.id).toBe("A");
    });

    test("selects second item when roll falls in second range", () => {
      const result = selectWeighted(items, (x) => x.weight, getRollDiceTest(35));
      expect(result.id).toBe("B");
    });

    test("selects third item when roll falls in third range", () => {
      const result = selectWeighted(items, (x) => x.weight, getRollDiceTest(80));
      expect(result.id).toBe("C");
    });

    test("throws error when items array is empty", () => {
      expect(() => selectWeighted([], () => 1)).toThrow("cannot select from items without positive weights");
    });

    test("throws error when all weights are zero", () => {
      expect(() => selectWeighted([{ id: "A" }], () => 0)).toThrow("cannot select from items without positive weights");
    });
  });
});
