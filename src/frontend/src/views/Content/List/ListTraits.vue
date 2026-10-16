<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { Trait, traitApi } from "@/services/wh/content/trait.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { traitFilters } from "@/components/filter/traitFilters.ts";

const { edition } = useEdition();
const whList = useWhList(traitApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(traitFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatTraitRow(x)));

function formatTraitRow(trait: Trait) {
  return {
    id: trait.id,
    name: trait.name,
    meta: "",
    description: trait.description,
    ownerId: trait.ownerId,
    visibility: trait.visibility,
  };
}
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Creature Traits"
    routeName="trait"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
