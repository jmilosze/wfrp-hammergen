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
import FormInput from "./FormInput.vue";
import { ValidationStatus } from "../utils/validation.ts";

type ItemWithNumber = {
  id: string;
  name: string;
  description: string;
  number: number;
};

const props = defineProps<{
  title: string;
  allItemList: { name: string; id: string; description: string }[];
  initItems: Record<string, number>;
  routeName: string;
  disabled?: boolean;
  modalTitle?: string;
  loading?: boolean;
  clearAllBtn?: boolean;
  disableDescription?: boolean;
  truncateModalDescription?: number;
  validationStatus: ValidationStatus;
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
    updateItemsWithNumber(newVal, props.allItemList);
  },
  { immediate: true },
);

watch(
  () => props.allItemList,
  (newVal) => {
    updateItemsWithNumber(props.initItems, newVal);
  },
  { immediate: true },
);

function isNonzero(itemWithNumber: ItemWithNumber): boolean {
  return itemWithNumber.number !== 0;
}

function updateItemsWithNumber(
  selectedItems: Record<string, number>,
  allItemList: { name: string; id: string; description: string }[],
) {
  itemsWithNumber.value = {};
  for (const item of allItemList) {
    itemsWithNumber.value[item.id] = {
      id: item.id,
      name: addSpaces(item.name),
      description: truncate(addSpaces(item.description), props.truncateModalDescription),
      number: 0,
    };
    if (selectedItems && item.id in selectedItems) {
      itemsWithNumber.value[item.id].number = selectedItems[item.id];
    }
  }
  itemsWithNumberList.value = Object.values(itemsWithNumber.value).sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}

const nonzeroItems = computed(() => itemsWithNumberList.value.filter((x) => isNonzero(x)));

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "number", displayName: "Number", skipStackedTitle: false },
];

const modalId = window.crypto.randomUUID();
const resetPaginationCounter = ref(0);

function onModifyClick() {
  resetPaginationCounter.value += 1;
  modal.showModal(modalId);
  searchTerm.value = "";
  itemsWithNumberList.value.sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
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
            <th class="border-b border-neutral-300 py-2 px-2">Number</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in nonzeroItems" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-2 border-b border-neutral-300">
              <TextLink :routeName="routeName" :params="{ id: src.id }">
                {{ addSpaces(src.name) }}
              </TextLink>
            </td>
            <td v-if="!disableDescription" class="py-2 px-2 border-b border-neutral-300">{{ src.description }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.number }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
    </div>
    <div class="text-sm text-red-600 mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
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
        :stackedViewSize="ViewSize.xs"
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

        <template #number="{ id }: { id: string }">
          <FormInput
            v-model="itemsWithNumber[id].number"
            type="number"
            class="min-w-16 w-full"
            @update:modelValue="emit('updated', { id: id, number: itemsWithNumber[id].number })"
          />
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
