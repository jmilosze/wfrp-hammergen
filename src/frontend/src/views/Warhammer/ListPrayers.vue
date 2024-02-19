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
import { useElSize } from "../../composables/viewSize.ts";
import { ViewSize } from "../../utils/viewSize.ts";
import ListWhButtons from "../../components/ListWhButtons.vue";
import ModalWindow from "../../components/ModalWindow.vue";
import { useModal } from "../../composables/modal.ts";
import ActionButton from "../../components/ActionButton.vue";
import { useRouter } from "vue-router";
import { hasValue } from "../../utils/other.ts";

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

const modal = useModal();

const el = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, el);
const elementToDelete = ref({ id: "", name: "" });
const router = useRouter();
const searchTerm = ref(
  hasValue(router.currentRoute.value.query.search) ? (router.currentRoute.value.query.search as string) : "",
);

watch(searchTerm, (newValue) => {
  const newParams = newValue !== "" ? { search: newValue } : {};
  router.replace({ query: newParams });
});

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

function deleteElementModal(id: string, name: string) {
  modal.showModal("deleteModal");
  elementToDelete.value = { name: name, id: id };
}

function deleteElement() {
  whList.deleteWh(elementToDelete.value.id);
  modal.hideModal();
}
</script>

<template>
  <div ref="el">
    <Header title="Prayers"> </Header>
    <TableWithSearch
      v-model="searchTerm"
      :fields="columns"
      :items="items"
      :perPage="PER_PAGE"
      :stacked="!isEqualOrGreater"
    >
      <template #actions="{ name, id, canEdit }">
        <ListWhButtons
          :id="id"
          :canEdit="canEdit"
          @copy="(copiedId) => whList.copyWh(copiedId)"
          @delete="deleteElementModal(id, name)"
        />
      </template>
    </TableWithSearch>
  </div>
  <ModalWindow id="deleteModal">
    <template #header> Delete Prayer </template>
    <template #buttons>
      <ActionButton variant="danger" @click="deleteElement()">Delete</ActionButton>
      <ActionButton variant="normal" class="ml-3" @click="modal.hideModal()">Cancel</ActionButton>
    </template>
    <div>
      Are you sure you want to delete <span class="font-semibold">{{ elementToDelete.name }}?</span>
    </div>
  </ModalWindow>
</template>

<style scoped></style>
