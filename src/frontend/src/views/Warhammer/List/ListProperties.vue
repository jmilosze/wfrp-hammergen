<script setup lang="ts">
import { useWhListUtils } from "../../../composables/whList.ts";
import {
  ItemProperty,
  ItemPropertyApi,
  itemPropertyTypeList,
  printItemPropertyType,
} from "../../../services/wh/itemproperty.ts";
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
import { itemTypeList, printItemType } from "../../../services/wh/item.ts";

const whList = useWhListUtils(new ItemPropertyApi(authRequest));
await whList.loadWhList();

const router = useRouter();
const queryParams = ref({ search: "", source: "", type: "", applicableTo: "" });
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
  { name: "applicableTo", displayName: "Applicable to" },
  { name: "description", displayName: "Description" },
  { name: "source", displayName: "Source" },
  { name: "actions", displayName: "Actions" },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.type === "" || queryParams.value.type === wh.type.toString())
    .filter(
      (wh) => queryParams.value.applicableTo === "" || wh.applicableTo.includes(Number(queryParams.value.applicableTo)),
    )
    .map((x) => formatItemPropertyRow(x))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
});

function formatItemPropertyRow(itemProperty: ItemProperty): TableRow {
  let applicableTo: string;
  if (itemProperty.applicableTo.length === itemTypeList.length) {
    applicableTo = "All";
  } else {
    applicableTo = itemProperty.applicableTo.map((x) => printItemType(x)).join(", ");
  }

  return {
    name: addSpaces(itemProperty.name),
    type: printItemPropertyType(itemProperty.type),
    applicableTo: applicableTo,
    source: Object.keys(itemProperty.source)
      .map((x) => source[x])
      .join(", "),
    description: itemProperty.description,
    canEdit: itemProperty.canEdit,
    id: itemProperty.id,
  };
}

const filteredTypeOptions = computed(() => {
  return getOptions(
    itemPropertyTypeList,
    whList.whList.value.map((wh) => wh.type),
    printItemPropertyType,
    "Any type",
  );
});

const filteredApplicableToOptions = computed(() => {
  return getOptions(
    itemTypeList,
    whList.whList.value.map((wh) => wh.applicableTo).flat(),
    printItemType,
    "Applicable to any",
  );
});
</script>

<template>
  <Header title="Qualities and Runes"> </Header>
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.type" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.applicableTo" :options="filteredApplicableToOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="authStore.loggedIn"
    class="mx-1"
    @createNew="router.push({ name: 'itemProperty', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }">
      <ActionButtons
        :id="id"
        :canEdit="canEdit"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
        @edit="router.push({ name: 'property', params: { id: id } })"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
