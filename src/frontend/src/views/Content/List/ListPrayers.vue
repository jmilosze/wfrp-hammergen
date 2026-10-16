<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { Prayer, prayerApi } from "@/services/wh/content/prayer.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { prayerFilters } from "@/components/filter/prayerFilters.ts";

const { edition } = useEdition();
const whList = useWhList(prayerApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(prayerFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatPrayerRow(x)));

function formatPrayerRow(prayer: Prayer) {
  return {
    id: prayer.id,
    name: prayer.name,
    meta: "",
    description: prayer.description,
    ownerId: prayer.ownerId,
    visibility: prayer.visibility,
  };
}
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Prayers"
    routeName="prayer"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
