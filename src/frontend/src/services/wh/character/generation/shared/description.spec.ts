import { describe, expect, test } from "vitest";
import { generateDescription, populateDescription } from "./description.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Character } from "../../character.ts";

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

describe("populateDescription", () => {
  test("populateDescription sets non-empty description on character", () => {
    const char = new Character({ species: SpeciesWithRegion.HighElfDefault });
    populateDescription(char);
    expect(char.description).toMatch(/^Age: \d+, Height: \d+'\d+", Eyes: .+, Hair: .+$/);
  });
});
