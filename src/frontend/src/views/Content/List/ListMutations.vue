<script setup lang="ts">
import { computed } from "vue";
import { useWhList } from "@/composables/whList.ts";
import { useListFilters } from "@/composables/listFilters.ts";
import { useEdition } from "@/composables/edition.ts";
import { Mutation, mutationApi, printMutationType } from "@/services/wh/content/mutation.ts";
import { authRequest } from "@/services/auth.ts";
import ContentListPage from "@/components/content/list/ContentListPage.vue";
import { mutationFilters } from "@/components/filter/mutationFilters.ts";

const { edition } = useEdition();
const whList = useWhList(mutationApi(authRequest), edition);
await whList.loadWhList();

// The filters, kept in the query string.
const { ticked: filters, sections, matches } = useListFilters(mutationFilters, whList.whList);
const items = computed(() => whList.whList.value.filter((wh) => matches(wh)).map((x) => formatMutationRow(x)));

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
