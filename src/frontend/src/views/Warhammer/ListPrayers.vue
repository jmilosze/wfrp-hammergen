<script setup lang="ts">
import { useWhListUtils } from "../../composables/whListUtils.ts";
import { Prayer, PrayerApi } from "../../services/wh/prayer.ts";
import { authRequest } from "../../services/auth.ts";
import TableWithSearch from "../../components/TableWithSearch.vue";
import Header from "../../components/PageHeader.vue";
import { addSpaces } from "../../utils/stringUtils.ts";
import { printSourceBook } from "../../services/wh/source.ts";
import { TableRow } from "../../utils/tableUtils.ts";

const MAX_CHARS = 15;

interface PrayerRow extends TableRow {
  name: string;
  source: string;
  description: string;
  canEdit: boolean;
  id: string;
}

const whListUtils = useWhListUtils(new PrayerApi(authRequest));
await whListUtils.loadWhList();

const columns = [
  { name: "name", displayName: "Name" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

function formatPrayerRow(prayer: Prayer): PrayerRow {
  return {
    name: addSpaces(prayer.name, MAX_CHARS),
    source: Object.entries(prayer.source)
      .map((x) => printSourceBook(x[1]))
      .join(", "),
    description: prayer.description,
    canEdit: prayer.canEdit,
    id: prayer.id,
  };
}

const items = whListUtils.whList.value.map((x) => formatPrayerRow(x));
</script>

<template>
  <Header title="Prayers"> </Header>
  <TableWithSearch :fields="columns" :items="items" :perPage="100"></TableWithSearch>
</template>

<style scoped></style>
