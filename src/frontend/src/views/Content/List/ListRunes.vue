<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { printRuneLabel, Rune, runeApi } from "@/services/wh/content/rune.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { runeFilters } from "@/components/filter/runeFilters.ts";

const { edition } = useEdition();
const whList = useWhList(runeApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(runeFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatRuneRow(x)));

function formatRuneRow(rune: Rune) {
  return {
    id: rune.id,
    name: rune.name,
    meta: rune.labels.map((x) => printRuneLabel(x)).join(", "),
    description: rune.description,
    ownerId: rune.ownerId,
    visibility: rune.visibility,
  };
}
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Runes"
    routeName="rune"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
