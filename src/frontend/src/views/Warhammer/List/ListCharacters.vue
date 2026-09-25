<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Character, characterApi } from "../../../services/wh/character.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { computed } from "vue";
import ActionButtonsCharacter from "../../../components/ActionButtonsCharacter.vue";

import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import ActionButton from "../../../components/ActionButton.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";
import { Visibility } from "../../../services/wh/common.ts";

const whList = useWhList(characterApi(authRequest));
await whList.loadWhList();
const auth = useAuth();

const searchTerm = useRouteQuery("search", "");
const showSampleTerm = useRouteQuery("sample", auth.loggedIn.value ? "" : "true");

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "tooltip", displayName: "Visibility", skipStackedTitle: true },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => (showSampleTerm.value === "" ? wh.visibility !== Visibility.Public : true))
    .map((x) => formatCharacterRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatCharacterRow(character: Character) {
  return {
    name: character.name,
    description: character.description,
    id: character.id,
    ownerId: character.ownerId,
    visibility: character.visibility,
  };
}

function handleSampleCharacters() {
  if (showSampleTerm.value !== "") {
    showSampleTerm.value = "";
  } else {
    showSampleTerm.value = "true";
  }
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

  <Header title="Characters">
    <template #nextToHeader>
      <ActionButton class="btn btn-secondary btn-sm" @click="handleSampleCharacters">
        {{ showSampleTerm !== "" ? "Hide sample characters" : "Show sample characters" }}
      </ActionButton>
    </template>
  </Header>
  <TableWithSearch
    v-model="searchTerm"
    :fields="columns"
    :items="items"
    stackBreakpoint="4xl"
    rowRouteName="character"
    class="mx-1"
  >
    <LinkButton
      v-if="auth.loggedIn.value"
      class="mr-2 mb-2 shrink-0 btn"
      routeName="character"
      :params="{ id: 'create' }"
    >
      Create new
    </LinkButton>

    <template #actions="{ id }: { id: string }">
      <ActionButtonsCharacter :id="id" @copy="(copiedId) => whList.copyWh(copiedId)" />
    </template>

    <template #tooltip="{ ownerId, visibility }: { ownerId: string; visibility?: number }">
      <ToolTip :ownerId="ownerId" :visibility="visibility" />
    </template>
  </TableWithSearch>
</template>

<style scoped></style>
