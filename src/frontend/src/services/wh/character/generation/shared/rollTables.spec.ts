import { describe, expect, test } from "vitest";
import { getRollDiceTest } from "@/testing.ts";
import { rollOnTable, rollTableValid } from "./rollTables.ts";

describe("rollTables", () => {
  const table = [
    { id: "human", minRoll: 1, maxRoll: 91 },
    { id: "halfling", minRoll: 91, maxRoll: 100 },
    { id: "woodElf", minRoll: 100, maxRoll: 101 },
  ];

  test("rollOnTable gives the roll and the row it lands on", () => {
    expect(rollOnTable(table, getRollDiceTest(90))).toEqual({ roll: 90, id: "human" });
    expect(rollOnTable(table, getRollDiceTest(91))).toEqual({ roll: 91, id: "halfling" });
    expect(rollOnTable(table, getRollDiceTest(100))).toEqual({ roll: 100, id: "woodElf" });
  });

  test("rollTableValid needs 1 to 100 covered once, each id once", () => {
    expect(rollTableValid(table)).toBe(true);
    expect(rollTableValid([])).toBe(true);
    expect(rollTableValid(table.slice(0, 2))).toBe(false);
    expect(rollTableValid([...table.slice(0, 2), { id: "human", minRoll: 100, maxRoll: 101 }])).toBe(false);
    expect(
      rollTableValid([
        { id: "a", minRoll: 1, maxRoll: 60 },
        { id: "b", minRoll: 50, maxRoll: 101 },
      ]),
    ).toBe(false);
  });
});
