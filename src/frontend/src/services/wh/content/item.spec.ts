import {
  AmmoGroup,
  AmmoType,
  apiResponseToModel,
  ArmourGroup,
  ArmourLocation,
  ArmourType,
  Availability,
  CarryType,
  ContainerType,
  Item,
  ItemApiData,
  ItemType,
  MeleeGroup,
  MeleeReach,
  MeleeType,
  modelToApi,
  OtherType,
  printArmourGroup,
  RangedGroup,
  RangedType,
  WeaponHands,
  meleeGroupsByEdition,
  armourGroupsByEdition,
} from "./item.ts";
import { ApiResponse } from "@/services/wh/core/api.ts";
import { Visibility } from "@/services/wh/core/entity.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualTo } from "@/testing.ts";

const itemApiData: ItemApiData = {
  name: "item",
  description: "desc",
  source: { 1: "page 2", 3: "page 5-10" },
  price: 12,
  enc: 2,
  availability: Availability.Exotic,
  properties: [
    { id: "prop1", value: "3" },
    { id: "prop2", value: "" },
  ],
  runes: [
    { id: "rune1", number: 1 },
    { id: "rune2", number: 2 },
  ],
  type: ItemType.Ranged,
  melee: {
    hands: WeaponHands.OneHanded,
    dmg: 1,
    dmgSbMult: 4,
    reach: MeleeReach.Average,
    group: MeleeGroup.Basic,
  } as MeleeType,
  ranged: {
    hands: WeaponHands.OneHanded,
    dmg: 2,
    dmgSbMult: 5,
    rng: 8,
    rngSbMult: 9,
    group: RangedGroup.Blackpowder,
  } as RangedType,
  ammunition: { dmg: 0, rng: 3, rngMult: 6, group: AmmoGroup.Bow } as AmmoType,
  armour: {
    points: 1,
    location: [ArmourLocation.Arms, ArmourLocation.Head],
    group: ArmourGroup.Plate,
  } as ArmourType,
  grimoire: { spells: ["spell1", "spell2"] },
  container: { capacity: 1, carryType: CarryType.CarriableAndNotWearable } as ContainerType,
  other: { carryType: CarryType.CarriableAndWearable } as OtherType,
};

const itemApiResponse: ApiResponse<ItemApiData> = {
  id: "id",
  ownerId: "owner",
  visibility: Visibility.Shared,
  editions: { "4e": itemApiData },
};

const item = new Item({
  id: "id",
  ownerId: "owner",
  name: "item",
  description: "desc",
  visibility: Visibility.Shared,
  source: { 1: "page 2", 3: "page 5-10" },
  price: 12,
  enc: 2,
  availability: Availability.Exotic,
  properties: { prop1: "3", prop2: "" },
  runes: { rune1: 1, rune2: 2 },
  type: ItemType.Ranged,
  melee: {
    hands: WeaponHands.OneHanded,
    dmg: 1,
    dmgSbMult: 4,
    reach: MeleeReach.Average,
    group: MeleeGroup.Basic,
  } as MeleeType,
  ranged: {
    hands: WeaponHands.OneHanded,
    dmg: 2,
    dmgSbMult: 5,
    rng: 8,
    rngSbMult: 9,
    group: RangedGroup.Blackpowder,
  } as RangedType,
  ammunition: { dmg: 0, rng: 3, rngMult: 6, group: AmmoGroup.Bow } as AmmoType,
  armour: {
    points: 1,
    location: [ArmourLocation.Arms, ArmourLocation.Head],
    group: ArmourGroup.Plate,
  } as ArmourType,
  grimoire: { spells: new Set(["spell1", "spell2"]) },
  container: { capacity: 1, carryType: CarryType.CarriableAndNotWearable } as ContainerType,
  other: { carryType: CarryType.CarriableAndWearable } as OtherType,
});

test("apiResponseToModel returns expected item", () => {
  expect(apiResponseToModel(itemApiResponse, "4e")).toMatchObject(item);
});

test("apiResponseToModel resets groups the edition doesn't have", () => {
  const data = {
    ...itemApiData,
    melee: { ...itemApiData.melee, group: MeleeGroup.Parry },
    armour: { ...itemApiData.armour, group: ArmourGroup.SoftLeather },
  };
  const model = apiResponseToModel({ ...itemApiResponse, editions: { "5e": data } }, "5e");
  expect(model.melee.group).toBe(MeleeGroup.Basic);
  expect(model.armour.group).toBe(ArmourGroup.Leather);
});

