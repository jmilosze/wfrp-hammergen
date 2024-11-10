import { apiResponseToModel, modelToApi, Rune, RuneApiData, RuneLabel } from "../services/wh/rune.ts";
import { ItemType } from "../services/wh/item.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const runeApiData: RuneApiData = {
  name: "rune",
  description: "desc",
  labels: [RuneLabel.RuneLabelMaster, RuneLabel.RuneLabelProtection],
  applicableTo: [ItemType.Melee, ItemType.Armour],
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
};

const runeApiDataResponse: ApiResponse<RuneApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: runeApiData,
};

const rune = new Rune({
  id: "id",
  canEdit: true,
  name: "rune",
  description: "desc",
  labels: [RuneLabel.RuneLabelMaster, RuneLabel.RuneLabelProtection],
  applicableTo: [ItemType.Melee, ItemType.Armour],
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
});

test("apiResponseToModel returns expected mutation", () => {
  expect(apiResponseToModel(runeApiDataResponse)).toMatchObject(rune);
});

test("modelToApi returns expected api mutation data", () => {
  expect(modelToApi(rune)).toMatchObject(runeApiData);
});

testIsEqualCommonProperties("item property", rune);

describe("isEqualTo returns true", () => {
  test("when other rune has applicableTo field with elements in different order", () => {
    const otherRune = rune.copy();
    otherRune.applicableTo = [ItemType.Armour, ItemType.Melee];
    expect(rune.isEqualTo(otherRune)).toBe(true);
  });

  test("when other rune has labels field with elements in different order", () => {
    const otherRune = rune.copy();
    otherRune.labels = [RuneLabel.RuneLabelProtection, RuneLabel.RuneLabelMaster];
    expect(rune.isEqualTo(otherRune)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other rune has labels field that is a subset", () => {
    const otherRune = rune.copy();
    otherRune.labels = [RuneLabel.RuneLabelProtection];
    expect(rune.isEqualTo(otherRune)).toBe(false);
  });

  test("when other rune has labels field of the same length but different values", () => {
    const otherRune = rune.copy();
    otherRune.labels = [RuneLabel.RuneLabelMaster, RuneLabel.RuneLabelWeapon];
    expect(rune.isEqualTo(otherRune)).toBe(false);
  });

  test("when other rune has applicableTo field that is a subset", () => {
    const otherRune = rune.copy();
    otherRune.applicableTo = [ItemType.Armour];
    expect(rune.isEqualTo(otherRune)).toBe(false);
  });

  test("when other rune has applicableTo field of the same length but different values", () => {
    const otherRune = rune.copy();
    otherRune.applicableTo = [ItemType.Armour, ItemType.Other];
    expect(rune.isEqualTo(otherRune)).toBe(false);
  });
});
