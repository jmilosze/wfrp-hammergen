<script setup lang="ts">
import { useWhListUtils } from "../../../composables/whList.ts";
import { Prayer, PrayerApi } from "../../../services/wh/prayer.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { source } from "../../../services/wh/source.ts";
import { TableRow } from "../../../utils/table.ts";
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ListWh/ActionButtonsNonCharacter.vue";
import { useRouter } from "vue-router";
import DeleteModal from "../../../components/ListWh/DeleteModal.vue";
import { queryParamsFromRouterQuery, queryParamsToRouterQuery } from "../../../utils/whList.ts";
import SelectInput from "../../../components/ListWh/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";

const whList = useWhListUtils(new PrayerApi(authRequest));
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
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .map((x) => formatPrayerRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatPrayerRow(prayer: Prayer): TableRow {
  return {
    name: addSpaces(prayer.name),
    source: Object.keys(prayer.source)
      .map((x) => source[x])
      .join(", "),
    description: prayer.description,
    canEdit: prayer.canEdit,
    id: prayer.id,
  };
}
</script>

<template>
  <Header title="Prayers" />
  <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" class="mb-2 mx-1" />
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="auth.loggedIn.value"
    class="mx-1"
    @createNew="router.push({ name: 'prayer', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
        @edit="router.push({ name: 'prayer', params: { id: id } })"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
