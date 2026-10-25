import { ids, selectFirst } from "@/services/wh/character/generation/fixtures.ts";
import { genProps5e, testSkills5e } from "./fixtures5e.ts";
import { describe, expect, test } from "vitest";
import { SpeciesWithRegion } from "@/services/wh/core/species.ts";
import { Character } from "@/services/wh/character/character.ts";
import { resolveEntityGroups } from "@/services/wh/character/generation/shared/groups.ts";
import {
  applyCareerSkillAdvances5e,
  applySpeciesSkills5e,
  careerGroupMembers5e,
  careerSkillAdvanceLimit5e,
  concreteCareerSkills5e,
  fitGuidedSkills5e,
  generateSpeciesSkills5e,
  GuidedSkills5e,
  guidedSkillsValid5e,
  guidedSpeciesSkills5e,
  populateSpeciesSkills5e,
  randomCareerSkillAdvances5e,
  SkillsContext5e,
} from "./skills5e.ts";

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

  test("applySpeciesSkills5e gives the languages +30 and the chosen skills +5", () => {
    expect(applySpeciesSkills5e(["s1", "stealthRural"], ["lang1"])).toEqual({ lang1: 30, s1: 5, stealthRural: 5 });
  });

  test("careerSkillAdvanceLimit5e counts the species Advances towards +15", () => {
    expect(careerSkillAdvanceLimit5e({ s1: 5 }, "s1")).toBe(2);
    expect(careerSkillAdvanceLimit5e({ s1: 5 }, "s2")).toBe(3);
  });

  test("randomCareerSkillAdvances5e spends eight Advances, none above +15", () => {
    expect(randomCareerSkillAdvances5e({ s1: 15, s2: 5 }, ids("s", 1, 10), selectFirst)).toEqual({
      s2: 2,
      s3: 3,
      s4: 3,
    });
    expect(randomCareerSkillAdvances5e({}, ["s1", "s2"], selectFirst)).toEqual({ s1: 3, s2: 3 });
  });

  test("applyCareerSkillAdvances5e adds +5 per Advance", () => {
    expect(applyCareerSkillAdvances5e({ s1: 5, lang1: 30 }, { s1: 2, s2: 1 })).toEqual({ s1: 15, s2: 5, lang1: 30 });
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

describe("guided skills5e", () => {
  const context: SkillsContext5e = {
    speciesSkills: ["sp1", "sp2", "sp3", "sp4", "sp5", "s1", "stealth"],
    speciesLanguages: ["lang1"],
    level1Skills: ["s1", "s2", "s3", "lore"],
    skillGroupMap: { stealth: ["stealthRural", "stealthUrban"], lore: ["loreLaw", "loreHistory"] },
  };
  const valid: GuidedSkills5e = {
    species: { sp1: "sp1", sp2: "sp2", sp3: "sp3", s1: "s1", stealth: "stealthRural" },
    specialisations: { lore: "loreLaw" },
    advances: { s1: 2, s2: 3, loreLaw: 3 },
  };

  test("five species skills, career groups specialised and eight Advances within +15 settle the step", () => {
    expect(guidedSkillsValid5e(valid, context)).toBe(true);
    expect(concreteCareerSkills5e(valid, context)).toEqual(["s1", "s2", "s3", "loreLaw"]);
    expect(guidedSpeciesSkills5e(valid, context)).toEqual({
      lang1: 30,
      sp1: 5,
      sp2: 5,
      sp3: 5,
      s1: 5,
      stealthRural: 5,
    });
  });

  test("is not settled with a missing pick, specialisation or Advance", () => {
    expect(guidedSkillsValid5e({ ...valid, species: { ...valid.species, stealth: "" } }, context)).toBe(false);
    expect(guidedSkillsValid5e({ ...valid, specialisations: {} }, context)).toBe(false);
    expect(guidedSkillsValid5e({ ...valid, advances: { s1: 2, s2: 3, loreLaw: 2 } }, context)).toBe(false);
    // s1 has a species Advance, so +15 leaves room for two career Advances only.
    expect(guidedSkillsValid5e({ ...valid, advances: { s1: 3, s2: 3, loreLaw: 2 } }, context)).toBe(false);
  });

  test("fitting keeps what still fits: picks of another species and Advances of another career go", () => {
    const otherSpecies = { ...context, speciesSkills: ["sp1", "s1"] };
    expect(fitGuidedSkills5e(valid, otherSpecies).species).toEqual({ sp1: "sp1", s1: "s1" });
    const otherCareer = { ...context, level1Skills: ["s1", "s5"] };
    const fitted = fitGuidedSkills5e(valid, otherCareer);
    expect(fitted.specialisations).toEqual({});
    expect(fitted.advances).toEqual({ s1: 2 });
  });

  test("a career group can't take a skill the career lists or another group took", () => {
    const withListed = {
      ...context,
      level1Skills: ["s1", "loreLaw", "lore", "lore2"],
      skillGroupMap: { ...context.skillGroupMap, lore2: ["loreLaw", "loreHistory"] },
    };
    const g = { ...valid, specialisations: { lore: "loreHistory" } };
    expect(careerGroupMembers5e(g, withListed, "lore")).toEqual(["loreHistory"]);
    expect(careerGroupMembers5e(g, withListed, "lore2")).toEqual([]);
    expect(fitGuidedSkills5e({ ...g, specialisations: { lore: "loreLaw" } }, withListed).specialisations).toEqual({});
  });

  test("fitting cuts Advances down to the +15 limit", () => {
    const g = { ...valid, species: { sp1: "sp1" }, advances: { s1: 3 } };
    expect(fitGuidedSkills5e({ ...g, species: { s1: "s1" } }, context).advances).toEqual({ s1: 2 });
  });
});
