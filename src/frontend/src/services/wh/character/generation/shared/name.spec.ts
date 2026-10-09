import { describe, expect, test } from "vitest";
import { generateName, Sex, populateName } from "./name.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Character } from "../../character.ts";

describe("generateName generates non-empty names for all species", () => {
  const speciesList: SpeciesWithRegion[] = [
    SpeciesWithRegion.HumanReikland,
    SpeciesWithRegion.HumanTilea,
    SpeciesWithRegion.HumanNorseBjornling,
    SpeciesWithRegion.HumanNorseSarl,
    SpeciesWithRegion.HumanNorseSkaeling,
    SpeciesWithRegion.HalflingDefault,
    SpeciesWithRegion.DwarfDefault,
    SpeciesWithRegion.HighElfDefault,
    SpeciesWithRegion.WoodElfDefault,
    SpeciesWithRegion.GnomeDefault,
    SpeciesWithRegion.OgreDefault,
  ];

  test.each(speciesList)("generates male and female names for species %s", (species) => {
    const maleName = generateName(species, Sex.Male);
    expect(maleName).toBeTypeOf("string");
    expect(maleName.length).toBeGreaterThan(0);

    const femaleName = generateName(species, Sex.Female);
    expect(femaleName).toBeTypeOf("string");
    expect(femaleName.length).toBeGreaterThan(0);

    const randomSexName = generateName(species);
    expect(randomSexName).toBeTypeOf("string");
    expect(randomSexName.length).toBeGreaterThan(0);
  });

  test("returns empty string for unhandled species", () => {
    expect(generateName(SpeciesWithRegion.None)).toEqual("");
  });
});

describe("populateName", () => {
  test("populateName sets non-empty name on character", () => {
    const char = new Character({ species: SpeciesWithRegion.DwarfDefault });
    populateName(char);
    expect(char.name.length).toBeGreaterThan(0);
  });
});
