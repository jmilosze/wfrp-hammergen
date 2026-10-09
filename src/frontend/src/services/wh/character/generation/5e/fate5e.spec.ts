import { describe, expect, test } from "vitest";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Character } from "../../character.ts";
import { getFateFortune5e, populateFateFortune5e } from "./fate5e.ts";

describe("fate5e", () => {
  test("getFateFortune5e returns each species' Fate and Fortune", () => {
    expect(getFateFortune5e(SpeciesWithRegion.HumanReikland)).toEqual({ fate: 4, fortune: 3 });
    expect(getFateFortune5e(SpeciesWithRegion.DwarfDefault)).toEqual({ fate: 2, fortune: 2 });
    expect(getFateFortune5e(SpeciesWithRegion.HalflingDefault)).toEqual({ fate: 2, fortune: 3 });
    expect(getFateFortune5e(SpeciesWithRegion.HighElfDefault)).toEqual({ fate: 1, fortune: 2 });
    expect(getFateFortune5e(SpeciesWithRegion.WoodElfDefault)).toEqual({ fate: 1, fortune: 2 });
    expect(() => getFateFortune5e(SpeciesWithRegion.GnomeDefault)).toThrow();
  });

  test("populateFateFortune5e sets the species values", () => {
    const character = new Character({ edition: "5e", species: SpeciesWithRegion.DwarfDefault });
    populateFateFortune5e(character);
    expect(character.fate).toBe(2);
    expect(character.fortune).toBe(2);
  });
});
