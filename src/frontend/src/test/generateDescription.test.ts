import { describe, expect, test } from "vitest";
import generateDescription from "../services/wh/characterGeneration/generateDescription.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";

describe("generateDescription generates valid descriptions for all species", () => {
  const speciesList: SpeciesWithRegion[] = [
    SpeciesWithRegion.HumanReikland,
    SpeciesWithRegion.HumanTilea,
    SpeciesWithRegion.HumanNorseBjornling,
    SpeciesWithRegion.HalflingDefault,
    SpeciesWithRegion.DwarfDefault,
    SpeciesWithRegion.HighElfDefault,
    SpeciesWithRegion.WoodElfDefault,
    SpeciesWithRegion.GnomeDefault,
    SpeciesWithRegion.OgreDefault,
  ];

  test.each(speciesList)("generates description for species %s", (species) => {
    const desc = generateDescription(species);
    expect(desc).toBeTypeOf("string");
    expect(desc).toMatch(/^Age: \d+, Height: \d+'\d+", Eyes: .+, Hair: .+$/);
  });
});
