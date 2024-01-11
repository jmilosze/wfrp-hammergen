import {
  Skill,
  SkillApiData,
  apiResponseToModel,
  modelToApi,
  SkillIndividualAttribute as Att,
  SkillIndividualType as SkillType,
} from "../services/wh/skill.ts";
import { describe, expect, test } from "vitest";
import { ApiResponse } from "../services/wh/common.ts";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const skillApiData = {
  name: "skill",
  description: "desc",
  attribute: 1,
  type: 0,
  displayZero: true,
  isGroup: true,
  group: ["a", "b"],
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const skillApiResponse: ApiResponse<SkillApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: skillApiData,
};

const skill = new Skill({
  id: "id",
  canEdit: true,
  name: "skill",
  description: "desc",
  attribute: 1,
  type: 0,
  displayZero: true,
  isGroup: true,
  group: ["a", "b"],
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected skill", () => {
  expect(apiResponseToModel(skillApiResponse)).toMatchObject(skill);
});

test("modelToApi returns expected api skill data", () => {
  expect(modelToApi(skill)).toMatchObject(skillApiData);
});

testIsEqualCommonProperties("skill", skill);

describe("isEqualTo returns true", () => {
  test("when other skill has group field with elements in different order", () => {
    const otherSkill = skill.copy();
    otherSkill.group = ["b", "a"];
    expect(skill.isEqualTo(otherSkill)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other skill has different value of isGroup");
  {
    const otherSkill = skill.copy();
    otherSkill.isGroup = false;
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  }

  test("when other skill has different value of attribute");
  {
    const otherSkill = skill.copy();
    otherSkill.attribute = Att.Int.valueOf();
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  }

  test("when other skill has different value of type");
  {
    const otherSkill = skill.copy();
    otherSkill.type = SkillType.Advanced.valueOf();
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  }

  test("when other skill has group field that is a subset", () => {
    const otherSkill = skill.copy();
    otherSkill.group = ["a"];
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  });

  test("when other skill has group field of the same length but different values", () => {
    const otherSkill = skill.copy();
    otherSkill.group = ["c", "d"];
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  });
});
