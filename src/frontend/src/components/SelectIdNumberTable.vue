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

type ItemWithNumber = {
  id: string;
  name: string;
  description: string;
  number: number;
};

const props = defineProps<{
  title: string;
  itemList: { name: string; id: string; description: string }[];
  initItems: Record<string, number>;
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
  (e: "updated", value: { id: string; number: number }): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
}>();

const itemsWithNumber: Ref<Record<string, ItemWithNumber>> = ref({});
const itemsWithNumberList: Ref<ItemWithNumber[]> = ref([]);

watch(
  () => props.initItems,
  (newVal) => {
    updateItemsWithSelect(newVal, props.itemList);
  },
  { immediate: true },
);

watch(
  () => props.itemList,
  (newVal) => {
    updateItemsWithSelect(props.initItems, newVal);
  },
  { immediate: true },
);

function updateItemsWithSelect(
  selectedItems: Set<string>,
  itemList: { name: string; id: string; description: string }[],
) {
  itemsWithNumber.value = {};
  for (const item of itemList) {
    itemsWithNumber.value[item.id] = {
      id: item.id,
      name: addSpaces(item.name),
      description: truncate(addSpaces(item.description), props.truncateModalDescription),
      selected: false,
    };
    if (selectedItems && selectedItems.has(item.id)) {
      itemsWithNumber.value[item.id].selected = true;
    }
  }
  itemsWithNumberList.value = Object.values(itemsWithNumber.value).sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}

const selectedItems = computed(() => itemsWithNumberList.value.filter((x) => x.selected));

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
  itemsWithNumberList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-1">
      <div v-if="title">{{ title }}</div>
      <ActionButton v-if="!disabled" class="btn btn-sm" @click="onModifyClick">Modify</ActionButton>
      <ActionButton v-if="!disabled && clearAllBtn" class="btn btn-danger btn-sm" @click="emit('clearAll')">
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
              <TextLink :routeName="routeName" :params="{ id: src.id }">
                {{ addSpaces(src.name) }}
              </TextLink>
            </td>
            <td v-if="!disableDescription" class="py-2 px-2 border-b border-neutral-300">{{ src.description }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
    </div>
    <ModalWindow :id="modalId">
      <template #header> {{ modalTitle }} </template>
      <template #buttons>
        <ActionButton class="btn" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="itemsWithNumberList"
        :stackedViewSize="ViewSize.sm"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
        elementId="modal"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" :routeName="routeName" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton @click="emit('reload')" />

        <template #name="{ id }: { id: string }">
          <TextLink :routeName="routeName" :params="{ id: id }">
            {{ itemsWithNumber[id].name }}
          </TextLink>
        </template>

        <template #selected="{ id }: { id: string }">
          <div>
            <input
              v-model="itemsWithNumber[id].selected"
              type="checkbox"
              class="w-5 h-5 accent-neutral-600 my-1"
              @input="emit('selected', { id: id, selected: !itemsWithNumber[id].selected })"
            />
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
