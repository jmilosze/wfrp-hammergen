<script setup lang="ts">
import { computed } from "vue";
import { useFilterModel, useSourceFilter, useWhList } from "@/composables/whList.ts";
import { useEdition } from "@/composables/edition.ts";
import { Trait, traitApi } from "@/services/wh/content/trait.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";

const { edition } = useEdition();
const whList = useWhList(traitApi(authRequest), edition);
await whList.loadWhList();

// The source is the only filter, so it starts open.
const source = useSourceFilter(whList.whList, edition, false);
const filters = useFilterModel({ source: source.term });
const sections = computed(() => [source.section.value]);

const items = computed(() => whList.whList.value.filter((wh) => source.matches(wh)).map((x) => formatTraitRow(x)));

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
