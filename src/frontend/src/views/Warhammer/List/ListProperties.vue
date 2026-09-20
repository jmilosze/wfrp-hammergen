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
import { source } from "../../../services/wh/source.ts";
import { computed } from "vue";
import ActionButtonsNonCharacter from "../../../components/ActionButtonsNonCharacter.vue";

import { getOptions } from "../../../utils/whList.ts";
import SelectInput from "../../../components/SelectInput.vue";
import { itemTypeList, printItemType } from "../../../services/wh/item.ts";
import { useAuth } from "../../../composables/auth.ts";
import AlertBlock from "../../../components/AlertBlock.vue";
import LinkButton from "../../../components/LinkButton.vue";
import { useRouteQuery } from "@vueuse/router";
import ToolTip from "../../../components/ToolTip.vue";

const whList = useWhList(new ItemPropertyApi(authRequest));
await whList.loadWhList();

const searchTerm = useRouteQuery("search", "");
const sourceTerm = useRouteQuery("source", "");
const applicableToTerm = useRouteQuery("applicableTo", "");
const typeTerm = useRouteQuery("type", "");

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "type", displayName: "Type", skipStackedTitle: false },
  { name: "applicableTo", displayName: "Applicable to", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "tooltip", displayName: "Visibility", skipStackedTitle: false },
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
    name: itemProperty.name,
    type: printItemPropertyType(itemProperty.type),
    applicableTo: applicableTo,
    source: Object.keys(itemProperty.source)
      .map((x) => source[x])
      .join(", "),
    description: itemProperty.description,
    id: itemProperty.id,
    ownerId: itemProperty.ownerId,
    visibility: itemProperty.visibility,
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
  <Header title="Qualities and flaws" />
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="typeTerm" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput v-model="applicableToTerm" :options="filteredApplicableToOptions" class="grow mb-2 mx-1" />
  </div>
  <TableWithSearch
    v-model="searchTerm"
    :fields="columns"
    :items="items"
    stackBreakpoint="4xl"
    rowRouteName="property"
    class="mx-1"
  >
    <LinkButton
      v-if="auth.loggedIn.value"
      class="mr-2 mb-2 shrink-0 btn"
      routeName="property"
      :params="{ id: 'create' }"
    >
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
