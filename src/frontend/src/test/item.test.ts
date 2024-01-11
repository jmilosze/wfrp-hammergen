import {
  AmmoGroup,
  ArmourGroup,
  ArmourLocation,
  Availability,
  Item,
  ItemApiData,
  ItemType,
  MeleeGroup,
  RangedGroup,
  apiResponseToModel,
  modelToApi,
  MeleeReach,
  WeaponHands,
} from "../services/wh/item.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const itemApiData = {
  name: "item",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
  price: 12,
  enc: 2,
  availability: Availability.Exotic.valueOf(),
  properties: ["prop1", "prop2"],
  type: ItemType.Ranged.valueOf(),
  melee: {
    hands: WeaponHands["One-Handed"].valueOf(),
    dmg: 1,
    dmgSbMult: 4,
    reach: MeleeReach.Average.valueOf(),
    group: MeleeGroup.Basic.valueOf(),
  },
  ranged: {
    hands: WeaponHands["One-Handed"].valueOf(),
    dmg: 2,
    dmgSbMult: 5,
    rng: 8,
    rngSbMult: 9,
    group: RangedGroup.Blackpowder.valueOf(),
  },
  ammunition: { dmg: 0, rng: 3, rngMult: 6, group: AmmoGroup.Bow.valueOf() },
  armour: {
    points: 1,
    location: [ArmourLocation.Arms.valueOf(), ArmourLocation.Head.valueOf()],
    group: ArmourGroup.Plate.valueOf(),
  },
  grimoire: { spells: ["spell1", "spell2"] },
  container: { capacity: 1, carryType: 0 },
  other: { carryType: 1 },
};

const itemApiResponse: ApiResponse<ItemApiData> = {
  id: "id",
  canEdit: true,
  ownerId: "owner",
  object: itemApiData,
};

const item = new Item({
  id: "id",
  canEdit: true,
  name: "item",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
  price: 12,
  enc: 2,
  availability: Availability.Exotic.valueOf(),
  properties: ["prop1", "prop2"],
  type: ItemType.Ranged.valueOf(),
  melee: {
    hands: WeaponHands["One-Handed"].valueOf(),
    dmg: 1,
    dmgSbMult: 4,
    reach: MeleeReach.Average.valueOf(),
    group: MeleeGroup.Basic.valueOf(),
  },
  ranged: {
    hands: WeaponHands["One-Handed"].valueOf(),
    dmg: 2,
    dmgSbMult: 5,
    rng: 8,
    rngSbMult: 9,
    group: RangedGroup.Blackpowder.valueOf(),
  },
  ammunition: { dmg: 0, rng: 3, rngMult: 6, group: AmmoGroup.Bow.valueOf() },
  armour: {
    points: 1,
    location: [ArmourLocation.Arms.valueOf(), ArmourLocation.Head.valueOf()],
    group: ArmourGroup.Plate.valueOf(),
  },
  grimoire: { spells: ["spell1", "spell2"] },
  container: { capacity: 1, carryType: 0 },
  other: { carryType: 1 },
});

test("apiResponseToModel returns expected item", () => {
  expect(apiResponseToModel(itemApiResponse)).toMatchObject(item);
});

test("modelToApi returns expected api item data", () => {
  expect(modelToApi(item)).toMatchObject(itemApiData);
});

testIsEqualCommonProperties("item", item);

describe("isEqualTo returns true", () => {
  test("when other item has different stats for types other than itself", () => {
    const otherItem = item.copy();
    otherItem.melee = {
      hands: 10,
      dmg: 10,
      dmgSbMult: 40,
      reach: MeleeReach["Very long"].valueOf(),
      group: MeleeGroup.Basic.valueOf(),
    };
    otherItem.ammunition = { dmg: 2, rng: 34, rngMult: 6, group: AmmoGroup.Bow.valueOf() };
    otherItem.armour = {
      points: 0,
      location: [],
      group: ArmourGroup.Plate.valueOf(),
    };
    otherItem.grimoire = { spells: [] };
    otherItem.container = { capacity: 2, carryType: 1 };
    otherItem.other = { carryType: 0 };
    expect(item.isEqualTo(otherItem)).toBe(true);
  });

  test("when other item has property field with elements in different order", () => {
    const otherItem = item.copy();
    otherItem.properties = ["prop2", "prop1"];
    expect(item.isEqualTo(otherItem)).toBe(true);
  });

  test("when item is grimoire and other item has spells in different order", () => {
    const grimoire = item.copy();
    grimoire.type = ItemType.Grimoire.valueOf();
    const otherItem = grimoire.copy();
    otherItem.grimoire.spells = ["spell2", "spell1"];
    expect(grimoire.isEqualTo(otherItem)).toBe(true);
  });

  test("when item is armour and other item has location in different order", () => {
    const armour = item.copy();
    armour.type = ItemType.Armour.valueOf();
    const otherItem = armour.copy();
    otherItem.armour.location = [ArmourLocation.Head.valueOf(), ArmourLocation.Arms.valueOf()];
    expect(armour.isEqualTo(otherItem)).toBe(true);
  });
});

describe("isEqualTo returns false", () => {
  test("when other item has different value of price", () => {
    const otherItem = item.copy();
    otherItem.price = 5;
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  test("when other item has different value of enc", () => {
    const otherItem = item.copy();
    otherItem.enc = 3;
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  test("when other item has different value of availability", () => {
    const otherItem = item.copy();
    otherItem.availability = Availability.Common.valueOf();
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  test("when other item has different value of type", () => {
    const otherItem = item.copy();
    otherItem.type = ItemType.Container.valueOf();
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  test("when other item has properties field that is a subset", () => {
    const otherItem = item.copy();
    otherItem.properties = ["prop1"];
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  test("when other item has group properties of the same length but different values", () => {
    const otherItem = item.copy();
    otherItem.properties = ["prop3", "prop4"];
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  describe("when item is melee", () => {
    const melee = item.copy();
    melee.type = ItemType.Melee.valueOf();

    test("when other item has different value of hands", () => {
      const otherItem = melee.copy();
      otherItem.melee.hands = WeaponHands["Two-Handed"].valueOf();
      expect(melee.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of dmg", () => {
      const otherItem = melee.copy();
      otherItem.melee.dmg = 100;
      expect(melee.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of sbMult", () => {
      const otherItem = melee.copy();
      otherItem.melee.dmgSbMult = 100;
      expect(melee.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of reach", () => {
      const otherItem = melee.copy();
      otherItem.melee.reach = MeleeReach.Personal.valueOf();
      expect(melee.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of group", () => {
      const otherItem = melee.copy();
      otherItem.melee.group = MeleeGroup.Fencing.valueOf();
      expect(melee.isEqualTo(otherItem)).toBe(false);
    });
  });
});
