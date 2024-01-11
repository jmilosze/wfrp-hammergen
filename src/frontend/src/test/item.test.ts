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
} from "../services/wh/item.ts";
import { ApiResponse } from "../services/wh/common.ts";
import { expect, test } from "vitest";
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
  melee: { hands: 1, dmg: 1, dmgSbMult: 4, reach: 7, group: MeleeGroup.Basic.valueOf() },
  ranged: { hands: 1, dmg: 2, dmgSbMult: 5, rng: 8, rngSbMult: 9, group: RangedGroup.Blackpowder.valueOf() },
  ammunition: { dmg: 0, rng: 3, rngMult: 6, group: AmmoGroup.Bow.valueOf() },
  armour: {
    points: 0,
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
  melee: { hands: 1, dmg: 1, dmgSbMult: 4, reach: 7, group: MeleeGroup.Basic.valueOf() },
  ranged: { hands: 1, dmg: 2, dmgSbMult: 5, rng: 8, rngSbMult: 9, group: RangedGroup.Blackpowder.valueOf() },
  ammunition: { dmg: 0, rng: 3, rngMult: 6, group: AmmoGroup.Bow.valueOf() },
  armour: {
    points: 0,
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
