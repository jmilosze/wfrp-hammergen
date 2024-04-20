<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
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
import { computed, ref, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";
import { useRouter } from "vue-router";
import DeleteModal from "../../../components/DeleteModal.vue";
import { getOptions, queryParamsFromRouterQuery, queryParamsToRouterQuery } from "../../../utils/whList.ts";
import SelectInput from "../../../components/SelectInput.vue";
import { itemTypeList, printItemType } from "../../../services/wh/item.ts";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";

const whList = useWhList(new ItemPropertyApi(authRequest));
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

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "type", displayName: "Type", skipStackedTitle: false },
  { name: "applicableTo", displayName: "Applicable to", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.type === "" || queryParams.value.type === wh.type.toString())
    .filter(
      (wh) => queryParams.value.applicableTo === "" || wh.applicableTo.includes(Number(queryParams.value.applicableTo)),
    )
    .map((x) => formatItemPropertyRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatItemPropertyRow(itemProperty: ItemProperty) {
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
  <AlertBlock
    v-if="whList.apiError.value && whList.showApiError.value"
    alertType="red"
    :centered="true"
    @close="whList.showApiError.value = false"
  >
    {{ whList.apiError.value }}
  </AlertBlock>
  <Header title="Qualities and Runes" />
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
    :addCreateNewBtn="auth.loggedIn.value"
    class="mx-1"
    @createNew="router.push({ name: 'property', params: { id: 'create' } })"
  >
    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
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
