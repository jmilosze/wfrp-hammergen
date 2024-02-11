<script setup lang="ts">
import { useWhListUtils } from "../../composables/whListUtils.ts";
import { Prayer, PrayerApi } from "../../services/wh/prayer.ts";
import { authRequest } from "../../services/auth.ts";
import TableWithSearch from "../../components/TableWithSearch.vue";
import Header from "../../components/PageHeader.vue";
import { addSpaces } from "../../utils/stringUtils.ts";
import { source } from "../../services/wh/source.ts";
import { TableRow } from "../../utils/tableUtils.ts";
import { ref } from "vue";
import { useElementSize } from "@vueuse/core";
import { useScreen, ViewSize } from "../../composables/screen.ts";

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

const el = ref(null);
const elementSize = useElementSize(el);
const { scrollWidth } = useScreen();

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

const items = whListUtils.whList.value.map((x) => formatPrayerRow(x));
</script>

<template>
  <div ref="el">
    ElementWidth: {{ elementSize.width }} ScrollBarWidth: {{ scrollWidth }}
    <Header title="Prayers"> </Header>
    <TableWithSearch
      :fields="columns"
      :items="items"
      :perPage="PER_PAGE"
      :stacked="elementSize.width.value + scrollWidth < ViewSize.md"
    ></TableWithSearch>
  </div>
</template>

<style scoped></style>
