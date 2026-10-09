<script setup lang="ts">
import { useSourceQuery, useWhList } from "../../../composables/whList.ts";
import { useEdition } from "../../../composables/edition.ts";
import { Career, careerApi, careerClassList, printClassName } from "../../../services/wh/content/career.ts";
import { printSpeciesName, careerSpeciesByEdition } from "../../../services/wh/core/species.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { source } from "../../../services/wh/core/source.ts";
import { computed } from "vue";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";

import { getOptions } from "../../../services/wh/core/listOptions.ts";
import SelectInput from "../../../components/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const { edition } = useEdition();
const whList = useWhList(careerApi(authRequest), edition);
await whList.loadWhList();

const searchTerm = useRouteQuery("search", "");
const sourceTerm = useSourceQuery(edition);
const classTerm = useRouteQuery("class", "");
const speciesTerm = useRouteQuery("species", "");

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "class", displayName: "Class", skipStackedTitle: false },
  { name: "species", displayName: "Species", skipStackedTitle: false },
  { name: "tooltip", displayName: "Visibility", skipStackedTitle: true },
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
  if (career.species.length === careerSpeciesByEdition[edition.value].length) {
    species = "All";
  } else {
    species = career.species.map((x) => printSpeciesName(x)).join(", ");
  }

  return {
    name: career.name,
    class: printClassName(career.careerClass),
    species: species,
    source: Object.keys(career.source)
      .map((x) => source[x])
      .join(", "),
    id: career.id,
    ownerId: career.ownerId,
    visibility: career.visibility,
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
  return getOptions(
    careerSpeciesByEdition[edition.value],
    whList.whList.value.map((wh) => wh.species).flat(),
    printSpeciesName,
    "Any species",
  );
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
  <TableWithSearch
    v-model="searchTerm"
    :fields="columns"
    :items="items"
    stackBreakpoint="4xl"
    rowRouteName="career"
    class="mx-1"
  >
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="career" :params="{ id: 'create' }">
      Create new
    </LinkButton>

    <template #actions="{ id }: { id: string }">
      <ActionButtonsNonCharacter :id="id" @copy="(copiedId) => whList.copyWh(copiedId)" />
    </template>

    <template #tooltip="{ ownerId, visibility }: { ownerId: string; visibility?: number }">
      <ToolTip :ownerId="ownerId" :visibility="visibility" />
    </template>
  </TableWithSearch>
</template>

<style scoped></style>
