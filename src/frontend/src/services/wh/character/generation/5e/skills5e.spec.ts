import { ids, selectFirst } from "../fixtures.ts";
import { genProps5e, testSkills5e } from "./fixtures5e.ts";
import { describe, expect, test } from "vitest";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Character } from "../../character.ts";
import { resolveEntityGroups } from "../shared/groups.ts";
import { allocateCreationCareerAdvances5e, generateSpeciesSkills5e, populateSpeciesSkills5e } from "./skills5e.ts";

describe("skills5e", () => {
  test("generateSpeciesSkills5e gives fluent languages +30 and five species skills +5", () => {
    const groups = resolveEntityGroups(testSkills5e);
    for (let i = 0; i < 20; ++i) {
      const skills = generateSpeciesSkills5e(
        genProps5e.speciesSkills[SpeciesWithRegion.HumanReikland],
        genProps5e.speciesLanguages[SpeciesWithRegion.HumanReikland],
        groups,
      );
      expect(skills.lang1).toBe(30);
      expect(skills.lang2).toBe(30);
      const species = Object.entries(skills).filter(([id]) => !id.startsWith("lang"));
      expect(species.length).toBe(5);
      expect(species.every(([, points]) => points === 5)).toBe(true);
      expect(skills).not.toHaveProperty("stealth");
    }
  });

  test("generateSpeciesSkills5e picks a specialisation for a group skill", () => {
    const skills = generateSpeciesSkills5e(["stealth"], [], resolveEntityGroups(testSkills5e), selectFirst);
    expect(skills).toEqual({ stealthRural: 5 });
  });

  test("allocateCreationCareerAdvances5e spends eight Advances, none above +15", () => {
    const skills: Record<string, number> = { s1: 15, s2: 5 };
    allocateCreationCareerAdvances5e(skills, ids("s", 1, 10), selectFirst);
    expect(skills).toEqual({ s1: 15, s2: 15, s3: 15, s4: 15 });

    const few: Record<string, number> = {};
    allocateCreationCareerAdvances5e(few, ["s1", "s2"], selectFirst);
    expect(few).toEqual({ s1: 15, s2: 15 });
  });

  test("populateSpeciesSkills5e keeps higher values", () => {
    const character = new Character({ edition: "5e", species: SpeciesWithRegion.HumanReikland });
    character.skills = { lang1: 40, other: 10 };
    populateSpeciesSkills5e(character, testSkills5e, genProps5e);
    expect(character.skills.lang1).toBe(40);
    expect(character.skills.lang2).toBe(30);
    expect(character.skills.other).toBe(10);
    expect(Object.keys(character.skills).length).toBe(3 + 5);
  });
});
