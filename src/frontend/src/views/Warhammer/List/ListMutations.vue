<script setup lang="ts">
import { useWhListUtils } from "../../../composables/whList.ts";
import { Mutation, MutationApi, mutationTypeList, printMutationType } from "../../../services/wh/mutation.ts";
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
import {
  getOptions,
  queryParamsFromRouterQuery,
  queryParamsToRouterQuery,
  SimpleQuery,
} from "../../../utils/whList.ts";
import SelectInput from "../../../components/ListWh/SelectInput.vue";

const whList = useWhListUtils(new MutationApi(authRequest));
await whList.loadWhList();

const elementToDelete = ref({ id: "", name: "" });

const router = useRouter();
const queryParams = ref({ search: "", source: "", type: "" }) as Ref<SimpleQuery>;
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
  { name: "type", displayName: "Type" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.type === "" || queryParams.value.type === wh.type.toString())
    .map((x) => formatMutationRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatMutationRow(mutation: Mutation): TableRow {
  return {
    name: addSpaces(mutation.name),
    type: printMutationType(mutation.type),
    source: Object.keys(mutation.source)
      .map((x) => source[x])
      .join(", "),
    description: mutation.description,
    canEdit: mutation.canEdit,
    id: mutation.id,
  };
}

const filteredTypeOptions = computed(() => {
  return getOptions(
    mutationTypeList,
    whList.whList.value.map((wh) => wh.type),
    printMutationType,
  );
});
</script>

<template>
  <Header title="Mutations"> </Header>
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.type" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="authStore.loggedIn"
    class="mx-1"
    @createNew="router.push({ name: 'mutation', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtons
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="elementToDelete = { name: name, id: id }"
        @edit="router.push({ name: 'mutation', params: { id: id } })"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="elementToDelete" @deleteConfirmed="whList.deleteWh(elementToDelete.id)" />
</template>

<style scoped></style>
