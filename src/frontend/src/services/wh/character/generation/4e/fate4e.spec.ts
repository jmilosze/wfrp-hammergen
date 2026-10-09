import { describe, expect, test } from "vitest";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Character } from "../../character.ts";
import { generateFateAndResilience, populateFateAndResilience } from "./fate4e.ts";

describe("fate4e", () => {
  test("generateFateAndResilience allocates extra points using dice rolls", () => {
    expect(generateFateAndResilience(SpeciesWithRegion.HumanReikland, () => 1)).toEqual([2 + 3, 1]);
    expect(generateFateAndResilience(SpeciesWithRegion.HumanReikland, () => 2)).toEqual([2, 1 + 3]);
  });

  test("populateFateAndResilience generates and updates fate and resilience", () => {
    const character = new Character({ species: SpeciesWithRegion.HumanReikland });
    populateFateAndResilience(character, () => 2);
    expect(character.fate).toBe(2);
    expect(character.resilience).toBe(1 + 3);
    expect(character.fortune).toBe(character.fate);
    expect(character.resolve).toBe(character.resilience);
  });
});
