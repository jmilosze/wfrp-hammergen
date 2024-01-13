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

const itemPropertyApiData = {
  name: "itemProperty",
  description: "desc",
  type: ItemPropertyType.Quality.valueOf(),
  applicableTo: [ItemType.Melee.valueOf(), ItemType.Armour.valueOf()],
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
  canEdit: true,
  name: "itemProperty",
  description: "desc",
  type: ItemPropertyType.Quality.valueOf(),
  applicableTo: [ItemType.Melee.valueOf(), ItemType.Armour.valueOf()],
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
    otherItemProperty.applicableTo = [ItemType.Armour.valueOf(), ItemType.Melee.valueOf()];
    expect(itemProperty.isEqualTo(otherItemProperty)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other skill has different value of type", () => {
    const otherItemProperty = itemProperty.copy();
    otherItemProperty.type = ItemPropertyType["Dwarf Rune"].valueOf();
    expect(itemProperty.isEqualTo(otherItemProperty)).toBe(false);
  });

  test("when other item property has applicableTo field that is a subset", () => {
    const otherItemProperty = itemProperty.copy();
    otherItemProperty.applicableTo = [ItemType.Armour.valueOf()];
    expect(itemProperty.isEqualTo(otherItemProperty)).toBe(false);
  });

  test("when other item property has applicableTo field of the same length but different values", () => {
    const otherItemProperty = itemProperty.copy();
    otherItemProperty.applicableTo = [ItemType.Armour.valueOf(), ItemType.Other.valueOf()];
    expect(itemProperty.isEqualTo(otherItemProperty)).toBe(false);
  });
});
