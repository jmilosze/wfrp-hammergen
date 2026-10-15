<script setup lang="ts">
import IconButton from "./IconButton.vue";
import SectionLink from "./SectionLink.vue";
import SectionButton from "./SectionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import ListTable from "./ListTable.vue";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
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
  truncateModalDescription?: number;
  validationStatus: ValidationStatus;
}>();

const emit = defineEmits<{
  (e: "updated", value: { id: string; number: number }): void;
  (e: "reload"): void;
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

const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "number", displayName: "Number", skipStackedTitle: false },
];

const modalOpen = ref(false);

function onRemoveClick(id: string) {
  itemsWithNumber.value[id].number = 0;
  emit("updated", { id: id, number: 0 });
}

function onEditClick() {
  if (props.loading) {
    return;
  }
  modalOpen.value = true;
  searchTerm.value = "";
  itemsWithNumberList.value.sort((a, b) => {
    return isNonzero(a) === isNonzero(b) ? a.name.localeCompare(b.name) : isNonzero(a) ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <!-- The title cell spans the remove column, which has no header, so the actions sit at the right edge. -->
    <ListTable :editable="!disabled" :title="title" :loading="props.loading" :titleColspan="disabled ? 1 : 2">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</SectionButton>
      </template>
      <tr v-for="src in nonzeroItems" :key="src.id" class="bg-white hover:bg-neutral-100">
        <td class="py-2 px-2 border-b border-neutral-300">
          <TextLink :routeName="routeName" :params="{ id: src.id }">
            {{ src.name }}
          </TextLink>
          <span v-if="src.number > 1" class="ml-1">x{{ src.number }}</span>
        </td>
        <td v-if="!disabled" class="py-2 px-2 border-b border-neutral-300 w-0">
          <IconButton icon="lucide:x" :label="`Remove ${src.name}`" @click="onRemoveClick(src.id)" />
        </td>
      </tr>
    </ListTable>
    <div class="text-sm text-error mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow v-model:open="modalOpen">
      <template #header> {{ modalTitle }} </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="itemsWithNumberList"
        stackBreakpoint="lg"
        :loading="props.loading"
      >
        <SectionLink icon="lucide:plus" variant="neutral" :routeName="routeName" :params="{ id: 'create' }" newWindow>
          Create new
        </SectionLink>
        <SectionButton icon="lucide:refresh-cw" variant="neutral" :busy="props.loading" @click="emit('reload')">
          Reload
        </SectionButton>

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
