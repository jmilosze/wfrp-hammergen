<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { ItemProperty, itemPropertyApi, printItemPropertyType } from "@/services/wh/content/itemproperty.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { itemPropertyFilters } from "@/components/filter/itemPropertyFilters.ts";

const { edition } = useEdition();
const whList = useWhList(itemPropertyApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(itemPropertyFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatItemPropertyRow(x)));

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
