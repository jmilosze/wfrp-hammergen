<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import {
  allSpellLabelList,
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
import { computed, watch } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";
import DeleteModal from "../../../components/DeleteModal.vue";
import { getListOfAllValues, getOptions } from "../../../utils/whList.ts";
import SelectInput from "../../../components/SelectInput.vue";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useQueryParams } from "../../../composables/useQueryParams.ts";
import ToolTip from "../../../components/ToolTip.vue";
import TextLink from "../../../components/TextLink.vue";

const whList = useWhList(new SpellApi(authRequest));
await whList.loadWhList();

const allSpellTypes = getListOfAllValues(spellTypeList);
const allSpellLabels = getListOfAllValues(allSpellLabelList);

const searchTerm = useQueryParams("search");
const sourceTerm = useQueryParams("source", whList.sourceValues);
const typeTerm = useQueryParams("type", allSpellTypes);
const labelTerm = useQueryParams("group", allSpellLabels);

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "tooltip", displayName: "", skipStackedTitle: true },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

watch(
  () => typeTerm.value,
  () => {
    labelTerm.value = "";
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
  if (typeTerm.value === "") {
    return [];
  }

  const sortedLabels = getAllowedLabels(parseInt(typeTerm.value)).sort((a, b) => a - b);
  return [
    { text: "Any label", value: "" },
    { text: "No label", value: "no" },
    ...sortedLabels.map((x) => ({
      text: printSpellLabel(x),
      value: x.toString(),
    })),
  ];
});

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value === "" || sourceTerm.value in wh.source)
    .filter((wh) => typeTerm.value === "" || typeTerm.value === wh.classification.type.toString())
    .filter(
      (wh) =>
        labelTerm.value === "" ||
        (labelTerm.value === "no" && wh.classification.labels.size == 0) ||
        wh.classification.labels.has(parseInt(labelTerm.value)),
    )
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
    shared: spell.shared,
    ownerId: spell.ownerId,
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
    <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="typeTerm" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput
      v-model="labelTerm"
      :options="filteredLabelOptions"
      :disabled="!(typeTerm != '')"
      class="grow mb-2 mx-1 w-32"
    />
  </div>
  <TableWithSearch v-model="searchTerm" :fields="columns" :items="items" :stackedViewSize="ViewSize.lg" class="mx-1">
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="spell" :params="{ id: 'create' }">
      Create new
    </LinkButton>

    <template #name="{ name, id }: { name: string; id: string }">
      <TextLink routeName="spell" :params="{ id: id }" :sameWindow="true">{{ name }}</TextLink>
    </template>

    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="spell"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>

    <template #tooltip="{ shared, canEdit, ownerId }: { shared: boolean; canEdit: boolean; ownerId: string }">
      <ToolTip :shared="shared" :canEdit="canEdit" :ownerId="ownerId" />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
