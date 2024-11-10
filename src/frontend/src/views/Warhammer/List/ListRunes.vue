<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import { Rune, RuneApi } from "../../../services/wh/rune.ts";
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
import LinkButton from "../../../components/LinkButton.vue";

const whList = useWhList(new RuneApi(authRequest));
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
    .filter(
      (wh) => queryParams.value.applicableTo === "" || wh.applicableTo.includes(Number(queryParams.value.applicableTo)),
    )
    .map((x) => formatRuneRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatRuneRow(itemProperty: Rune) {
  let applicableTo: string;
  if (itemProperty.applicableTo.length === itemTypeList.length) {
    applicableTo = "All";
  } else {
    applicableTo = itemProperty.applicableTo.map((x) => printItemType(x)).join(", ");
  }

  return {
    name: addSpaces(itemProperty.name),
    applicableTo: applicableTo,
    source: Object.keys(itemProperty.source)
      .map((x) => source[x])
      .join(", "),
    description: itemProperty.description,
    canEdit: itemProperty.canEdit,
    id: itemProperty.id,
  };
}

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
    <SelectInput v-model="queryParams.applicableTo" :options="filteredApplicableToOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    class="mx-1"
  >
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="rune" :params="{ id: 'create' }">
      Create new
    </LinkButton>
    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="rune"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
