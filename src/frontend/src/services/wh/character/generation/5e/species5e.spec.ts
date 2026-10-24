import { describe, expect, test } from "vitest";
import { getRollDiceTest } from "@/testing.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { rollTableValid } from "@/services/wh/character/generation/shared/rollTables.ts";
import { pickedSpecies5e, rollSpecies5e, SPECIES_TABLE_5E, speciesFortuneBonus5e } from "./species5e.ts";

describe("species5e", () => {
  test("the Species Table covers 1 to 100 with the book's ranges", () => {
    expect(rollTableValid(SPECIES_TABLE_5E)).toBe(true);
    expect(rollSpecies5e(getRollDiceTest(90))).toEqual({ roll: 90, species: SpeciesWithRegion.HumanReikland });
    expect(rollSpecies5e(getRollDiceTest(94)).species).toBe(SpeciesWithRegion.HalflingDefault);
    expect(rollSpecies5e(getRollDiceTest(98)).species).toBe(SpeciesWithRegion.DwarfDefault);
    expect(rollSpecies5e(getRollDiceTest(99)).species).toBe(SpeciesWithRegion.HighElfDefault);
    expect(rollSpecies5e(getRollDiceTest(100)).species).toBe(SpeciesWithRegion.WoodElfDefault);
  });

  const rolls = [
    { roll: 93, species: SpeciesWithRegion.HalflingDefault },
    { roll: 12, species: SpeciesWithRegion.HumanReikland },
  ];

  test("the species is the kept roll's or the chosen one", () => {
    expect(pickedSpecies5e(rolls, { fromRoll: 1 })).toBe(SpeciesWithRegion.HumanReikland);
    expect(pickedSpecies5e(rolls, { chosen: SpeciesWithRegion.DwarfDefault })).toBe(SpeciesWithRegion.DwarfDefault);
  });

  test("+1 Fortune only for keeping the first roll without rolling again", () => {
    expect(speciesFortuneBonus5e(rolls.slice(0, 1), { fromRoll: 0 })).toBe(1);
    expect(speciesFortuneBonus5e(rolls, { fromRoll: 0 })).toBe(0);
    expect(speciesFortuneBonus5e(rolls, { fromRoll: 1 })).toBe(0);
    expect(speciesFortuneBonus5e(rolls.slice(0, 1), { chosen: SpeciesWithRegion.HalflingDefault })).toBe(0);
  });
});
