import { Skill, SkillApiData, apiResponseToModel, modelToApi, SkillType } from "../services/wh/skill.ts";
import { describe, expect, test } from "vitest";
import { ApiResponse } from "../services/wh/common.ts";
import { testIsEqualCommonProperties } from "./commonTests.ts";
import { AttributeName } from "../services/wh/attributes.ts";

const skillApiData: SkillApiData = {
  name: "skill",
  description: "desc",
  attribute: AttributeName.Ag,
  type: SkillType.Basic,
  displayZero: true,
  isGroup: true,
  group: ["a", "b"],
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
} as SkillApiData;

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
  attribute: AttributeName.Ag,
  type: SkillType.Basic,
  displayZero: true,
  isGroup: true,
  group: new Set(["a", "b"]),
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

describe("isEqualTo returns false", () => {
  test("when other skill has different value of isGroup", () => {
    const otherSkill = skill.copy();
    otherSkill.isGroup = false;
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  });

  test("when other skill has different value of attribute", () => {
    const otherSkill = skill.copy();
    otherSkill.attribute = AttributeName.Int;
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  });

  test("when other skill has different value of type", () => {
    const otherSkill = skill.copy();
    otherSkill.type = SkillType.Advanced;
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  });

  test("when other skill has group field that is a subset", () => {
    const otherSkill = skill.copy();
    otherSkill.group = new Set(["a"]);
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  });

  test("when other skill has group field of the same length but different values", () => {
    const otherSkill = skill.copy();
    otherSkill.group = new Set(["c", "d"]);
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  });
});
