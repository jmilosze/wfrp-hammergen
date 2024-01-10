import {
  Skill,
  SkillApiData,
  apiResponseToModel,
  modelToApi,
  SkillIndividualAttribute as Att,
  SkillIndividualType as SkillType,
} from "../services/wh/skill.ts";
import { describe, expect, test } from "vitest";
import { Source } from "../services/wh/source.ts";
import { ApiResponse } from "../services/wh/common.ts";

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

describe("isEqualTo returns true", () => {
  test("when other skill is exactly the same", () => {
    const otherSkill = skill.copy();
    expect(skill.isEqualTo(otherSkill)).toBe(true);
  });

  test("when other skill has group field with elements in different order", () => {
    const otherSkill = skill.copy();
    otherSkill.group = ["b", "a"];
    expect(skill.isEqualTo(otherSkill)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other skill has different value of id");
  {
    const otherSkill = skill.copy();
    otherSkill.id = "otherId";
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  }
  test("when other skill has different value of name");
  {
    const otherSkill = skill.copy();
    otherSkill.name = "otherName";
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  }

  test("when other skill has different value of description");
  {
    const otherSkill = skill.copy();
    otherSkill.description = "otherDescription";
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  }

  test("when other skill has different value of canEdit");
  {
    const otherSkill = skill.copy();
    otherSkill.canEdit = false;
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  }

  test("when other skill has different value of isGroup");
  {
    const otherSkill = skill.copy();
    otherSkill.isGroup = false;
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  }

  test("when other skill has different value of shared");
  {
    const otherSkill = skill.copy();
    otherSkill.shared = false;
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

  test.each<{ diff: string; source: Source }>([
    { diff: "fewer sources", source: { 1: "page 2" } },
    { diff: "more sources", source: { 1: "page 2", 3: "page 5-10", 0: "zxc" } },
    { diff: "different source values", source: { 1: "zxc", 3: "asd" } },
    { diff: "different source keys", source: { 2: "page 2", 3: "page 5-10" } },
  ])("when other skill has $diff", (t) => {
    const otherSkill = skill.copy();
    otherSkill.source = t.source;
    expect(skill.isEqualTo(otherSkill)).toBe(false);
  });
});
