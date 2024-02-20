<script setup lang="ts">
import { useWhListUtils } from "../../composables/whList.ts";
import { Prayer, PrayerApi } from "../../services/wh/prayer.ts";
import { authRequest } from "../../services/auth.ts";
import TableWithSearch from "../../components/TableWithSearch.vue";
import Header from "../../components/PageHeader.vue";
import { addSpaces } from "../../utils/string.ts";
import { source } from "../../services/wh/source.ts";
import { TableRow } from "../../utils/table.ts";
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../utils/viewSize.ts";
import ActionButtons from "../../components/ListWh/ActionButtons.vue";
import { useRouter } from "vue-router";
import { hasValue } from "../../utils/other.ts";
import { useAuthStore } from "../../stores/auth.ts";
import DeleteModal from "../../components/ListWh/DeleteModal.vue";

const MAX_CHARS = 15;
const PER_PAGE = 25;

interface PrayerRow extends TableRow {
  name: string;
  source: string;
  description: string;
  canEdit: boolean;
  id: string;
}

const whList = useWhListUtils(new PrayerApi(authRequest));
await whList.loadWhList();

const elementToDelete = ref({ id: "", name: "" });

const router = useRouter();
const searchTerm = ref(
  hasValue(router.currentRoute.value.query.search) ? (router.currentRoute.value.query.search as string) : "",
);
watch(searchTerm, (newValue) => {
  const newParams = newValue !== "" ? { search: newValue } : ({} as Record<string, string>);
  router.replace({ query: newParams });
});

const authStore = useAuthStore();

const columns = [
  { name: "name", displayName: "Name" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value.map((x) => formatPrayerRow(x)).sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatPrayerRow(prayer: Prayer): PrayerRow {
  return {
    name: addSpaces(prayer.name, MAX_CHARS),
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
  <Header title="Prayers"> </Header>
  <TableWithSearch
    v-model="searchTerm"
    :fields="columns"
    :items="items"
    :perPage="PER_PAGE"
    :stackedViewSize="ViewSize.md"
    :createNew="authStore.loggedIn"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtons
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="elementToDelete = { name: name, id: id }"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="elementToDelete" @deleteConfirmed="whList.deleteWh(elementToDelete.id)" />
</template>

<style scoped></style>
