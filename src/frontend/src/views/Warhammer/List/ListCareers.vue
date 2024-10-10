<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
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
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";
import { useRouter } from "vue-router";
import DeleteModal from "../../../components/DeleteModal.vue";
import { getOptions, queryParamsFromRouterQuery, queryParamsToRouterQuery } from "../../../utils/whList.ts";
import SelectInput from "../../../components/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";

const whList = useWhList(new CareerApi(authRequest));
await whList.loadWhList();

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

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "class", displayName: "Class", skipStackedTitle: false },
  { name: "species", displayName: "Species", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.class === "" || queryParams.value.class === wh.careerClass.toString())
    .filter((wh) => queryParams.value.species === "" || wh.species.includes(Number(queryParams.value.species)))
    .map((x) => formatCareerRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatCareerRow(career: Career) {
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
  <AlertBlock
    v-if="whList.apiError.value && whList.showApiError.value"
    alertType="red"
    :centered="true"
    @close="whList.showApiError.value = false"
  >
    {{ whList.apiError.value }}
  </AlertBlock>
  <Header title="Careers" />
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
    class="mx-1"
  >
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="career" :params="{ id: 'create' }">
      Create new
    </LinkButton>
    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="career"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
