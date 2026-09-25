<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Trait, traitApi } from "../../../services/wh/trait.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { source } from "../../../services/wh/source.ts";
import { computed } from "vue";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";

import SelectInput from "../../../components/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const whList = useWhList(traitApi(authRequest));
await whList.loadWhList();

const searchTerm = useRouteQuery("search", "");
const sourceTerm = useRouteQuery("source", "");

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "tooltip", displayName: "Visibility", skipStackedTitle: true },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value === "" || sourceTerm.value in wh.source)
    .map((x) => formatTraitRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatTraitRow(trait: Trait) {
  return {
    name: trait.name,
    source: Object.keys(trait.source)
      .map((x) => source[x])
      .join(", "),
    description: trait.description,
    id: trait.id,
    ownerId: trait.ownerId,
    visibility: trait.visibility,
  };
}
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
  <Header title="Creature traits" />
  <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="mb-2 mx-1" />
  <TableWithSearch
    v-model="searchTerm"
    :fields="columns"
    :items="items"
    stackBreakpoint="4xl"
    rowRouteName="trait"
    class="mx-1"
  >
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="trait" :params="{ id: 'create' }">
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
