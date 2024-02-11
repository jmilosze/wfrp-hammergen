<script setup lang="ts">
import { useWhListUtils } from "../../composables/whListUtils.ts";
import { Prayer, PrayerApi } from "../../services/wh/prayer.ts";
import { authRequest } from "../../services/auth.ts";
import TableWithSearch from "../../components/TableWithSearch.vue";
import Header from "../../components/PageHeader.vue";
import { addSpaces } from "../../utils/stringUtils.ts";
import { source } from "../../services/wh/source.ts";
import { TableRow } from "../../utils/tableUtils.ts";
import { computed, ref } from "vue";
import { useElementSize } from "@vueuse/core";
import { ViewSize } from "../../composables/screen.ts";

const MAX_CHARS = 15;
const PER_PAGE = 1;

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
const { width } = useElementSize(el);
const stackTable = ref({ previousWidth: width.value, stack: false });

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
    width: {{ width }}
    <Header title="Prayers"> </Header>
    <TableWithSearch
      :fields="columns"
      :items="items"
      :perPage="PER_PAGE"
      :stacked="width < ViewSize.md"
    ></TableWithSearch>
  </div>
</template>

<style scoped></style>
