<script setup lang="ts">
import { useWhListUtils } from "../../../composables/whList.ts";
import {
  Career,
  CareerApi,
  careerClassList,
  printClassName,
  printSpeciesName,
  speciesList,
} from "../../../services/wh/career.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { source } from "../../../services/wh/source.ts";
import { TableRow } from "../../../utils/table.ts";
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtons from "../../../components/ListWh/ActionButtons.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/auth.ts";
import DeleteModal from "../../../components/ListWh/DeleteModal.vue";
import { getOptions, queryParamsFromRouterQuery, queryParamsToRouterQuery } from "../../../utils/whList.ts";
import SelectInput from "../../../components/ListWh/SelectInput.vue";

const whList = useWhListUtils(new CareerApi(authRequest));
await whList.loadWhList();

const elementToDelete = ref({ id: "", name: "" });

const router = useRouter();
const queryParams = ref({ search: "", source: "", class: "", species: "" });
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
  { name: "class", displayName: "Class" },
  { name: "species", displayName: "Species" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.class === "" || queryParams.value.class === wh.careerClass.toString())
    .filter((wh) => queryParams.value.species === "" || wh.species.includes(Number(queryParams.value.species)))
    .map((x) => formatCareerRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatCareerRow(career: Career): TableRow {
  let species: string;
  if (career.species.length === speciesList.length) {
    species = "All";
  } else {
    species = career.species.map((x) => printSpeciesName(x)).join(", ");
  }

  return {
    name: addSpaces(career.name),
    class: printClassName(career.careerClass),
    species: species,
    source: Object.keys(career.source)
      .map((x) => source[x])
      .join(", "),
    canEdit: career.canEdit,
    id: career.id,
  };
}

const filteredClassOptions = computed(() => {
  return getOptions(
    careerClassList,
    whList.whList.value.map((wh) => wh.careerClass),
    printClassName,
    "Any class",
  );
});

const filteredSpeciesOptions = computed(() => {
  return getOptions(speciesList, whList.whList.value.map((wh) => wh.species).flat(), printSpeciesName, "Any species");
});
</script>

<template>
  <Header title="Careers"> </Header>
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.class" :options="filteredClassOptions" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.species" :options="filteredSpeciesOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="authStore.loggedIn"
    class="mx-1"
    @createNew="router.push({ name: 'career', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtons
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="elementToDelete = { name: name, id: id }"
        @edit="router.push({ name: 'career', params: { id: id } })"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="elementToDelete" @deleteConfirmed="whList.deleteWh(elementToDelete.id)" />
</template>

<style scoped></style>
