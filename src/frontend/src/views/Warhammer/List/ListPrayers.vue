<script setup lang="ts">
import { computed } from "vue";
import { useFilterModel, useSourceFilter, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { Prayer, prayerApi } from "../../../services/wh/content/prayer.ts";
import { authRequest } from "../../../services/auth.ts";
import ContentListPage from "../../../components/ContentListPage.vue";

const { edition } = useEdition();
const whList = useWhList(prayerApi(authRequest), edition);
await whList.loadWhList();

// The source is the only filter, so it starts open.
const source = useSourceFilter(whList.whList, edition, false);
const filters = useFilterModel({ source: source.term });
const sections = computed(() => [source.section.value]);

const items = computed(() => whList.whList.value.filter((wh) => source.matches(wh)).map((x) => formatPrayerRow(x)));

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
