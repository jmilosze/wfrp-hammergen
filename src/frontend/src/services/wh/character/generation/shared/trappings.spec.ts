import { describe, expect, test } from "vitest";
import { generateClassItems, populateClassItems } from "./trappings.ts";
import { Career } from "@/services/wh/content/career.ts";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { GenerationProps } from "./generationProps.ts";
import { Character } from "@/services/wh/character/character.ts";

describe("generateClassItems", () => {
  const dummyGenProps: GenerationProps = {
    classItems: [
      {
        equipped: { item1: "1", item2: "2" },
        carried: { item3: "1d10" },
      },
    ],
    randomTalents: [],
    speciesTalents: { [SpeciesWithRegion.HumanReikland]: [] },
    speciesSkills: {},
  };

  test("generateClassItems returns items for valid career class", () => {
    const career = new Career({ careerClass: 0 });
    const result = generateClassItems(career, dummyGenProps, () => 5);
    expect(result).toEqual([
      { id: "item1", number: 1, value: "" },
      { id: "item2", number: 2, value: "" },
      { id: "item3", number: 5, value: "" },
    ]);
  });
});

describe("populateClassItems", () => {
  const dummyGenProps: GenerationProps = {
    classItems: [
      {
        equipped: { item1: "1", item2: "2" },
        carried: { item3: "1d10" },
      },
    ],
    randomTalents: [
      { id: "rand1", minRoll: 1, maxRoll: 50 },
      { id: "rand2", minRoll: 50, maxRoll: 101 },
    ],
    speciesTalents: {
      [SpeciesWithRegion.HumanReikland]: ["talent1", "talent2"],
    },
    speciesSkills: {
      [SpeciesWithRegion.HumanReikland]: ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"],
    },
  };

  test("populateClassItems fills up the carried trappings without a value", () => {
    const career = new Career({ id: "c1", careerClass: 0 });
    const char = new Character({
      career: { id: "c1", number: 1 },
      carriedItems: [
        { id: "item1", number: 1, value: "Axe" },
        { id: "item2", number: 5, value: "" },
      ],
    });

    populateClassItems(char, [career], dummyGenProps, () => 3);
    expect(char.equippedItems).toEqual([]);
    expect(char.carriedItems).toEqual([
      { id: "item1", number: 1, value: "Axe" },
      { id: "item2", number: 5, value: "" },
      { id: "item1", number: 1, value: "" },
      { id: "item3", number: 3, value: "" },
    ]);
  });
});
