<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Character, CharacterApi } from "../../../services/wh/character.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsCharacter from "../../../components/ActionButtonsCharacter.vue";
import { useRouter } from "vue-router";
import DeleteModal from "../../../components/DeleteModal.vue";
import { queryParamsFromRouterQuery, queryParamsToRouterQuery } from "../../../utils/whList.ts";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import ActionButton from "../../../components/ActionButton.vue";

const whList = useWhList(new CharacterApi(authRequest));
await whList.loadWhList();
const auth = useAuth();

const router = useRouter();
const queryParams = ref({ search: "", source: "", sample: auth.loggedIn.value ? "" : "true" });
queryParamsFromRouterQuery(queryParams.value, router.currentRoute.value.query);
watch(
  () => queryParams,
  (newValue) => {
    router.replace({ query: queryParamsToRouterQuery(newValue.value) });
  },
  { deep: true },
);

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => (queryParams.value.sample === "" ? wh.ownerId !== "admin" : true))
    .map((x) => formatCharacterRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatCharacterRow(character: Character) {
  return {
    name: addSpaces(character.name),
    description: character.description,
    canEdit: character.canEdit,
    id: character.id,
  };
}

function handleSampleCharacters() {
  if (queryParams.value.sample !== "") {
    queryParams.value.sample = "";
  } else {
    queryParams.value.sample = "true";
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
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    class="mx-1"
  >
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0" routeName="character" :params="{ id: 'create' }">
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
