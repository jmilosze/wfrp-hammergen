<script setup lang="ts">
import SectionButton from "./SectionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import { useModal } from "../composables/modal.ts";
import ListTable from "./ListTable.vue";
import { truncate } from "../utils/string.ts";
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
  [() => props.initItems, () => props.allItemList],
  ([selectedItems, allItemList]) => {
    updateItemsWithNumber(selectedItems, allItemList);
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
  const newItemsWithNumber: Record<string, ItemWithNumber> = {};
  for (const item of allItemList) {
    newItemsWithNumber[item.id] = {
      id: item.id,
      name: item.name,
      description: truncate(item.description, props.truncateModalDescription),
      number: selectedItems && item.id in selectedItems ? selectedItems[item.id] : 0,
    };
  }
  itemsWithNumber.value = newItemsWithNumber;
  itemsWithNumberList.value = Object.values(newItemsWithNumber).sort((a, b) => {
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

function onEditClick() {
  if (props.loading) {
    return;
  }
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
    <ListTable :title="title" :loading="props.loading">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</SectionButton>
        <SectionButton
          v-if="clearAllBtn"
          icon="lucide:trash-2"
          variant="danger"
          :disabled="props.loading"
          @click="emit('clearAll')"
        >
          Clear all
        </SectionButton>
      </template>
      <template #headers>
        <th v-if="!disableDescription" class="hidden @sm:table-cell border-b border-neutral-300 py-2 px-2">
          Description
        </th>
        <th class="border-b border-neutral-300 py-2 px-2">Number</th>
      </template>
      <tr v-for="src in nonzeroItems" :key="src.id" class="bg-white hover:bg-neutral-200">
        <td class="py-2 px-2 border-b border-neutral-300">
          <TextLink :routeName="routeName" :params="{ id: src.id }">
            {{ src.name }}
          </TextLink>
        </td>
        <td v-if="!disableDescription" class="hidden @sm:table-cell py-2 px-2 border-b border-neutral-300">
          {{ src.description }}
        </td>
        <td class="py-2 px-2 border-b border-neutral-300">{{ src.number }}</td>
      </tr>
    </ListTable>
    <div class="text-sm text-danger-600 mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow :id="modalId">
      <template #header> {{ modalTitle }} </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="itemsWithNumberList"
        stackBreakpoint="lg"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" :routeName="routeName" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton :loading="props.loading" @click="emit('reload')" />

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
