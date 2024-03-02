<script setup lang="ts">
import { useWhListUtils } from "../../../composables/whList.ts";
import { Character, CharacterApi } from "../../../services/wh/character.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { TableRow } from "../../../utils/table.ts";
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsCharacter from "../../../components/ListWh/ActionButtonsCharacter.vue";
import { useRouter } from "vue-router";
import DeleteModal from "../../../components/ListWh/DeleteModal.vue";
import { queryParamsFromRouterQuery, queryParamsToRouterQuery } from "../../../utils/whList.ts";
import { useAuth } from "../../../composables/auth.ts";

const whList = useWhListUtils(new CharacterApi(authRequest));
await whList.loadWhList();

const router = useRouter();
const queryParams = ref({ search: "", source: "" });
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
  { name: "name", displayName: "Name" },
  { name: "description", displayName: "Description" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .map((x) => formatCharacterRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatCharacterRow(character: Character): TableRow {
  return {
    name: addSpaces(character.name),
    description: character.description,
    canEdit: character.canEdit,
    id: character.id,
  };
}
</script>

<template>
  <Header title="Characters" />
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="auth.loggedIn.value"
    class="mx-1"
    @createNew="router.push({ name: 'character', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtonsCharacter
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
        @edit="router.push({ name: 'character', params: { id: id } })"
        @view="router.push({ name: 'viewCharacter', params: { id: id } })"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
