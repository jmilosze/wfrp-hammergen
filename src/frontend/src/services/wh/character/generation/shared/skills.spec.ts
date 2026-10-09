import { describe, expect, test } from "vitest";
import { chooseConcreteCareerSkills } from "./skills.ts";
import { PerGenerationLevel } from "../../../content/career.ts";
import { getSelectRandomTest } from "../../../../../testing.ts";

describe("chooseConcreteCareerSkills", () => {
  test("replaces grouped skill placeholders with concrete choices without duplication across career levels", () => {
    const careerSkills: PerGenerationLevel<string[]> = [["s1", "melee"], ["melee"], [], []];
    const skillGroups = {
      melee: ["melee_basic", "melee_brawling"],
    };

    const concreteSkills = chooseConcreteCareerSkills(careerSkills, skillGroups, getSelectRandomTest(0));

    expect(concreteSkills[0]).toEqual(["s1", "melee_basic"]);
    expect(concreteSkills[1]).toEqual(["melee_brawling"]);
  });

  test("leaves non-group skills unchanged", () => {
    const careerSkills: PerGenerationLevel<string[]> = [["s1", "s2"], ["s3"], [], []];
    const concreteSkills = chooseConcreteCareerSkills(careerSkills, {}, getSelectRandomTest(0));

    expect(concreteSkills[0]).toEqual(["s1", "s2"]);
    expect(concreteSkills[1]).toEqual(["s3"]);
  });

  test("handles exhausted group options gracefully when fewer subskills exist than requested", () => {
    const careerSkills: PerGenerationLevel<string[]> = [["melee"], ["melee"], [], []];
    const skillGroups = {
      melee: ["melee_basic"],
    };

    const concreteSkills = chooseConcreteCareerSkills(careerSkills, skillGroups, getSelectRandomTest(0));

    expect(concreteSkills[0]).toEqual(["melee_basic"]);
    expect(concreteSkills[1]).toEqual([]);
  });

  test("never picks a skill listed explicitly in an earlier level", () => {
    const careerSkills: PerGenerationLevel<string[]> = [["melee_basic"], ["melee"], [], []];
    const skillGroups = {
      melee: ["melee_basic", "melee_brawling"],
    };

    const concreteSkills = chooseConcreteCareerSkills(careerSkills, skillGroups, getSelectRandomTest(0));

    expect(concreteSkills[0]).toEqual(["melee_basic"]);
    expect(concreteSkills[1]).toEqual(["melee_brawling"]);
  });

  test("never picks a skill listed explicitly earlier in the same level", () => {
    const careerSkills: PerGenerationLevel<string[]> = [["melee_basic", "melee"], [], [], []];
    const skillGroups = {
      melee: ["melee_basic", "melee_brawling"],
    };

    const concreteSkills = chooseConcreteCareerSkills(careerSkills, skillGroups, getSelectRandomTest(0));

    expect(concreteSkills[0]).toEqual(["melee_basic", "melee_brawling"]);
  });

  test("drops a group placeholder when all its remaining members are already career skills", () => {
    const careerSkills: PerGenerationLevel<string[]> = [["melee_basic", "melee_brawling"], ["melee"], [], []];
    const skillGroups = {
      melee: ["melee_basic", "melee_brawling"],
    };

    const concreteSkills = chooseConcreteCareerSkills(careerSkills, skillGroups, getSelectRandomTest(0));

    expect(concreteSkills[1]).toEqual([]);
  });

  test("deduplicates skills within a single level", () => {
    const careerSkills: PerGenerationLevel<string[]> = [["melee", "melee_basic"], [], [], []];
    const skillGroups = {
      melee: ["melee_basic", "melee_brawling"],
    };

    const concreteSkills = chooseConcreteCareerSkills(careerSkills, skillGroups, getSelectRandomTest(0));

    expect(concreteSkills[0]).toEqual(["melee_basic"]);
  });
});
