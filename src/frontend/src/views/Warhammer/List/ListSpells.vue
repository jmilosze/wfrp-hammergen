<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import {
  getAllowedLabels,
  getSimplifiedLabels,
  printSpellLabel,
  printSpellType,
  Spell,
  SpellApi,
  spellTypeList,
} from "../../../services/wh/spell.ts";
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
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";

const whList = useWhList(new SpellApi(authRequest));
await whList.loadWhList();

const router = useRouter();
const queryParams = ref({ search: "", source: "", type: "", label: "" });

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

queryParamsFromRouterQuery(queryParams.value, router.currentRoute.value.query);
watch(
  () => queryParams,
  (newValue) => {
    router.replace({ query: queryParamsToRouterQuery(newValue.value) });
  },
  { deep: true },
);

watch(
  () => queryParams.value.type,
  () => {
    queryParams.value.label = "";
  },
);

const filteredTypeOptions = computed(() => {
  return getOptions(
    spellTypeList,
    whList.whList.value.map((wh) => wh.classification.type),
    printSpellType,
    "Any type",
  );
});

const filteredLabelOptions = computed(() => {
  if (queryParams.value.type === "") {
    return [];
  }

  const anyGroup = { text: "Any label", value: "" };
  const sortedLabels = getAllowedLabels(parseInt(queryParams.value.type)).sort((a, b) => a - b);
  return [
    anyGroup,
    ...sortedLabels.map((x) => ({
      text: printSpellLabel(x),
      value: x.toString(),
    })),
  ];
});

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.type === "" || queryParams.value.type === wh.classification.type.toString())
    .filter((wh) => queryParams.value.label === "" || wh.classification.labels.has(parseInt(queryParams.value.label)))
    .map((x) => formatSpellRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function formatSpellRow(spell: Spell) {
  const simplifiedLabels = [...getSimplifiedLabels(spell.classification.type, spell.classification.labels)]
    .sort((a, b) => b - a)
    .map((x) => printSpellLabel(x));

  simplifiedLabels.unshift(printSpellType(spell.classification.type));

  return {
    name: addSpaces(spell.name),
    source: Object.keys(spell.source)
      .map((x) => source[x])
      .join(", "),
    description: simplifiedLabels.join(", ") + ". " + spell.description,
    canEdit: spell.canEdit,
    id: spell.id,
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
  <Header title="Spells" />
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.type" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput
      v-model="queryParams.label"
      :options="filteredLabelOptions"
      :disabled="!(queryParams.type != '')"
      class="grow mb-2 mx-1 w-32"
    />
  </div>
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="auth.loggedIn.value"
    routeName="spell"
    class="mx-1"
  >
    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="spell"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
