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
  RangedGroup,
  RangedType,
  WeaponHands,
} from "../services/wh/item.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { describe, expect, test } from "vitest";
import { testIsEqualCommonProperties } from "./commonTests.ts";

const itemApiData: ItemApiData = {
  name: "item",
  description: "desc",
  shared: true,
  source: { 1: "page 2", 3: "page 5-10" },
  price: 12,
  enc: 2,
  availability: Availability.Exotic,
  properties: ["prop1", "prop2"],
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
  availability: Availability.Exotic,
  properties: new Set(["prop1", "prop2"]),
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
      hands: WeaponHands.Any,
      dmg: 10,
      dmgSbMult: 40,
      reach: MeleeReach.VeryLong,
      group: MeleeGroup.Basic,
    };
    otherItem.ammunition = { dmg: 2, rng: 34, rngMult: 6, group: AmmoGroup.Bow };
    otherItem.armour = {
      points: 0,
      location: [],
      group: ArmourGroup.Plate,
    };
    otherItem.grimoire = { spells: new Set<string>() };
    otherItem.container = { capacity: 2, carryType: 1 };
    otherItem.other = { carryType: 0 };
    expect(item.isEqualTo(otherItem)).toBe(true);
  });

  test("when item is armour and other item has location in different order", () => {
    const armour = item.copy();
    armour.type = ItemType.Armour;
    const otherItem = armour.copy();
    otherItem.armour.location = [ArmourLocation.Head, ArmourLocation.Arms];
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
    otherItem.availability = Availability.Common;
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  test("when other item has different value of type", () => {
    const otherItem = item.copy();
    otherItem.type = ItemType.Container;
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  test("when other item has properties field that is a subset", () => {
    const otherItem = item.copy();
    otherItem.properties = new Set(["prop1"]);
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  test("when other item has group properties of the same length but different values", () => {
    const otherItem = item.copy();
    otherItem.properties = new Set(["prop3", "prop4"]);
    expect(item.isEqualTo(otherItem)).toBe(false);
  });

  describe("when item is melee", () => {
    const melee = item.copy();
    melee.type = ItemType.Melee;

    test("when other item has different value of hands", () => {
      const otherItem = melee.copy();
      otherItem.melee.hands = WeaponHands.TwoHanded;
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
      otherItem.melee.reach = MeleeReach.Personal;
      expect(melee.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of group", () => {
      const otherItem = melee.copy();
      otherItem.melee.group = MeleeGroup.Fencing;
      expect(melee.isEqualTo(otherItem)).toBe(false);
    });
  });

  describe("when item is ranged", () => {
    test("when other item has different value of hands", () => {
      const otherItem = item.copy();
      otherItem.ranged.hands = WeaponHands.TwoHanded;
      expect(item.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of dmg", () => {
      const otherItem = item.copy();
      otherItem.ranged.dmg = 100;
      expect(item.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of sbMult", () => {
      const otherItem = item.copy();
      otherItem.ranged.dmgSbMult = 100;
      expect(item.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of range", () => {
      const otherItem = item.copy();
      otherItem.ranged.rng = 100;
      expect(item.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of rngSbMult", () => {
      const otherItem = item.copy();
      otherItem.ranged.dmgSbMult = 100;
      expect(item.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of group", () => {
      const otherItem = item.copy();
      otherItem.ranged.group = RangedGroup.Crossbow;
      expect(item.isEqualTo(otherItem)).toBe(false);
    });
  });

  describe("when item is ammunition", () => {
    const ammo = item.copy();
    ammo.type = ItemType.Ammunition;

    test("when other item has different value of dmg", () => {
      const otherItem = ammo.copy();
      otherItem.ammunition.dmg = 100;
      expect(ammo.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of range", () => {
      const otherItem = ammo.copy();
      otherItem.ammunition.rng = 100;
      expect(ammo.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of rngMult", () => {
      const otherItem = ammo.copy();
      otherItem.ammunition.rngMult = 100;
      expect(ammo.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of group", () => {
      const otherItem = ammo.copy();
      otherItem.ammunition.group = AmmoGroup.Blowpipe;
      expect(ammo.isEqualTo(otherItem)).toBe(false);
    });
  });

  describe("when item is armour", () => {
    const armour = item.copy();
    armour.type = ItemType.Armour;

    test("when other item has different value of points", () => {
      const otherItem = armour.copy();
      otherItem.armour.points = 100;
      expect(armour.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of group", () => {
      const otherItem = armour.copy();
      otherItem.armour.group = ArmourGroup.Mail;
      expect(armour.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has location field that is a subset", () => {
      const otherItem = armour.copy();
      otherItem.armour.location = [ArmourLocation.Arms];
      expect(armour.isEqualTo(otherItem)).toBe(false);
    });

    test("when other skill has location field of the same length but different values", () => {
      const otherItem = armour.copy();
      otherItem.armour.location = [ArmourLocation.Legs, ArmourLocation.Arms];
      expect(armour.isEqualTo(otherItem)).toBe(false);
    });
  });

  describe("when item is grimoire", () => {
    const grimoire = item.copy();
    grimoire.type = ItemType.Grimoire;

    test("when other item has spells field that is a subset", () => {
      const otherItem = grimoire.copy();
      otherItem.grimoire.spells = new Set(["spell1"]);
      expect(grimoire.isEqualTo(otherItem)).toBe(false);
    });

    test("when other skill has spells field of the same length but different values", () => {
      const otherItem = grimoire.copy();
      otherItem.grimoire.spells = new Set(["spell1", "spell3"]);
      expect(grimoire.isEqualTo(otherItem)).toBe(false);
    });
  });

  describe("when item is container", () => {
    const container = item.copy();
    container.type = ItemType.Container;

    test("when other item has different value of capacity", () => {
      const otherItem = container.copy();
      otherItem.container.capacity = 100;
      expect(container.isEqualTo(otherItem)).toBe(false);
    });

    test("when other item has different value of carryType", () => {
      const otherItem = container.copy();
      otherItem.container.carryType = CarryType.CarriableAndWearable;
      expect(container.isEqualTo(otherItem)).toBe(false);
    });
  });

  describe("when item is other", () => {
    const other = item.copy();
    other.type = ItemType.Other;

    test("when other item has different value of carryType", () => {
      const otherItem = other.copy();
      otherItem.other.carryType = CarryType.NotCarriableAndNotWearable;
      expect(other.isEqualTo(otherItem)).toBe(false);
    });
  });
});
