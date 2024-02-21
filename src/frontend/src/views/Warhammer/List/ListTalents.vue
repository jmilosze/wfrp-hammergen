<script setup lang="ts">
import { useWhListUtils } from "../../../composables/whList.ts";
import { Talent, TalentApi } from "../../../services/wh/talent.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { source } from "../../../services/wh/source.ts";
import { TableRow } from "../../../utils/table.ts";
import { computed, ref, watch, Ref } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtons from "../../../components/ListWh/ActionButtons.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/auth.ts";
import DeleteModal from "../../../components/ListWh/DeleteModal.vue";
import { queryParamsFromRouterQuery, queryParamsToRouterQuery, SimpleQuery } from "../../../utils/queryParams.ts";
import SelectInput from "../../../components/ListWh/SelectInput.vue";

const whList = useWhListUtils(new TalentApi(authRequest));
await whList.loadWhList();

const elementToDelete = ref({ id: "", name: "" });

const router = useRouter();
const queryParams = ref({ search: "", source: "" }) as Ref<SimpleQuery>;
queryParamsFromRouterQuery(queryParams.value, router.currentRoute.value.query);
watch(
  () => queryParams,
  (newValue) => {
    router.replace({ query: queryParamsToRouterQuery(newValue.value) });
  },
  { deep: true },
);

const authStore = useAuthStore();

const columns = [
  { name: "name", displayName: "Name" },
  { name: "maxRank", displayName: "Max rank" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .map((x) => formatTalentRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatTalentRow(talent: Talent): TableRow {
  return {
    name: addSpaces(talent.name),
    maxRank: talent.maxRankDisplay(),
    source: Object.keys(talent.source)
      .map((x) => source[x])
      .join(", "),
    description: talent.description,
    canEdit: talent.canEdit,
    id: talent.id,
  };
}
</script>

<template>
  <Header title="Talents"> </Header>
  <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" />
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.md"
    :addCreateNewBtn="authStore.loggedIn"
    @createNew="router.push({ name: 'talent', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtons
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="elementToDelete = { name: name, id: id }"
        @edit="router.push({ name: 'talent', params: { id: id } })"
      />
    </template>

    <template #maxRank="{ maxRank }">
      <div class="text-nowrap">
        {{ maxRank }}
      </div>
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="elementToDelete" @deleteConfirmed="whList.deleteWh(elementToDelete.id)" />
</template>

<style scoped></style>
