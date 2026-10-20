import { describe, expect, test } from "vitest";
import { encumbranceItems, getEncumbrance } from "./encumbrance.ts";
import { ItemType } from "@/services/wh/content/item.ts";

describe("getEncumbrance", () => {
  test("sums each group and the total", () => {
    const equipped = [
      { type: ItemType.Melee, enc: 1, number: 2 },
      { type: ItemType.Ranged, enc: 2, number: 1 },
      { type: ItemType.Ammunition, enc: 0, number: 12 },
      { type: ItemType.Armour, enc: 3, number: 1 },
      { type: ItemType.Armour, enc: 1, number: 2 },
      { type: ItemType.Other, enc: 2, number: 1 },
      { type: ItemType.Container, enc: 0, number: 1 },
    ];
    const carried = [
      { type: ItemType.Other, enc: 1, number: 3 },
      { type: ItemType.Armour, enc: 2, number: 1 },
    ];
    expect(getEncumbrance(equipped, carried)).toEqual({
      weapons: 4,
      armour: 2,
      otherEquipped: 1,
      carried: 5,
      total: 12,
    });
  });

  test("worn items count one less but never below zero", () => {
    const equipped = [
      { type: ItemType.Armour, enc: 0, number: 1 },
      { type: ItemType.Other, enc: 0.5, number: 2 },
    ];
    expect(getEncumbrance(equipped, [])).toEqual({ weapons: 0, armour: 0, otherEquipped: 0, carried: 0, total: 0 });
  });

  test("carried items count their full Enc", () => {
    const carried = [{ type: ItemType.Armour, enc: 3, number: 1 }];
    expect(getEncumbrance([], carried).carried).toBe(3);
  });
});

describe("encumbranceItems", () => {
  test("pairs the entries' quantities with the items, leaving out unknown ids", () => {
    const items = [
      { id: "a", type: ItemType.Melee, enc: 1 },
      { id: "b", type: ItemType.Other, enc: 2 },
    ];
    const selected = [
      { id: "a", number: 2, value: "" },
      { id: "missing", number: 1, value: "" },
      { id: "b", number: 1, value: "Axe" },
    ];
    expect(encumbranceItems(selected, items)).toEqual([
      { type: ItemType.Melee, enc: 1, number: 2 },
      { type: ItemType.Other, enc: 2, number: 1 },
    ]);
  });
});
