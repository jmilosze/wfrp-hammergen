import { Skill, SkillApiData, apiResponseToModel, modelToApi, SkillType } from "./skill.ts";
import { expect, test } from "vitest";
import { ApiResponse } from "@/services/wh/core/api.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { testIsEqualTo } from "@/testing.ts";
import { AttributeName } from "@/services/wh/core/attributes.ts";

const skillApiData: SkillApiData = {
  name: "skill",
  description: "desc",
  attribute: AttributeName.Ag,
  type: SkillType.Basic,
  displayZero: true,
  isGroup: true,
  group: ["a", "b"],
  source: { 1: "page 2", 3: "page 5-10" },
};

const skillApiResponse: ApiResponse<SkillApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Shared,
  editions: { "4e": skillApiData },
};

const skill = new Skill({
  id: "id",
  ownerId: "owner",
  name: "skill",
  description: "desc",
  attribute: AttributeName.Ag,
  type: SkillType.Basic,
  displayZero: true,
  isGroup: true,
  group: new Set(["a", "b"]),
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected skill", () => {
  expect(apiResponseToModel(skillApiResponse, "4e")).toMatchObject(skill);
});

test("modelToApi returns expected api skill data", () => {
  expect(modelToApi(skill)).toMatchObject(skillApiData);
});

testIsEqualTo("skill", skill);
