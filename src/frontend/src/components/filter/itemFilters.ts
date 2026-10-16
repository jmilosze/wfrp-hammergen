import {
  ammoGroupList,
  armourGroupList,
  Item,
  ItemType,
  itemTypeList,
  meleeGroupList,
  printAmmoGroup,
  printArmourGroup,
  printItemType,
  printMeleeGroup,
  printRangedGroup,
  rangedGroupList,
} from "@/services/wh/content/item.ts";
import { ContentFilters } from "./contentFilter.ts";
import { sourceFilter } from "./sourceFilter.ts";

// The filters of trappings; the types some trapping has are offered.
export const itemFilters = {
  type: {
    title: "Type",
    options: (list) => {
      const typesInData = new Set(list.map((wh) => wh.type));
      return itemTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printItemType(x), value: x.toString() }));
    },
    matches: (wh, values) => values.includes(wh.type.toString()),
  },
  // A group is "type:group", as groups are numbered per type. Groups are offered once a type with groups is ticked,
  // under their type, those some trapping of the type has (a 5e character allowing 4e content has the groups of both
  // editions). Groups only narrow down their own type.
  group: {
    title: "Group",
    options: (list, ticked) => {
      const groupsInData = new Set(list.map((wh) => `${wh.type}:${itemGroup(wh)}`));
      return itemTypeList
        .filter((type) => (ticked.type ?? []).includes(type.toString()))
        .flatMap((type) =>
          groupOptions(type)
            .map((x) => ({ text: x.text, value: `${type}:${x.value}`, heading: printItemType(type) }))
            .filter((x) => groupsInData.has(x.value)),
        );
    },
    matches: (wh, values) => {
      const prefix = `${wh.type}:`;
      const groups = values.filter((x) => x.startsWith(prefix));
      return groups.length === 0 || groups.includes(`${prefix}${itemGroup(wh)}`);
    },
  },
  source: sourceFilter(true),
} satisfies ContentFilters<Item>;

function itemGroup(wh: Item): number | undefined {
  switch (wh.type) {
    case ItemType.Melee:
      return wh.melee.group;
    case ItemType.Ranged:
      return wh.ranged.group;
    case ItemType.Ammunition:
      return wh.ammunition.group;
    case ItemType.Armour:
      return wh.armour.group;
    default:
      return undefined;
  }
}

function groupOptions(type: ItemType): { text: string; value: number }[] {
  switch (type) {
    case ItemType.Melee:
      return meleeGroupList.map((x) => ({ text: printMeleeGroup(x), value: x }));
    case ItemType.Ranged:
      return rangedGroupList.map((x) => ({ text: printRangedGroup(x), value: x }));
    case ItemType.Ammunition:
      return ammoGroupList.map((x) => ({ text: printAmmoGroup(x), value: x }));
    case ItemType.Armour:
      return armourGroupList.map((x) => ({ text: printArmourGroup(x), value: x }));
    default:
      return [];
  }
}
