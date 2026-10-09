import { describe, expect, test } from "vitest";
import { generateClassItems, populateClassItems } from "./trappings.ts";
import { Career } from "../../../content/career.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { GenerationProps } from "./generationProps.ts";
import { Character } from "../../character.ts";

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
    expect(result.equipped.length).toEqual(2);
    expect(result.carried.length).toEqual(1);
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

  test("populateClassItems updates equipped and carried items on character", () => {
    const career = new Career({ id: "c1", careerClass: 0 });
    const char = new Character({ career: { id: "c1", number: 1 } });

    populateClassItems(char, [career], dummyGenProps, () => 3);
    expect(Object.keys(char.equippedItems).length).toBe(2);
    expect(Object.keys(char.carriedItems).length).toBe(1);
  });
});
