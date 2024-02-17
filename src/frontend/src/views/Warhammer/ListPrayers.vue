<script setup lang="ts">
import { useWhListUtils } from "../../composables/whListUtils.ts";
import { Prayer, PrayerApi } from "../../services/wh/prayer.ts";
import { authRequest } from "../../services/auth.ts";
import TableWithSearch from "../../components/TableWithSearch.vue";
import Header from "../../components/PageHeader.vue";
import { addSpaces } from "../../utils/string.ts";
import { source } from "../../services/wh/source.ts";
import { TableRow } from "../../utils/table.ts";
import { computed, ref } from "vue";
import { useElSize } from "../../composables/sizeUtils.ts";
import { ViewSize } from "../../utils/viewSize.ts";
import ListWhButtons from "../../components/ListWhButtons.vue";
import ModalWindow from "../../components/ModalWindow.vue";
import { useModal } from "../../composables/modal.ts";

const MAX_CHARS = 15;
const PER_PAGE = 25;

interface PrayerRow extends TableRow {
  name: string;
  source: string;
  description: string;
  canEdit: boolean;
  id: string;
}

const whListUtils = useWhListUtils(new PrayerApi(authRequest));
await whListUtils.loadWhList();

const modal = useModal();

const el = ref(null);
const { isEqualOrGreater } = useElSize(ViewSize.md, el);

const columns = [
  { name: "name", displayName: "Name" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

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

const items = computed(() => {
  return whListUtils.whList.value.map((x) => formatPrayerRow(x)).sort((a, b) => (a.name > b.name ? 1 : -1));
});
</script>

<template>
  <div ref="el">
    <Header title="Prayers"> </Header>
    <TableWithSearch :fields="columns" :items="items" :perPage="PER_PAGE" :stacked="!isEqualOrGreater">
      <template #actions="{ canEdit, id }">
        <ListWhButtons
          :id="id"
          :canEdit="canEdit"
          @copy="(copiedId) => whListUtils.copyWh(copiedId)"
          @delete="modal.showModal()"
        />
      </template>
    </TableWithSearch>
  </div>
  <ModalWindow></ModalWindow>
</template>

<style scoped></style>
