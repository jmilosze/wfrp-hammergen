<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import { ViewSize } from "../utils/viewSize.ts";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import { useModal } from "../composables/modal.ts";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { addSpaces, truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import LinkButton from "./LinkButton.vue";
import ReloadButton from "./ReloadButton.vue";

type ItemWithSelect = {
  id: string;
  name: string;
  description: string;
  selected: boolean;
};

const props = defineProps<{
  title: string;
  itemList: { name: string; id: string; description: string }[];
  initSelectedItems: Set<string>;
  routeName: string;
  disabled?: boolean;
  modalTitle?: string;
  loading?: boolean;
  modalId?: string;
  clearAllBtn?: boolean;
  disableDescription?: boolean;
  truncateModalDescription?: number;
}>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; selected: boolean }): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
}>();

const itemsWithSelect: Ref<Record<string, ItemWithSelect>> = ref({});
const itemsWithSelectList: Ref<ItemWithSelect[]> = ref([]);

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
    itemsWithSelect.value[item.id] = {
      id: item.id,
      name: addSpaces(item.name),
      description: truncate(addSpaces(item.description), props.truncateModalDescription),
      selected: false,
    };
    if (selectedItems && selectedItems.has(item.id)) {
      itemsWithSelect.value[item.id].selected = true;
    }
  }
  itemsWithSelectList.value = Object.values(itemsWithSelect.value).sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}

const selectedItems = computed(() => itemsWithSelectList.value.filter((x) => x.selected));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "selected", displayName: "Select", skipStackedTitle: false },
];

const modalId = props.modalId ? props.modalId : "modifyItemsModal";

const resetPaginationCounter = ref(0);

function onModifyClick() {
  resetPaginationCounter.value += 1;
  modal.showModal(modalId);
  searchTerm.value = "";
  itemsWithSelectList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-1">
      <div v-if="title">{{ title }}</div>
      <ActionButton v-if="!disabled" size="sm" @click="onModifyClick">Modify</ActionButton>
      <ActionButton v-if="!disabled && clearAllBtn" size="sm" variant="red" @click="emit('clearAll')">
        Clear all
      </ActionButton>
    </div>
    <div v-if="props.loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-2">Name</th>
            <th v-if="!disableDescription" class="border-b border-neutral-300 py-2 px-2">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedItems" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-2 border-b border-neutral-300">
              <TextLink :routeName="routeName" :params="{ id: src.id }" :noColour="true">
                {{ addSpaces(src.name) }}
              </TextLink>
            </td>
            <td v-if="!disableDescription" class="py-2 px-2 border-b border-neutral-300">{{ src.description }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
    <ModalWindow :id="modalId">
      <template #header> {{ modalTitle }} </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="itemsWithSelectList"
        :stackedViewSize="ViewSize.sm"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
        elementId="modal"
      >
        <LinkButton class="mr-2 mb-2 shrink-0" :routeName="routeName" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton @click="emit('reload')" />

        <template #name="{ id }: { id: string }">
          <TextLink :routeName="routeName" :params="{ id: id }">
            {{ itemsWithSelect[id].name }}
          </TextLink>
        </template>

        <template #selected="{ id }: { id: string }">
          <div>
            <input
              v-model="itemsWithSelect[id].selected"
              type="checkbox"
              class="w-5 h-5 accent-neutral-600 my-1"
              @input="emit('selected', { id: id, selected: !itemsWithSelect[id].selected })"
            />
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
