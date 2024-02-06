<script setup lang="ts">
import { useWhListUtils } from "../../composables/whListUtils.ts";
import { PrayerApi } from "../../services/wh/prayer.ts";
import { authRequest } from "../../services/auth.ts";
import TableWithSearch from "../../components/TableWithSearch.vue";
import Header from "../../components/PageHeader.vue";

const whListUtils = useWhListUtils(new PrayerApi(authRequest));
const columns = [
  { name: "col1", displayName: "Column One" },
  { name: "col2", displayName: "Column Two" },
  { name: "col3", displayName: "Column Three" },
  { name: "col4", displayName: "Column Four" },
];

const items = [{ col1: 11, col2: "Hello you!", col3: 13, col4: 14 }, { col1: 21, col3: 23, col4: 24 }, { col1: 31 }];

await whListUtils.loadWhList();
for (const prayer of whListUtils.whList.value.values()) {
  console.log(JSON.stringify(prayer));
}
</script>

<template>
  <Header title="Prayers"> </Header>
  <TableWithSearch :fields="columns" :items="items"></TableWithSearch>
</template>

<style scoped></style>
