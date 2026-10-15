import { ItemProperty, ItemPropertyApiData, ItemPropertyType, apiResponseToModel, modelToApi } from "./itemproperty.ts";
import { ItemType } from "./item.ts";
import { ApiResponse } from "@/services/wh/core/api.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { expect, test } from "vitest";
import { testIsEqualTo } from "@/testing.ts";

const itemPropertyApiData: ItemPropertyApiData = {
  name: "itemProperty",
  description: "desc",
  type: ItemPropertyType.Quality,
  applicableTo: [ItemType.Melee, ItemType.Armour],
  hasValue: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const itemPropertyApiDataResponse: ApiResponse<ItemPropertyApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Shared,
  editions: { "4e": itemPropertyApiData },
};

const itemProperty = new ItemProperty({
  id: "id",
  ownerId: "owner",
  name: "itemProperty",
  description: "desc",
  type: ItemPropertyType.Quality,
  applicableTo: [ItemType.Melee, ItemType.Armour],
  hasValue: true,
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected mutation", () => {
  expect(apiResponseToModel(itemPropertyApiDataResponse, "4e")).toMatchObject(itemProperty);
});

test("modelToApi returns expected api mutation data", () => {
  expect(modelToApi(itemProperty)).toMatchObject(itemPropertyApiData);
});

testIsEqualTo("item property", itemProperty, { unordered: ["applicableTo"] });
