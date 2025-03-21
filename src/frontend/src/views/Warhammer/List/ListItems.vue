<script setup lang="ts">
import { useWhList } from "../../../composables/whList.ts";
import {
  Item,
  ItemApi,
  ItemType,
  itemTypeList,
  meleeGroupList,
  printItemType,
  printMeleeGroup,
  printRangedGroup,
  rangedGroupList,
  ammoGroupList,
  printAmmoGroup,
  armourGroupList,
  printArmourGroup,
  itemGroupList,
} from "../../../services/wh/item.ts";
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

const whList = useWhList(new ItemApi(authRequest));
await whList.loadWhList();

const allItemTypes = getListOfAllValues(itemTypeList);
const allItemGroups = getListOfAllValues(itemGroupList);

const searchTerm = useQueryParams("search");
const sourceTerm = useQueryParams("source", whList.sourceValues);
const typeTerm = useQueryParams("type", allItemTypes);
const groupTerm = useQueryParams("group", allItemGroups);

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "tooltip", displayName: "", skipStackedTitle: true },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "type", displayName: "Type", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => sourceTerm.value === "" || sourceTerm.value in wh.source)
    .filter((wh) => typeTerm.value === "" || typeTerm.value === wh.type.toString())
    .filter((wh) => groupTerm.value === "" || filterGroup(typeTerm.value, groupTerm.value, wh))
    .map((x) => formatItemRow(x))
    .sort((a, b) => a.name.localeCompare(b.name));
});

function filterGroup(type: string, group: string, wh: Item) {
  if (type === ItemType.Melee.toString() && group === wh.melee.group.toString()) {
    return true;
  }
  if (type === ItemType.Ranged.toString() && group === wh.ranged.group.toString()) {
    return true;
  }
  if (type === ItemType.Ammunition.toString() && group === wh.ammunition.group.toString()) {
    return true;
  }
  return type === ItemType.Armour.toString() && group === wh.armour.group.toString();
}

function formatItemRow(item: Item) {
  return {
    name: addSpaces(item.name),
    type: printItemType(item.type),
    source: Object.keys(item.source)
      .map((x) => source[x])
      .join(", "),
    description: item.description,
    canEdit: item.canEdit,
    id: item.id,
    shared: item.shared,
    ownerId: item.ownerId,
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
  if (typeTerm.value in itemsWithGroups) {
    const anyGroup = { text: "Any group", value: "" };
    switch (typeTerm.value) {
      case ItemType.Melee.toString():
        return [anyGroup, ...meleeGroupList.map((x) => ({ text: printMeleeGroup(x), value: x.toString() }))];
      case ItemType.Ranged.toString():
        return [anyGroup, ...rangedGroupList.map((x) => ({ text: printRangedGroup(x), value: x.toString() }))];
      case ItemType.Ammunition.toString():
        return [anyGroup, ...ammoGroupList.map((x) => ({ text: printAmmoGroup(x), value: x.toString() }))];
      case ItemType.Armour.toString():
        return [anyGroup, ...armourGroupList.map((x) => ({ text: printArmourGroup(x), value: x.toString() }))];
      default:
        return [anyGroup];
    }
  } else {
    return [];
  }
});

watch(
  () => typeTerm.value,
  () => {
    groupTerm.value = "";
  },
);

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
  <Header title="Trappings" />
  <div class="flex flex-wrap justify-between">
    <SelectInput v-model="sourceTerm" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="typeTerm" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput
      v-model="groupTerm"
      :options="filteredGroupOptions"
      :disabled="!(typeTerm in itemsWithGroups)"
      class="grow mb-2 mx-1 w-32"
    />
  </div>
  <TableWithSearch v-model="searchTerm" :fields="columns" :items="items" :stackedViewSize="ViewSize.lg" class="mx-1">
    <LinkButton v-if="auth.loggedIn.value" class="mr-2 mb-2 shrink-0 btn" routeName="item" :params="{ id: 'create' }">
      Create new
    </LinkButton>

    <template #name="{ name, id }: { name: string; id: string }">
      <TextLink routeName="item" :params="{ id: id }" :sameWindow="true">{{ name }}</TextLink>
    </template>

    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="item"
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
