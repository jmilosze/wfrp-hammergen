<script setup lang="ts">
import { useWhListUtils } from "../../../composables/whList.ts";
import { Item, ItemApi, ItemType, itemTypeList, printItemType } from "../../../services/wh/item.ts";
import { authRequest } from "../../../services/auth.ts";
import TableWithSearch from "../../../components/TableWithSearch.vue";
import Header from "../../../components/PageHeader.vue";
import { addSpaces } from "../../../utils/string.ts";
import { source } from "../../../services/wh/source.ts";
import { TableRow } from "../../../utils/table.ts";
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtons from "../../../components/ListWh/ActionButtons.vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../../stores/auth.ts";
import DeleteModal from "../../../components/ListWh/DeleteModal.vue";
import { getOptions, queryParamsFromRouterQuery, queryParamsToRouterQuery } from "../../../utils/whList.ts";
import SelectInput from "../../../components/ListWh/SelectInput.vue";

const whList = useWhListUtils(new ItemApi(authRequest));
await whList.loadWhList();

const router = useRouter();
const queryParams = ref({ search: "", source: "", type: "", group: "" });
queryParamsFromRouterQuery(queryParams.value, router.currentRoute.value.query);
watch(
  () => queryParams,
  (newValue) => {
    router.replace({ query: queryParamsToRouterQuery(newValue.value) });
  },
  { deep: true },
);

const authStore = useAuthStore();

const columns = [
  { name: "name", displayName: "Name" },
  { name: "type", displayName: "Type" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.type === "" || queryParams.value.type === wh.type.toString())
    .map((x) => formatItemRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatItemRow(item: Item): TableRow {
  return {
    name: addSpaces(item.name),
    type: printItemType(item.type),
    source: Object.keys(item.source)
      .map((x) => source[x])
      .join(", "),
    description: item.description,
    canEdit: item.canEdit,
    id: item.id,
  };
}

const filteredTypeOptions = computed(() => {
  return getOptions(
    itemTypeList,
    whList.whList.value.map((wh) => wh.type),
    printItemType,
    "Any type",
  );
});

const itemsWithGroups: string[] = [
  ItemType.Melee.toString(),
  ItemType.Ranged.toString(),
  ItemType.Ammunition.toString(),
  ItemType.Armour.toString(),
];

const filteredGroupOptions = computed(() => {
  if (queryParams.value.type in itemsWithGroups) {
    return [{ text: "Any group", value: "" }];
  } else {
    return [];
  }
});
</script>

<template>
  <Header title="Trappings"> </Header>
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.type" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput
      v-model="queryParams.group"
      :options="filteredGroupOptions"
      :disabled="true"
      class="grow mb-2 mx-1 w-10"
    />
  </div>
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="authStore.loggedIn"
    class="mx-1"
    @createNew="router.push({ name: 'item', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtons
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
        @edit="router.push({ name: 'item', params: { id: id } })"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
