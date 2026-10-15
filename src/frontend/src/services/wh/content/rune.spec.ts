import { apiResponseToModel, modelToApi, Rune, RuneApiData, RuneLabel } from "./rune.ts";
import { ItemType } from "./item.ts";
import { ApiResponse } from "@/services/wh/core/api.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { expect, test } from "vitest";
import { testIsEqualTo } from "@/testing.ts";

const runeApiData: RuneApiData = {
  name: "rune",
  description: "desc",
  labels: [RuneLabel.RuneLabelMaster, RuneLabel.RuneLabelProtection],
  applicableTo: [ItemType.Melee, ItemType.Armour],
  source: { 1: "page 2", 3: "page 5-10" },
};

const runeApiDataResponse: ApiResponse<RuneApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Shared,
  editions: { "4e": runeApiData },
};

const rune = new Rune({
  id: "id",
  ownerId: "owner",
  name: "rune",
  description: "desc",
  labels: [RuneLabel.RuneLabelMaster, RuneLabel.RuneLabelProtection],
  applicableTo: [ItemType.Melee, ItemType.Armour],
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected mutation", () => {
  expect(apiResponseToModel(runeApiDataResponse, "4e")).toMatchObject(rune);
});

test("modelToApi returns expected api mutation data", () => {
  expect(modelToApi(rune)).toMatchObject(runeApiData);
});

testIsEqualTo("rune", rune, { unordered: ["applicableTo", "labels"] });
