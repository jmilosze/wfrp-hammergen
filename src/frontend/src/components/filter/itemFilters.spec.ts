import { describe, expect, test } from "vitest";
import { ArmourGroup, Item, ItemType, MeleeGroup } from "@/services/wh/content/item.ts";
import { filterSections, matchesFilters } from "./contentFilter.ts";
import { itemFilters } from "./itemFilters.ts";

function melee(id: string, group: MeleeGroup): Item {
  const item = new Item({ id, type: ItemType.Melee });
  item.melee.group = group;
  return item;
}

function armour(id: string, group: ArmourGroup): Item {
  const item = new Item({ id, type: ItemType.Armour });
  item.armour.group = group;
  return item;
}

const sword = melee("sword", MeleeGroup.Basic);
const dagger = melee("dagger", MeleeGroup.Parry);
const shield = armour("shield", ArmourGroup.Shield);
const bag = new Item({ id: "bag", type: ItemType.Container });
const meleeType = ItemType.Melee.toString();
const armourType = ItemType.Armour.toString();

describe("itemFilters", () => {
  test("offers the types some trapping has", () => {
    const types = filterSections(itemFilters, [sword, bag], {})[0].options;
    expect(types.map((x) => x.text)).toEqual(["Melee", "Container"]);
  });

  test("offers the groups of the ticked types that some trapping has, of either edition", () => {
    const groups = filterSections(itemFilters, [sword, dagger, shield, bag], { type: [meleeType, armourType] })[1]
      .options;
    expect(groups.map((x) => `${x.heading} ${x.text}`)).toEqual(["Melee Basic", "Melee Parry", "Armour Shield"]);
  });

  test("matches trappings of a ticked type, groups narrowing down only their own type", () => {
    const ticked = { type: [meleeType, armourType], group: [`${meleeType}:${MeleeGroup.Parry}`] };
    expect([sword, dagger, shield, bag].filter((x) => matchesFilters(itemFilters, x, ticked))).toEqual([
      dagger,
      shield,
    ]);
  });
});
