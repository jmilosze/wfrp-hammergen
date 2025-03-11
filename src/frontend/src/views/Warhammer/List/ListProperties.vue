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
import { computed } from "vue";
import { ViewSize } from "../../../utils/viewSize.ts";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";
import DeleteModal from "../../../components/DeleteModal.vue";
import { getListOfAllValues, getOptions } from "../../../utils/whList.ts";
import SelectInput from "../../../components/SelectInput.vue";
import { itemTypeList, printItemType } from "../../../services/wh/item.ts";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useQueryParams } from "../../../composables/useQueryParams.ts";
import ToolTip from "../../../components/ToolTip.vue";
import TextLink from "../../../components/TextLink.vue";

const whList = useWhList(new ItemPropertyApi(authRequest));
await whList.loadWhList();

const allItemTypes = getListOfAllValues(itemTypeList);
const allPropertyTypes = getListOfAllValues(itemPropertyTypeList);

const searchTerm = useQueryParams("search");
const sourceTerm = useQueryParams("source", whList.sourceValues);
const applicableToTerm = useQueryParams("applicableTo", allItemTypes);
const typeTerm = useQueryParams("type", allPropertyTypes);

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "tooltip", displayName: "", skipStackedTitle: true },
  { name: "type", displayName: "Type", skipStackedTitle: false },
  { name: "applicableTo", displayName: "Applicable to", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value === "" || sourceTerm.value in wh.source)
    .filter((wh) => typeTerm.value === "" || typeTerm.value === wh.type.toString())
    .filter((wh) => applicableToTerm.value === "" || wh.applicableTo.includes(Number(applicableToTerm.value)))
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
    shared: itemProperty.shared,
    ownerId: itemProperty.ownerId,
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

const userId = auth.getLoggedUserInfo().userId;
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
  <Header title="Qualities and flaws" />
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="typeTerm" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput v-model="applicableToTerm" :options="filteredApplicableToOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch v-model="searchTerm" :fields="columns" :items="items" :stackedViewSize="ViewSize.lg" class="mx-1">
    <LinkButton
      v-if="auth.loggedIn.value"
      class="mr-2 mb-2 shrink-0 btn"
      routeName="property"
      :params="{ id: 'create' }"
    >
      Create new
    </LinkButton>

    <template #name="{ name, id }: { name: string; id: string }">
      <TextLink routeName="property" :params="{ id: id }" :sameWindow="true">{{ name }}</TextLink>
    </template>

    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="property"
        @copy="(copiedId) => whList.copyWh(copiedId, userId)"
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
