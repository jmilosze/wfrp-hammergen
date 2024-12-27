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

const whList = useWhList(new CharacterApi(authRequest));
await whList.loadWhList();
const auth = useAuth();

const searchTerm = useQueryParams("search");
const showSampleTerm = useQueryParams("sample");
showSampleTerm.value = auth.loggedIn.value ? "" : "true";

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
  // { name: "state", displayName: "State", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => (showSampleTerm.value === "" ? wh.ownerId !== "admin" : true))
    .map((x) => formatCharacterRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatCharacterRow(character: Character) {
  const tooltip = character.shared ? "This character is shared" : "This character is not shared";

  return {
    name: addSpaces(character.name),
    description: character.description,
    canEdit: character.canEdit,
    id: character.id,

    // state: {
    //   data: "dt",
    //   icons: [
    //     {
    //       tile: "long",
    //       content:
    //         "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat",
    //     },
    //     { tile: "🙂", content: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus" },
    //     { tile: "🙂", content: "です" },
    //   ],
    // },
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
    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsCharacter
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
