<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import { useModal } from "../composables/modal.ts";

type itemWithSelect = {
  id: string;
  name: string;
  description: string;
  selected: boolean;
};

const props = defineProps<{
  disabled?: boolean;
  title?: string;
  itemList: { name: string; id: string; description: string }[];
  initSelectedItems: Set<string>;
}>();

const itemsWithSelect: Ref<Record<string, itemWithSelect>> = ref({});
const itemsWithSelectList: Ref<itemWithSelect[]> = ref([]);

watch(
  () => props.initSelectedItems,
  (newVal) => {
    updateItemsWithSelect(newVal, props.itemList);
  },
  { immediate: true },
);

watch(
  () => props.itemList,
  (newVal) => {
    updateItemsWithSelect(props.initSelectedItems, newVal);
  },
  { immediate: true },
);

function updateItemsWithSelect(
  selectedItems: Set<string>,
  itemList: { name: string; id: string; description: string }[],
) {
  itemsWithSelect.value = {};
  for (const item of itemList) {
    itemsWithSelect.value[item.id] = { ...item, selected: false };
    if (selectedItems && selectedItems.has(item.id)) {
      itemsWithSelect.value[item.id].selected = true;
    }
  }
  itemsWithSelectList.value = Object.values(itemsWithSelect.value).sort((a, b) => a.name.localeCompare(b.name));
}

const selectedItems = computed(() => itemsWithSelectList.value.filter((x) => x.selected));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name" },
  { name: "description", displayName: "Description" },
  { name: "selected", displayName: "Select" },
];

function onModifyClick() {
  modal.showModal("modifyItemsModal");
  searchTerm.value = "";
  itemsWithSelectList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center" :class="disabled ? 'mb-1' : 'mb-2'">
      <div v-if="title" class="mr-2">{{ title }}</div>
      <ActionButton v-if="!disabled" size="sm" @click="onModifyClick">Modify</ActionButton>
    </div>
    <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-5">Name</th>
            <th class="border-b border-neutral-300 py-2 px-5">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedItems" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.name }}</td>
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.description }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
    <ModalWindow id="modifyItemsModal">
      <template #header> Modify stuff </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <div class="">
        <TableWithSearch
          v-model="searchTerm"
          :fields="modalColumns"
          :items="itemsWithSelectList"
          :stackedViewSize="ViewSize.sm"
          :addCreateNewBtn="true"
          :addReloadBtn="true"
          elementId="modal"
        >
          <template #selected="{ id }: { id: string }">
            <div>
              <input v-model="itemsWithSelect[id].selected" type="checkbox" class="w-5 h-5 accent-neutral-600" />
            </div>
          </template>
        </TableWithSearch>
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
