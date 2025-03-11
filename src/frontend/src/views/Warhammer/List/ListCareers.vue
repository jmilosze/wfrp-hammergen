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
import { computed } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";

import DeleteModal from "../../../components/DeleteModal.vue";
import { getListOfAllValues, getOptions } from "../../../utils/whList.ts";
import SelectInput from "../../../components/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useQueryParams } from "../../../composables/useQueryParams.ts";
import ToolTip from "../../../components/ToolTip.vue";
import TextLink from "../../../components/TextLink.vue";

const whList = useWhList(new CareerApi(authRequest));
await whList.loadWhList();

const allCareerClasses = getListOfAllValues(careerClassList);
const allCareerSpecies = getListOfAllValues(speciesList);

const searchTerm = useQueryParams("search");
const sourceTerm = useQueryParams("source", whList.sourceValues);
const classTerm = useQueryParams("class", allCareerClasses);
const speciesTerm = useQueryParams("species", allCareerSpecies);

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "tooltip", displayName: "", skipStackedTitle: true },
  { name: "class", displayName: "Class", skipStackedTitle: false },
  { name: "species", displayName: "Species", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value === "" || sourceTerm.value in wh.source)
    .filter((wh) => classTerm.value === "" || classTerm.value === wh.careerClass.toString())
    .filter((wh) => speciesTerm.value === "" || wh.species.includes(Number(speciesTerm.value)))
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
    shared: career.shared,
    ownerId: career.ownerId,
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
    <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="classTerm" :options="filteredClassOptions" class="grow mb-2 mx-1" />
    <SelectInput v-model="speciesTerm" :options="filteredSpeciesOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch v-model="searchTerm" :fields="columns" :items="items" :stackedViewSize="ViewSize.lg" class="mx-1">
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="career" :params="{ id: 'create' }">
      Create new
    </LinkButton>

    <template #name="{ name, id }: { name: string; id: string }">
      <TextLink routeName="career" :params="{ id: id }" :sameWindow="true">{{ name }}</TextLink>
    </template>

    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="career"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>

    <template #tooltip="{ shared, canEdit, ownerId }: { shared: boolean; canEdit: boolean; ownerId: string }">
      <ToolTip :shared="shared" :canEdit="canEdit" :ownerId="ownerId" />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
