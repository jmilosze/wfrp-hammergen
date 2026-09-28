import { describe, expect, test } from "vitest";
import { Career, copyCareerLevel, zeroCareerLevel } from "../services/wh/career.ts";
import { Skill } from "../services/wh/skill.ts";
import {
  allocateLevelAdvances,
  allocateStartingCareerAdvances,
  CareerSkillsContext,
  chooseConcreteCareerSkills,
  generateCareerSkills,
  purchaseSingleAdvance,
  resolveSkillGroups,
  satisfyLevelPrerequisites,
} from "../services/wh/characterGeneration/generateCareerSkills.ts";
import { skillCost } from "../services/wh/characterGeneration/calculateExperience.ts";
import { getSelectRandomTest } from "./commonTests.ts";

describe("generateCareerSkills", () => {
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

  const dummySkillGroupMap = resolveSkillGroups(dummySkills);

  describe("purchaseSingleAdvance", () => {
    test("increments unranked skill from 0 to 1 and returns XP cost", () => {
      const skills: Record<string, number> = {};
      const cost = purchaseSingleAdvance(skills, "s1");

      expect(skills.s1).toBe(1);
      expect(cost).toBe(skillCost(0));
    });

    test("increments ranked skill and returns XP cost based on previous rank", () => {
      const skills: Record<string, number> = { s1: 5 };
      const cost = purchaseSingleAdvance(skills, "s1");

      expect(skills.s1).toBe(6);
      expect(cost).toBe(skillCost(5));
    });
  });

  describe("resolveSkillGroups", () => {
    test("indexes skills by group", () => {
      const groups = resolveSkillGroups(dummySkills);
      expect(groups).toHaveProperty("melee");
      expect(groups.melee).toEqual(["melee_basic", "melee_brawling"]);
    });

    test("indexes skills that belong to multiple groups into each group", () => {
      const groups = resolveSkillGroups(dummySkills);
      expect(groups.combat).toEqual(["melee_basic"]);
    });

    test("ignores skills without groups", () => {
      const groups = resolveSkillGroups([new Skill({ id: "nogroup", name: "No Group" })]);
      expect(groups).toEqual({});
    });

    test("returns empty object when skill list is empty", () => {
      const groups = resolveSkillGroups([]);
      expect(groups).toEqual({});
    });
  });

  describe("chooseConcreteCareerSkills", () => {
    test("replaces grouped skill placeholders with concrete choices without duplication across career levels", () => {
      const careerSkills: Record<number, string[]> = {
        1: ["s1", "melee"],
        2: ["melee"],
        3: [],
        4: [],
      };
      const skillGroups = {
        melee: ["melee_basic", "melee_brawling"],
      };

      const concreteSkills = chooseConcreteCareerSkills(careerSkills, skillGroups, getSelectRandomTest(0));

      expect(concreteSkills[1]).toEqual(["s1", "melee_basic"]);
      expect(concreteSkills[2]).toEqual(["melee_brawling"]);
    });

    test("leaves non-group skills unchanged", () => {
      const careerSkills: Record<number, string[]> = {
        1: ["s1", "s2"],
        2: ["s3"],
        3: [],
        4: [],
      };
      const concreteSkills = chooseConcreteCareerSkills(careerSkills, {}, getSelectRandomTest(0));

      expect(concreteSkills[1]).toEqual(["s1", "s2"]);
      expect(concreteSkills[2]).toEqual(["s3"]);
    });

    test("handles exhausted group options gracefully when fewer subskills exist than requested", () => {
      const careerSkills: Record<number, string[]> = {
        1: ["melee"],
        2: ["melee"],
        3: [],
        4: [],
      };
      const skillGroups = {
        melee: ["melee_basic"],
      };

      const concreteSkills = chooseConcreteCareerSkills(careerSkills, skillGroups, getSelectRandomTest(0));

      expect(concreteSkills[1]).toEqual(["melee_basic"]);
      expect(concreteSkills[2]).toEqual([]);
    });
  });

  describe("allocateStartingCareerAdvances", () => {
    test("distributes 40 advances and respects max 10 advances per skill", () => {
      const skills: Record<string, number> = {};
      const tier1Skills = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

      allocateStartingCareerAdvances(skills, tier1Skills, getSelectRandomTest(0));

      const totalAdvances = tier1Skills.reduce((sum, id) => sum + (skills[id] ?? 0), 0);
      expect(totalAdvances).toBe(40);

      for (const id of tier1Skills) {
        expect(skills[id] ?? 0).toBeLessThanOrEqual(10);
      }
    });

    test("terminates safely when available skills cannot absorb all 40 advances", () => {
      const skills: Record<string, number> = {};
      const limitedSkills = ["s1", "s2"];

      allocateStartingCareerAdvances(skills, limitedSkills, getSelectRandomTest(0));

      expect(skills.s1).toBe(10);
      expect(skills.s2).toBe(10);
      const totalAdvances = (skills.s1 ?? 0) + (skills.s2 ?? 0);
      expect(totalAdvances).toBe(20);
    });

    test("allocates up to 10 new advances on top of pre-existing skills", () => {
      const skills: Record<string, number> = { s1: 5 };
      const tier1Skills = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

      allocateStartingCareerAdvances(skills, tier1Skills, getSelectRandomTest(0));

      expect(skills.s1).toBeGreaterThanOrEqual(5);
      expect(skills.s1).toBeLessThanOrEqual(15);
    });
  });

  describe("satisfyLevelPrerequisites", () => {
    test("advances skills to target threshold and accumulates XP cost", () => {
      const skills: Record<string, number> = { s1: 2, s2: 5 };
      const eligibleSkills = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

      const xp = satisfyLevelPrerequisites(skills, eligibleSkills, 5, getSelectRandomTest(0));

      expect(xp).toBeGreaterThan(0);
      expect(skills.s1).toBe(5);
      expect(skills.s2).toBe(5);
    });

    test("does not advance skills that already meet the threshold", () => {
      const skills: Record<string, number> = {
        s1: 10,
        s2: 10,
        s3: 10,
        s4: 10,
        s5: 10,
        s6: 10,
        s7: 10,
        s8: 10,
      };
      const eligibleSkills = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

      const xp = satisfyLevelPrerequisites(skills, eligibleSkills, 5, getSelectRandomTest(0));

      expect(xp).toBe(0);
      for (const id of eligibleSkills) {
        expect(skills[id]).toBe(10);
      }
    });

    test("terminates safely when eligible skills has fewer than 8 skills", () => {
      const skills: Record<string, number> = {};
      const eligibleSkills = ["s1", "s2"];

      const xp = satisfyLevelPrerequisites(skills, eligibleSkills, 5, getSelectRandomTest(0));

      expect(xp).toBeGreaterThan(0);
      expect(skills.s1).toBe(5);
      expect(skills.s2).toBe(5);
    });
  });

  describe("allocateLevelAdvances", () => {
    test("distributes the specified advance budget and returns XP spent", () => {
      const skills: Record<string, number> = {};
      const levelSkills = ["s9", "s10"];

      const xp = allocateLevelAdvances(skills, levelSkills, 30, getSelectRandomTest(0));

      expect(xp).toBeGreaterThan(0);
      const totalLevelAdvances = (skills.s9 ?? 0) + (skills.s10 ?? 0);
      expect(totalLevelAdvances).toBe(30);
    });

    test("returns 0 XP when levelSkills is empty", () => {
      const skills: Record<string, number> = {};
      const xp = allocateLevelAdvances(skills, [], 30, getSelectRandomTest(0));

      expect(xp).toBe(0);
      expect(skills).toEqual({});
    });
  });

  describe("generateCareerSkills full functionality", () => {
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

      const [skills, expSpent] = generateCareerSkills(context, getSelectRandomTest(0));

      // Level 1 creation advances cost 0 XP
      expect(expSpent).toBe(0);

      // Pre-existing unrelated skill is preserved
      expect(skills.prior_unrelated_skill).toBe(10);

      // Total advances across level 1 career skills should have increased by 40
      const careerSkillKeys = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
      const careerAdvances = careerSkillKeys.reduce((sum, key) => sum + (skills[key] ?? 0), 0);
      expect(careerAdvances).toBe(5 + 3 + 40); // 8 initial + 40 level 1 advances
    });

    test("works without pre-existing skills at Level 1", () => {
      const context: CareerSkillsContext = {
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 1,
      };

      const [skills, expSpent] = generateCareerSkills(context, getSelectRandomTest(0));
      expect(expSpent).toBe(0);

      const careerSkillKeys = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
      const totalAdvances = careerSkillKeys.reduce((sum, key) => sum + (skills[key] ?? 0), 0);
      expect(totalAdvances).toBe(40);
    });

    test("progresses through all 4 career tiers with cumulative XP and backfilled prerequisites", () => {
      const contextLvl1: CareerSkillsContext = {
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 1,
      };
      const [skills1, xp1] = generateCareerSkills(contextLvl1, getSelectRandomTest(0));
      expect(xp1).toBe(0);
      expect(Object.values(skills1).reduce((sum, v) => sum + v, 0)).toBe(40);

      const contextLvl2: CareerSkillsContext = {
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 2,
      };
      const [skills2, xp2] = generateCareerSkills(contextLvl2, getSelectRandomTest(0));
      expect(xp2).toBeGreaterThan(xp1);
      // Level 2 skills should be present
      expect((skills2.s9 ?? 0) + (skills2.s10 ?? 0)).toBeGreaterThan(0);

      const contextLvl3: CareerSkillsContext = {
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 3,
      };
      const [skills3, xp3] = generateCareerSkills(contextLvl3, getSelectRandomTest(0));
      expect(xp3).toBeGreaterThan(xp2);
      // Level 3 skills should be present
      expect((skills3.s11 ?? 0) + (skills3.s12 ?? 0)).toBeGreaterThan(0);

      const contextLvl4: CareerSkillsContext = {
        career: dummyCareer,
        skillGroupMap: dummySkillGroupMap,
        level: 4,
      };
      const [skills4, xp4] = generateCareerSkills(contextLvl4, getSelectRandomTest(0));
      expect(xp4).toBeGreaterThan(xp3);
      // Level 4 skills should be present
      expect((skills4.s13 ?? 0) + (skills4.s14 ?? 0)).toBeGreaterThan(0);

      // Level 4 prerequisites require at least 8 career skills to have reached >= 15 advances
      const careerSkillsAll = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12"];
      const qualifiedSkills = careerSkillsAll.filter((id) => (skills4[id] ?? 0) >= 15);
      expect(qualifiedSkills.length).toBeGreaterThanOrEqual(8);
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

      const [skills] = generateCareerSkills(context, getSelectRandomTest(0));

      // Non-career species skill must never receive any advances
      expect(skills.species_only_skill).toBe(3);

      // Career skill that was also a species skill can be advanced
      expect(skills.s1).toBeGreaterThanOrEqual(15);
    });
  });
});
