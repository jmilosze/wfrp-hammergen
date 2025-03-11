import {
  ItemProperty,
  ItemPropertyApiData,
  ItemPropertyType,
  apiResponseToModel,
  modelToApi,
} from "../services/wh/itemproperty.ts";
import { ItemType } from "../services/wh/item.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const itemPropertyApiData: ItemPropertyApiData = {
  name: "itemProperty",
  description: "desc",
  type: ItemPropertyType.Quality,
  applicableTo: [ItemType.Melee, ItemType.Armour],
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const itemPropertyApiDataResponse: ApiResponse<ItemPropertyApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: itemPropertyApiData,
};

const itemProperty = new ItemProperty({
  id: "id",
  ownerId: "owner",
  canEdit: true,
  name: "itemProperty",
  description: "desc",
  type: ItemPropertyType.Quality,
  applicableTo: [ItemType.Melee, ItemType.Armour],
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected mutation", () => {
  expect(apiResponseToModel(itemPropertyApiDataResponse)).toMatchObject(itemProperty);
});

test("modelToApi returns expected api mutation data", () => {
  expect(modelToApi(itemProperty)).toMatchObject(itemPropertyApiData);
});

testIsEqualCommonProperties("item property", itemProperty);

describe("isEqualTo returns true", () => {
  test("when other item property has applicableTo field with elements in different order", () => {
    const otherItemProperty = itemProperty.copy();
    otherItemProperty.applicableTo = [ItemType.Armour, ItemType.Melee];
    expect(itemProperty.isEqualTo(otherItemProperty)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other item property has different value of type", () => {
    const otherItemProperty = itemProperty.copy();
    otherItemProperty.type = ItemPropertyType.Flaw;
    expect(itemProperty.isEqualTo(otherItemProperty)).toBe(false);
  });

  test("when other item property has applicableTo field that is a subset", () => {
    const otherItemProperty = itemProperty.copy();
    otherItemProperty.applicableTo = [ItemType.Armour];
    expect(itemProperty.isEqualTo(otherItemProperty)).toBe(false);
  });

  test("when other item property has applicableTo field of the same length but different values", () => {
    const otherItemProperty = itemProperty.copy();
    otherItemProperty.applicableTo = [ItemType.Armour, ItemType.Other];
    expect(itemProperty.isEqualTo(otherItemProperty)).toBe(false);
  });
});
