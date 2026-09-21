<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Prayer, PrayerApi } from "../../../services/wh/prayer.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { source } from "../../../services/wh/source.ts";
import { computed } from "vue";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";

import SelectInput from "../../../components/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const whList = useWhList(new PrayerApi(authRequest));
await whList.loadWhList();

const searchTerm = useRouteQuery("search", "");
const sourceTerm = useRouteQuery("source", "");

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "tooltip", displayName: "Visibility", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value === "" || sourceTerm.value in wh.source)
    .map((x) => formatPrayerRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatPrayerRow(prayer: Prayer) {
  return {
    name: prayer.name,
    source: Object.keys(prayer.source)
      .map((x) => source[x])
      .join(", "),
    description: prayer.description,
    id: prayer.id,
    ownerId: prayer.ownerId,
    visibility: prayer.visibility,
  };
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
  <Header title="Prayers" />
  <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="mb-2 mx-1" />
  <TableWithSearch
    v-model="searchTerm"
    :fields="columns"
    :items="items"
    stackBreakpoint="4xl"
    rowRouteName="prayer"
    class="mx-1"
  >
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="prayer" :params="{ id: 'create' }">
      Create new
    </LinkButton>

    <template #actions="{ id }: { id: string }">
      <ActionButtonsNonCharacter
        :id="id"
        @copy="(copiedId) => whList.copyWh(copiedId)"
      />
    </template>

    <template
      #tooltip="{
        ownerId,
        visibility,
      }: {
        ownerId: string;
        visibility?: number;
      }"
    >
      <ToolTip :ownerId="ownerId" :visibility="visibility" />
    </template>
  </TableWithSearch>
</template>

<style scoped></style>
