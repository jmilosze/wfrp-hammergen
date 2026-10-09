import { copyCareerLevel, Career, zeroCareerLevel } from "../../../content/career.ts";
import { genProps4e, testSkills4e } from "./fixtures4e.ts";
import { describe, expect, test } from "vitest";
import { Skill } from "../../../content/skill.ts";
import {
  generateSpeciesSkills4e,
  CareerSkillsContext,
  generateCareerSkills4e,
  purchaseSingleAdvance,
  populateSpeciesSkills4e,
} from "./skills4e.ts";
import { resolveEntityGroups } from "../shared/groups.ts";
import { selectRandom } from "../../../../../utils/random.ts";
import { getSelectRandomTest } from "../../../../../testing.ts";
import { skillCost4e } from "./experience4e.ts";
import { SpeciesWithRegion } from "../../../core/species.ts";
import { Character } from "../../character.ts";

describe("generateSpeciesSkills4e", () => {
  const dummySkills: Skill[] = [
    new Skill({ id: "s1", name: "Skill 1" }),
    new Skill({ id: "s2", name: "Skill 2" }),
    new Skill({ id: "s3", name: "Skill 3" }),
    new Skill({ id: "s4", name: "Skill 4" }),
    new Skill({ id: "s5", name: "Skill 5" }),
    new Skill({ id: "s6", name: "Skill 6" }),
    new Skill({ id: "s7", name: "Skill 7" }),
    new Skill({ id: "s8", name: "Skill 8" }),
    new Skill({ id: "melee_basic", name: "Melee (Basic)", group: new Set(["melee"]) }),
    new Skill({ id: "melee_brawling", name: "Melee (Brawling)", group: new Set(["melee"]) }),
    new Skill({ id: "art_painting", name: "Art (Painting)", group: new Set(["art"]) }),
    new Skill({ id: "art_sculpture", name: "Art (Sculpture)", group: new Set(["art"]) }),
  ];

  const resolvedGroups = resolveEntityGroups(dummySkills);

  test("generates 3 skills at +3 and 3 skills at +5 advances", () => {
    const speciesCandidates = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
    const result = generateSpeciesSkills4e(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    const values = Object.values(result);
    expect(values.length).toBe(6);
    expect(values.filter((v) => v === 3).length).toBe(3);
    expect(values.filter((v) => v === 5).length).toBe(3);
  });

  test("ensures 6 distinct skills are chosen without overlap between +3 and +5", () => {
    const speciesCandidates = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
    const result = generateSpeciesSkills4e(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    const keys = Object.keys(result);
    expect(new Set(keys).size).toBe(6);
  });

  test("deduplicates candidate skills if input contains duplicates", () => {
    const speciesCandidates = ["s1", "s1", "s2", "s2", "s3", "s4", "s5", "s6", "s7"];
    const result = generateSpeciesSkills4e(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    expect(Object.keys(result).length).toBe(6);
  });

  test("resolves group skill to concrete subskill instead of group placeholder", () => {
    const speciesCandidates = ["melee", "s1", "s2", "s3", "s4", "s5", "s6"];
    const result = generateSpeciesSkills4e(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    expect(result).not.toHaveProperty("melee");
    const hasMeleeSubskill = "melee_basic" in result || "melee_brawling" in result;
    expect(hasMeleeSubskill).toBe(true);
  });

  test("resolves multiple distinct group skills", () => {
    const speciesCandidates = ["melee", "art", "s1", "s2", "s3", "s4", "s5", "s6"];
    const result = generateSpeciesSkills4e(speciesCandidates, resolvedGroups, getSelectRandomTest(0));

    expect(result).not.toHaveProperty("melee");
    expect(result).not.toHaveProperty("art");
    const hasMeleeSubskill = "melee_basic" in result || "melee_brawling" in result;
    const hasArtSubskill = "art_painting" in result || "art_sculpture" in result;
    expect(hasMeleeSubskill).toBe(true);
    expect(hasArtSubskill).toBe(true);
  });

  test("throws when the species lists fewer than 6 different skills", () => {
    expect(() => generateSpeciesSkills4e(["s1", "s2", "s3", "s4", "s5"], {}, getSelectRandomTest(0))).toThrow(
      "species skills must provide 6 different skills",
    );
  });

  test("throws when duplicates leave fewer than 6 different skills", () => {
    expect(() => generateSpeciesSkills4e(["s1", "s2", "s3", "s4", "s5", "s1"], {}, getSelectRandomTest(0))).toThrow(
      "species skills must provide 6 different skills",
    );
  });

  test("a group never resolves to a skill the species lists by name", () => {
    const groups = { language: ["lang_reikspiel", "lang_bretonnian"] };
    const speciesCandidates = ["lang_reikspiel", "language", "s1", "s2", "s3", "s4"];

    // Selecting index 0 makes the group draw Reikspiel first, which must be rejected.
    const result = generateSpeciesSkills4e(speciesCandidates, groups, getSelectRandomTest(0));

    expect(result).toEqual({ lang_reikspiel: 3, lang_bretonnian: 3, s1: 3, s2: 5, s3: 5, s4: 5 });
  });

  test("always generates 6 different skills when a named skill and a group overlap", () => {
    const groups = { language: ["lang_reikspiel", "lang_bretonnian"] };
    const speciesCandidates = ["lang_reikspiel", "language", "s1", "s2", "s3", "s4"];

    for (let i = 0; i < 200; ++i) {
      const result = generateSpeciesSkills4e(speciesCandidates, groups, selectRandom);
      expect(Object.keys(result).sort()).toEqual(["lang_bretonnian", "lang_reikspiel", "s1", "s2", "s3", "s4"]);
    }
  });

  test("two groups sharing a skill never both resolve to it", () => {
    const groups = { melee: ["melee_basic"], combat: ["melee_basic", "melee_brawling"] };
    const speciesCandidates = ["melee", "combat", "s1", "s2", "s3", "s4"];

    const result = generateSpeciesSkills4e(speciesCandidates, groups, getSelectRandomTest(0));

    expect(Object.keys(result).sort()).toEqual(["melee_basic", "melee_brawling", "s1", "s2", "s3", "s4"]);
  });

  test("skips a group with no new skill left and picks another species skill instead", () => {
    const groups = { language: ["lang_reikspiel"] };
    const speciesCandidates = ["lang_reikspiel", "language", "s1", "s2", "s3", "s4", "s5"];

    const result = generateSpeciesSkills4e(speciesCandidates, groups, getSelectRandomTest(0));

    expect(Object.keys(result).sort()).toEqual(["lang_reikspiel", "s1", "s2", "s3", "s4", "s5"]);
  });

  test("throws when groups can't provide enough different skills", () => {
    const groups = { language: ["lang_reikspiel"] };
    const speciesCandidates = ["lang_reikspiel", "language", "s1", "s2", "s3", "s4"];

    expect(() => generateSpeciesSkills4e(speciesCandidates, groups, getSelectRandomTest(0))).toThrow(
      "species skills must provide 6 different skills",
    );
  });

  test("returns empty record when speciesSkills is undefined", () => {
    const result = generateSpeciesSkills4e(undefined, resolvedGroups, getSelectRandomTest(0));
    expect(result).toEqual({});
  });
});

describe("generateCareerSkills4e", () => {
  const dummySkills: Skill[] = [
    new Skill({ id: "s1", name: "Skill 1" }),
    new Skill({ id: "s2", name: "Skill 2" }),
    new Skill({ id: "s3", name: "Skill 3" }),
    new Skill({ id: "s4", name: "Skill 4" }),
    new Skill({ id: "s5", name: "Skill 5" }),
    new Skill({ id: "s6", name: "Skill 6" }),
    new Skill({ id: "s7", name: "Skill 7" }),
    new Skill({ id: "s8", name: "Skill 8" }),
    new Skill({ id: "s9", name: "Skill 9" }),
    new Skill({ id: "s10", name: "Skill 10" }),
    new Skill({ id: "s11", name: "Skill 11" }),
    new Skill({ id: "s12", name: "Skill 12" }),
    new Skill({ id: "s13", name: "Skill 13" }),
    new Skill({ id: "s14", name: "Skill 14" }),
    new Skill({ id: "melee_basic", name: "Melee (Basic)", group: new Set(["melee", "combat"]) }),
    new Skill({ id: "melee_brawling", name: "Melee (Brawling)", group: new Set(["melee"]) }),
  ];

  const dummyCareer = new Career({
    id: "c1",
    level1: {
      ...copyCareerLevel(zeroCareerLevel),
      skills: new Set(["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"]),
    },
    level2: {
      ...copyCareerLevel(zeroCareerLevel),
      skills: new Set(["s9", "s10"]),
    },
    level3: {
      ...copyCareerLevel(zeroCareerLevel),
      skills: new Set(["s11", "s12"]),
    },
    level4: {
      ...copyCareerLevel(zeroCareerLevel),
      skills: new Set(["s13", "s14"]),
    },
  });

  const dummySkillGroupMap = resolveEntityGroups(dummySkills);

  describe("purchaseSingleAdvance", () => {
    test("increments unranked skill from 0 to 1 and returns XP cost", () => {
      const skills: Record<string, number> = {};
      const cost = purchaseSingleAdvance(skills, "s1");

      expect(skills.s1).toBe(1);
      expect(cost).toBe(skillCost4e(0));
    });

    test("increments ranked skill and returns XP cost based on previous rank", () => {
      const skills: Record<string, number> = { s1: 5 };
      const cost = purchaseSingleAdvance(skills, "s1");

      expect(skills.s1).toBe(6);
      expect(cost).toBe(skillCost4e(5));
    });
  });

  describe("generateCareerSkills4e full functionality", () => {
    test("builds career skills on top of pre-existing skills at Level 1", () => {
      const startingSkills: Record<string, number> = {
        s1: 5,
        s2: 3,
        prior_unrelated_skill: 10,
      };

      const context: CareerSkillsContext = {
        startingSkills,
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 1,
      };

      const [skills, expSpent] = generateCareerSkills4e(context, getSelectRandomTest(0));

      // Level 1 creation advances cost 0 XP
      expect(expSpent).toBe(0);

      // Pre-existing unrelated skill is preserved
      expect(skills.prior_unrelated_skill).toBe(10);

      // Total advances across level 1 career skills should have increased by 40
      const careerSkillKeys = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
      const careerAdvances = careerSkillKeys.reduce((sumValues, key) => sumValues + (skills[key] ?? 0), 0);
      expect(careerAdvances).toBe(5 + 3 + 40); // 8 initial + 40 level 1 advances
    });

    test("works without pre-existing skills at Level 1", () => {
      const context: CareerSkillsContext = {
        startingSkills: {},
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 1,
      };

      const [skills, expSpent] = generateCareerSkills4e(context, getSelectRandomTest(0));
      expect(expSpent).toBe(0);

      const careerSkillKeys = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
      const totalAdvances = careerSkillKeys.reduce((sumValues, key) => sumValues + (skills[key] ?? 0), 0);
      expect(totalAdvances).toBe(40);
    });

    test("progresses through all 4 career tiers with cumulative XP and backfilled prerequisites", () => {
      const contextLvl1: CareerSkillsContext = {
        startingSkills: {},
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 1,
      };
      const [skills1, xp1] = generateCareerSkills4e(contextLvl1, getSelectRandomTest(0));
      expect(xp1).toBe(0);
      expect(Object.values(skills1).reduce((sumValues, v) => sumValues + v, 0)).toBe(40);

      const contextLvl2: CareerSkillsContext = {
        startingSkills: {},
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 2,
      };
      const [skills2, xp2] = generateCareerSkills4e(contextLvl2, getSelectRandomTest(0));
      expect(xp2).toBeGreaterThan(xp1);
      // Level 2 skills should be present
      expect((skills2.s9 ?? 0) + (skills2.s10 ?? 0)).toBeGreaterThan(0);

      const contextLvl3: CareerSkillsContext = {
        startingSkills: {},
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 3,
      };
      const [skills3, xp3] = generateCareerSkills4e(contextLvl3, getSelectRandomTest(0));
      expect(xp3).toBeGreaterThan(xp2);
      // Level 3 skills should be present
      expect((skills3.s11 ?? 0) + (skills3.s12 ?? 0)).toBeGreaterThan(0);

      const contextLvl4: CareerSkillsContext = {
        startingSkills: {},
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 4,
      };
      const [skills4, xp4] = generateCareerSkills4e(contextLvl4, getSelectRandomTest(0));
      expect(xp4).toBeGreaterThan(xp3);
      // Level 4 skills should be present
      expect((skills4.s13 ?? 0) + (skills4.s14 ?? 0)).toBeGreaterThan(0);

      // Level 4 prerequisites require at least 8 career skills to have reached >= 15 advances
      const careerSkillsAll = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12"];
      const qualifiedSkills = careerSkillsAll.filter((id) => (skills4[id] ?? 0) >= 15);
      expect(qualifiedSkills.length).toBeGreaterThanOrEqual(8);
    });

    test("a group career skill may pick a skill the character already has only from species skills", () => {
      const career = new Career({
        id: "c_species",
        level1: { ...copyCareerLevel(zeroCareerLevel), skills: new Set(["melee_brawling"]) },
        level2: { ...copyCareerLevel(zeroCareerLevel), skills: new Set(["melee"]) },
      });
      const context: CareerSkillsContext = {
        // Melee (Basic) comes from species skills only, so the Melee (Any) placeholder may still pick it.
        startingSkills: { melee_basic: 5 },
        career,
        skillGroupMap: { melee: ["melee_basic", "melee_brawling"] },
        level: 2,
      };

      const [skills] = generateCareerSkills4e(context, getSelectRandomTest(0));

      // Level 2 budget of 30 advances goes to the group pick, Melee (Basic), on top of its 5 species advances.
      expect(skills.melee_basic).toBe(5 + 30);
    });

    test("a group career skill never picks a skill the career already has, even if it is also a species skill", () => {
      const career = new Career({
        id: "c_species_career",
        level1: { ...copyCareerLevel(zeroCareerLevel), skills: new Set(["melee_basic"]) },
        level2: { ...copyCareerLevel(zeroCareerLevel), skills: new Set(["melee"]) },
      });
      const context: CareerSkillsContext = {
        startingSkills: { melee_basic: 5 },
        career,
        skillGroupMap: { melee: ["melee_basic", "melee_brawling"] },
        level: 2,
      };

      const [skills] = generateCareerSkills4e(context, getSelectRandomTest(0));

      // Melee (Basic) is a level 1 career skill, so Melee (Any) at level 2 resolves to Melee (Brawling).
      expect(skills.melee_brawling).toBe(30);
    });

    test("does not advance species skills unless they are in the career, even up to Level 4", () => {
      const startingSkills: Record<string, number> = {
        s1: 5, // in career level 1
        species_only_skill: 3, // not in career
      };

      const context: CareerSkillsContext = {
        startingSkills,
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 4,
      };

      const [skills] = generateCareerSkills4e(context, getSelectRandomTest(0));

      // Non-career species skill must never receive any advances
      expect(skills.species_only_skill).toBe(3);

      // Career skill that was also a species skill can be advanced
      expect(skills.s1).toBeGreaterThanOrEqual(15);
    });
  });
});

describe("populateSpeciesSkills4e", () => {
  test("populateSpeciesSkills4e keeps higher values", () => {
    const character = new Character({ species: SpeciesWithRegion.HumanReikland });
    character.skills = { sp1: 10, other: 10 };
    populateSpeciesSkills4e(character, testSkills4e, genProps4e);
    expect(character.skills.sp1).toBe(10);
    expect(character.skills.other).toBe(10);
    expect(Object.keys(character.skills).filter((x) => x.startsWith("sp")).length).toBeGreaterThanOrEqual(6);
  });

  test("populateSpeciesSkills4e does not change skills when the species has no generation data", () => {
    const character = new Character({ species: SpeciesWithRegion.None });
    populateSpeciesSkills4e(character, testSkills4e, genProps4e);
    expect(character.skills).toEqual({});
  });
});
