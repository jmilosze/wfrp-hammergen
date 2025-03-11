<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Character, CharacterApi } from "../../../services/wh/character.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { computed } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsCharacter from "../../../components/ActionButtonsCharacter.vue";
import DeleteModal from "../../../components/DeleteModal.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import ActionButton from "../../../components/ActionButton.vue";
import { useQueryParams } from "../../../composables/useQueryParams.ts";
import ToolTip from "../../../components/ToolTip.vue";
import TextLink from "../../../components/TextLink.vue";

const whList = useWhList(new CharacterApi(authRequest));
await whList.loadWhList();
const auth = useAuth();

const searchTerm = useQueryParams("search");
const showSampleTerm = useQueryParams("sample");
showSampleTerm.value = auth.loggedIn.value ? "" : "true";

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "tooltip", displayName: "", skipStackedTitle: true },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => (showSampleTerm.value === "" ? wh.ownerId !== "admin" : true))
    .map((x) => formatCharacterRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatCharacterRow(character: Character) {
  return {
    name: addSpaces(character.name),
    description: character.description,
    canEdit: character.canEdit,
    id: character.id,
    shared: character.shared,
    ownerId: character.ownerId,
  };
}

function handleSampleCharacters() {
  if (showSampleTerm.value !== "") {
    showSampleTerm.value = "";
  } else {
    showSampleTerm.value = "true";
  }
}

const userId = auth.getLoggedUserInfo().userId;
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
        Show sample characters
      </ActionButton>
    </template>
  </Header>
  <TableWithSearch v-model="searchTerm" :fields="columns" :items="items" :stackedViewSize="ViewSize.lg" class="mx-1">
    <LinkButton
      v-if="auth.loggedIn.value"
      class="mr-2 mb-2 shrink-0 btn"
      routeName="character"
      :params="{ id: 'create' }"
    >
      Create new
    </LinkButton>

    <template #name="{ name, id }: { name: string; id: string }">
      <TextLink routeName="character" :params="{ id: id }" :sameWindow="true">{{ name }}</TextLink>
    </template>

    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsCharacter
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId, userId)"
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
