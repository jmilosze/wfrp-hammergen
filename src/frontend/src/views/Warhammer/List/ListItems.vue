<script setup lang="ts">
import { splitQuery, useListQuery, useSourceQuery, useWhList } from "../../../composables/whList.ts";
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
import BrowseList from "../../../components/BrowseList.vue";
import Header from "../../../components/PageHeader.vue";
import { computed, watch } from "vue";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";

import FilterSidebar from "../../../components/FilterSidebar.vue";
import { FilterSection } from "../../../components/filterSection.ts";
import SectionLink from "../../../components/SectionLink.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const { edition } = useEdition();
const whList = useWhList(itemApi(authRequest), edition);
await whList.loadWhList();

const searchTerm = useRouteQuery("search", "");
// The filters, kept in the query string. A group is "type:group", as groups are numbered per type.
const sourceTerm = splitQuery(useSourceQuery(edition));
const typeTerm = useListQuery("type");
const groupTerm = useListQuery("group");

const filters = computed({
  get: () => ({ type: typeTerm.value, group: groupTerm.value, source: sourceTerm.value }),
  set: (value: Record<string, string[]>) => {
    typeTerm.value = value.type ?? [];
    groupTerm.value = value.group ?? [];
    sourceTerm.value = value.source ?? [];
  },
});

const auth = useAuth();

// In a section an item matches any ticked value; the sections combine. Groups only narrow down their own type.
const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value.length === 0 || sourceTerm.value.some((x) => x in wh.source))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.type.toString()))
    .filter((wh) => matchesGroups(wh))
    .map((x) => formatItemRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
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
    {
      key: "source",
      title: "Source",
      collapsed: true,
      options: whList.filteredSourceOptions.value.filter((x) => x.value !== ""),
    },
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
  <AlertBlock
    v-if="whList.apiError.value && whList.showApiError.value"
    alertType="red"
    :centered="true"
    @close="whList.showApiError.value = false"
  >
    {{ whList.apiError.value }}
  </AlertBlock>
  <Header title="Trappings" />
  <div class="flex flex-col @3xl/page:flex-row gap-4">
    <FilterSidebar v-model="filters" :sections="sections">
      <template v-if="auth.loggedIn.value" #actions>
        <SectionLink icon="lucide:plus" routeName="item" :params="{ id: 'create' }">Create new</SectionLink>
      </template>
    </FilterSidebar>
    <BrowseList v-model="searchTerm" :items="items" routeName="item" class="flex-1 min-w-0">
      <!-- Beside the search, except on very small screens, where it is beside the Filters button. -->
      <span v-if="auth.loggedIn.value" class="hidden @md/page:flex">
        <SectionLink icon="lucide:plus" routeName="item" :params="{ id: 'create' }">Create new</SectionLink>
      </span>

      <template #badge="{ ownerId, visibility }: { ownerId: string; visibility: number }">
        <ToolTip :ownerId="ownerId" :visibility="visibility" iconOnly />
      </template>
      <template #end="{ id }: { id: string }">
        <ActionButtonsNonCharacter :id="id" @copy="(copiedId) => whList.copyWh(copiedId)" />
      </template>
    </BrowseList>
  </div>
</template>

<style scoped></style>