test("modelToApi returns expected api item data", () => {
  expect(modelToApi(item)).toMatchObject(itemApiData);
});

// An item compares the stats of its own type only (e.g. a melee weapon's), so each type is tested with the others'
// stats ignored.
const ITEM_TYPE_STATS: [ItemType, string][] = [
  [ItemType.Melee, "melee"],
  [ItemType.Ranged, "ranged"],
  [ItemType.Ammunition, "ammunition"],
  [ItemType.Armour, "armour"],
  [ItemType.Grimoire, "grimoire"],
  [ItemType.Container, "container"],
  [ItemType.Other, "other"],
];
for (const [type, stats] of ITEM_TYPE_STATS) {
  const typed = item.copy();
  typed.type = type;
  testIsEqualTo(`${stats} item`, typed, {
    ignored: ITEM_TYPE_STATS.map(([, x]) => x).filter((x) => x !== stats),
    unordered: type === ItemType.Armour ? ["armour.location"] : [],
  });
}

describe("printArmourGroup", () => {
  test.each([
    { group: ArmourGroup.SoftLeather, expected: "Soft leather" },
    { group: ArmourGroup.BoiledLeather, expected: "Boiled leather" },
    { group: ArmourGroup.Mail, expected: "Mail" },
    { group: ArmourGroup.Plate, expected: "Plate" },
    { group: ArmourGroup.SoftKit, expected: "Soft kit" },
    { group: ArmourGroup.Brigandine, expected: "Brigandine" },
    { group: ArmourGroup.Other, expected: "Other" },
  ])("formats $expected", ({ group, expected }) => {
    expect(printArmourGroup(group)).toBe(expected);
  });
});

describe("validatePrice", () => {
  test("returns valid for numbers between 0 and 24,000,000,000 (matching backend gte=0,lte=24000000000)", () => {
    const testItem = item.copy();
    testItem.price = 0;
    expect(testItem.validatePrice().valid).toBe(true);

    testItem.price = 2.31;
    expect(testItem.validatePrice().valid).toBe(true);

    testItem.price = 240;
    expect(testItem.validatePrice().valid).toBe(true);

    testItem.price = 24000000000;
    expect(testItem.validatePrice().valid).toBe(true);
  });

  test("returns invalid for negative numbers or numbers exceeding 24,000,000,000", () => {
    const testItem = item.copy();
    testItem.price = -0.01;
    expect(testItem.validatePrice().valid).toBe(false);

    testItem.price = -10;
    expect(testItem.validatePrice().valid).toBe(false);

    testItem.price = 24000000001;
    expect(testItem.validatePrice().valid).toBe(false);

    testItem.price = Number.NaN;
    expect(testItem.validatePrice().valid).toBe(false);
  });
});

describe("item groups by edition", () => {
  test("5e melee groups have no Parry or Engineering", () => {
    expect(meleeGroupsByEdition["4e"]).toContain(MeleeGroup.Parry);
    expect(meleeGroupsByEdition["5e"]).not.toContain(MeleeGroup.Parry);
    expect(meleeGroupsByEdition["5e"]).not.toContain(MeleeGroup.Engineering);
  });

  test("Leather and Shield armour groups are 5e only", () => {
    expect(armourGroupsByEdition["5e"]).toEqual([
      ArmourGroup.Leather,
      ArmourGroup.Mail,
      ArmourGroup.Plate,
      ArmourGroup.Shield,
      ArmourGroup.Other,
    ]);
    expect(armourGroupsByEdition["4e"]).not.toContain(ArmourGroup.Shield);
    expect(printArmourGroup(ArmourGroup.Shield)).toBe("Shield");
    expect(printArmourGroup(ArmourGroup.Leather)).toBe("Leather");
  });
});

describe("Item properties", () => {
  test("updateProperties keeps the value of a property that is already selected", () => {
    const otherItem = item.copy();
    otherItem.updateProperties("prop1", true);
    otherItem.updateProperties("prop3", true);
    expect(otherItem.properties).toEqual({ prop1: "3", prop2: "", prop3: "" });
    otherItem.updateProperties("prop1", false);
    expect(otherItem.properties).toEqual({ prop2: "", prop3: "" });
  });

  test("validateProperties rejects a value that is too long", () => {
    const otherItem = item.copy();
    otherItem.updatePropertyValue("prop2", "1d10");
    expect(otherItem.validateProperties().valid).toBe(true);
    otherItem.updatePropertyValue("prop2", "a".repeat(21));
    expect(otherItem.validateProperties().valid).toBe(false);
    expect(otherItem.isValid()).toBe(false);
  });
});
