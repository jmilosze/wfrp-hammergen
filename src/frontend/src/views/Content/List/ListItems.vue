<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { Item, itemApi, printItemType } from "@/services/wh/content/item.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { itemFilters } from "@/components/filter/itemFilters.ts";

const { edition } = useEdition();
const whList = useWhList(itemApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(itemFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatItemRow(x)));

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
