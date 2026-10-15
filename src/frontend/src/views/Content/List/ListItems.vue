<script setup lang="ts">
import { useFilterModel, useListQuery, useSourceFilter, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import {
  Item,
  itemApi,
  ItemType,
  itemTypeList,
  meleeGroupsByEdition,
  printItemType,
  printMeleeGroup,
  printRangedGroup,
  rangedGroupList,
  ammoGroupList,
  printAmmoGroup,
  armourGroupsByEdition,
  printArmourGroup,
} from "../../../services/wh/content/item.ts";
import { authRequest } from "../../../services/auth.ts";
import ContentListPage from "../../../components/content/list/ContentListPage.vue";
import { computed, watch } from "vue";
import { FilterSection } from "../../../components/content/list/filterSection.ts";

const { edition } = useEdition();
const whList = useWhList(itemApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string. A group is "type:group", as groups are numbered per type.
const source = useSourceFilter(whList.whList, edition, true);
const typeTerm = useListQuery("type");
const groupTerm = useListQuery("group");

const filters = useFilterModel({ type: typeTerm, group: groupTerm, source: source.term });

// In a section an item matches any ticked value; the sections combine. Groups only narrow down their own type.
const items = computed(() => {
  return whList.whList.value
    .filter((wh) => source.matches(wh))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.type.toString()))
    .filter((wh) => matchesGroups(wh))
    .map((x) => formatItemRow(x));
});

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

function matchesGroups(wh: Item): boolean {
  const prefix = `${wh.type}:`;
  const groups = groupTerm.value.filter((x) => x.startsWith(prefix));
  return groups.length === 0 || groups.includes(`${prefix}${itemGroup(wh)}`);
}

function formatItemRow(item: Item) {
  return {
    id: item.id,
    name: item.name,
    meta: printItemType(item.type),
    description: item.description,
    ownerId: item.ownerId,
    visibility: item.visibility,
  };
}

function groupOptions(type: ItemType): { text: string; value: number }[] {
  switch (type) {
    case ItemType.Melee:
      return meleeGroupsByEdition[edition.value].map((x) => ({ text: printMeleeGroup(x), value: x }));
    case ItemType.Ranged:
      return rangedGroupList.map((x) => ({ text: printRangedGroup(x), value: x }));
    case ItemType.Ammunition:
      return ammoGroupList.map((x) => ({ text: printAmmoGroup(x), value: x }));
    case ItemType.Armour:
      return armourGroupsByEdition[edition.value].map((x) => ({ text: printArmourGroup(x), value: x }));
    default:
      return [];
  }
}

// Types and sources are offered when some item has them. Groups are offered once a type with groups is ticked, under
// their type.
const sections = computed<FilterSection[]>(() => {
  const typesInData = new Set(whList.whList.value.map((wh) => wh.type));
  const types = itemTypeList.filter((x) => typesInData.has(x));
  const groupTypes = types.filter((x) => groupOptions(x).length > 0 && typeTerm.value.includes(x.toString()));
  return [
    { key: "type", title: "Type", options: types.map((x) => ({ text: printItemType(x), value: x.toString() })) },
    {
      key: "group",
      title: "Group",
      options: groupTypes.flatMap((type) =>
        groupOptions(type).map((x) => ({ text: x.text, value: `${type}:${x.value}`, heading: printItemType(type) })),
      ),
    },
    source.section.value,
  ];
});

// Unticking a type drops its groups.
watch(typeTerm, (types) => {
  const kept = groupTerm.value.filter((x) => types.includes(x.split(":")[0]));
  if (kept.length !== groupTerm.value.length) {
    groupTerm.value = kept;
  }
});
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Trappings"
    routeName="item"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
