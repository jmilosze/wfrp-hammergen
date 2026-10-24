import { describe, expect, test } from "vitest";
import { getRollDiceTest } from "@/testing.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import {
  canKeepCareerRoll5e,
  careerBonusTrappings5e,
  CareerRoll5e,
  careerRollStage5e,
  pickedCareer5e,
  rollCareers5e,
} from "./career5e.ts";

const HUMAN = SpeciesWithRegion.HumanReikland;
const DWARF = SpeciesWithRegion.DwarfDefault;
const table = [
  { id: "apothecary", minRoll: 1, maxRoll: 51 },
  { id: "soldier", minRoll: 51, maxRoll: 101 },
];
const roll = (career: string, species = HUMAN): CareerRoll5e => ({ roll: 10, species: species, career: career });

describe("career5e", () => {
  test("rolls the first roll, then two more, then one at a time", () => {
    const first = rollCareers5e([], table, HUMAN, getRollDiceTest(70));
    expect(first).toEqual([{ roll: 70, species: HUMAN, career: "soldier" }]);
    const three = rollCareers5e(first, table, HUMAN, getRollDiceTest(10));
    expect(three.map((x) => x.career)).toEqual(["soldier", "apothecary", "apothecary"]);
    expect(rollCareers5e(three, table, HUMAN, getRollDiceTest(10))).toHaveLength(4);
  });

  test("the stage follows the number of rolls", () => {
    expect(careerRollStage5e([])).toBe("none");
    expect(careerRollStage5e([roll("a")])).toBe("first");
    expect(careerRollStage5e([roll("a"), roll("b"), roll("c")])).toBe("three");
    expect(careerRollStage5e([roll("a"), roll("b"), roll("c"), roll("d")])).toBe("later");
  });

  test("keeps the first roll, one of three, or the latest; never one rolled for another species", () => {
    const three = [roll("a"), roll("b"), roll("c")];
    expect(canKeepCareerRoll5e(three, 0, HUMAN)).toBe(true);
    expect(canKeepCareerRoll5e(three, 2, HUMAN)).toBe(true);
    const four = [...three, roll("d")];
    expect(canKeepCareerRoll5e(four, 2, HUMAN)).toBe(false);
    expect(canKeepCareerRoll5e(four, 3, HUMAN)).toBe(true);
    expect(canKeepCareerRoll5e([roll("a", DWARF)], 0, HUMAN)).toBe(false);
  });

  test("level 2 trappings: two for the first roll, one for one of three, none after or for choosing", () => {
    const three = [roll("a"), roll("b"), roll("c")];
    expect(careerBonusTrappings5e([roll("a")], { fromRoll: 0 })).toBe(2);
    expect(careerBonusTrappings5e(three, { fromRoll: 0 })).toBe(1);
    expect(careerBonusTrappings5e([...three, roll("d")], { fromRoll: 3 })).toBe(0);
    expect(careerBonusTrappings5e([roll("a")], { chosen: "a" })).toBe(0);
    expect(pickedCareer5e(three, { fromRoll: 1 })).toBe("b");
    expect(pickedCareer5e(three, { chosen: "x" })).toBe("x");
  });
});
