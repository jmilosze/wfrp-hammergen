<script setup lang="ts">
import { useFilterModel, useListQuery, useSourceFilter, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import {
  ItemProperty,
  itemPropertyApi,
  itemPropertyTypeList,
  printItemPropertyType,
} from "../../../services/wh/content/itemproperty.ts";
import { itemTypeList, printItemType } from "../../../services/wh/content/item.ts";
import { authRequest } from "../../../services/auth.ts";
import ContentListPage from "../../../components/ContentListPage.vue";
import { computed } from "vue";
import { FilterSection } from "../../../components/filterSection.ts";

const { edition } = useEdition();
const whList = useWhList(itemPropertyApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const source = useSourceFilter(whList.whList, edition, true);
const typeTerm = useListQuery("type");
const applicableToTerm = useListQuery("applicableTo");

const filters = useFilterModel({ type: typeTerm, applicableTo: applicableToTerm, source: source.term });

// In a section an entry matches any ticked value; the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => source.matches(wh))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.type.toString()))
    .filter(
      (wh) =>
        applicableToTerm.value.length === 0 ||
        wh.applicableTo.some((x) => applicableToTerm.value.includes(x.toString())),
    )
    .map((x) => formatItemPropertyRow(x)),
);

function formatItemPropertyRow(itemProperty: ItemProperty) {
  return {
    id: itemProperty.id,
    name: itemProperty.name,
    meta: printItemPropertyType(itemProperty.type),
    description: itemProperty.description,
    ownerId: itemProperty.ownerId,
    visibility: itemProperty.visibility,
  };
}

// Types, trapping types and sources are offered when some entry has them.
const sections = computed<FilterSection[]>(() => {
  const typesInData = new Set(whList.whList.value.map((wh) => wh.type));
  const applicableInData = new Set(whList.whList.value.flatMap((wh) => wh.applicableTo));
  return [
    {
      key: "type",
      title: "Type",
      options: itemPropertyTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printItemPropertyType(x), value: x.toString() })),
    },
    {
      key: "applicableTo",
      title: "Applicable to",
      options: itemTypeList
        .filter((x) => applicableInData.has(x))
        .map((x) => ({ text: printItemType(x), value: x.toString() })),
    },
    source.section.value,
  ];
});
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Qualities and Flaws"
    routeName="property"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
