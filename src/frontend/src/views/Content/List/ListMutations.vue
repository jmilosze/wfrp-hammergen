<script setup lang="ts">
import { computed } from "vue";
import { useFilterModel, useListQuery, useSourceFilter, useWhList } from "@/composables/whList.ts";
import { useEdition } from "@/composables/edition.ts";
import { Mutation, mutationApi, mutationTypeList, printMutationType } from "@/services/wh/content/mutation.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { FilterSection } from "@/components/content/list/filterSection.ts";

const { edition } = useEdition();
const whList = useWhList(mutationApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const source = useSourceFilter(whList.whList, edition, true);
const typeTerm = useListQuery("type");
const filters = useFilterModel({ type: typeTerm, source: source.term });

// In a section an entry matches any ticked value; the sections combine.
const items = computed(() =>
  whList.whList.value
    .filter((wh) => source.matches(wh))
    .filter((wh) => typeTerm.value.length === 0 || typeTerm.value.includes(wh.type.toString()))
    .map((x) => formatMutationRow(x)),
);

function formatMutationRow(mutation: Mutation) {
  return {
    id: mutation.id,
    name: mutation.name,
    meta: printMutationType(mutation.type),
    description: mutation.description,
    ownerId: mutation.ownerId,
    visibility: mutation.visibility,
  };
}

// Types and sources are offered when some mutation has them.
const sections = computed<FilterSection[]>(() => {
  const typesInData = new Set(whList.whList.value.map((wh) => wh.type));
  return [
    {
      key: "type",
      title: "Type",
      options: mutationTypeList
        .filter((x) => typesInData.has(x))
        .map((x) => ({ text: printMutationType(x), value: x.toString() })),
    },
    source.section.value,
  ];
});
</script>

<template>
  <ContentListPage
    v-model:filters="filters"
    title="Mutations"
    routeName="mutation"
    :items="items"
    :sections="sections"
    :list="whList"
  />
</template>
