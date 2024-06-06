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
} from "../../../services/wh/item.ts";
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

const whList = useWhList(new ItemApi(authRequest));
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

const auth = useAuth();

const columns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "type", displayName: "Type", skipStackedTitle: false },
  { name: "source", displayName: "Source", skipStackedTitle: false },
  { name: "actions", displayName: "Actions", skipStackedTitle: true },
];

const items = computed(() => {
  return whList.whList.value
    .filter((wh) => queryParams.value.source === "" || queryParams.value.source in wh.source)
    .filter((wh) => queryParams.value.type === "" || queryParams.value.type === wh.type.toString())
    .filter((wh) => queryParams.value.group === "" || filterGroup(queryParams.value.type, queryParams.value.group, wh))
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
    const anyGroup = { text: "Any group", value: "" };
    switch (queryParams.value.type) {
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
  () => queryParams.value.type,
  () => {
    queryParams.value.group = "";
  },
);
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
    <SelectInput v-model="queryParams.source" :options="whList.filteredSourceOptions.value" class="grow mb-2 mx-1" />
    <SelectInput v-model="queryParams.type" :options="filteredTypeOptions" class="grow mb-2 mx-1" />
    <SelectInput
      v-model="queryParams.group"
      :options="filteredGroupOptions"
      :disabled="!(queryParams.type in itemsWithGroups)"
      class="grow mb-2 mx-1 w-32"
    />
  </div>
  <TableWithSearch
    v-model="queryParams.search"
    :fields="columns"
    :items="items"
    :stackedViewSize="ViewSize.lg"
    :addCreateNewBtn="auth.loggedIn.value"
    class="mx-1"
    routeName="item"
  >
    <template #actions="{ name, id, canEdit }: { name: string; id: string; canEdit: boolean }">
      <ActionButtonsNonCharacter
        :id="id"
        :canEdit="canEdit"
        routeName="item"
        @copy="(copiedId) => whList.copyWh(copiedId)"
        @delete="whList.whToDelete.value = { name: name, id: id }"
      />
    </template>
  </TableWithSearch>

  <DeleteModal :elementToDelete="whList.whToDelete.value" @deleteConfirmed="whList.deleteWh()" />
</template>

<style scoped></style>
