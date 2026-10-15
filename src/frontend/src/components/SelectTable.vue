<script setup lang="ts">
import IconButton from "./IconButton.vue";
import SectionButton from "./SectionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import ModalWindow from "./ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import { useModal } from "../composables/modal.ts";
import ListTable from "./ListTable.vue";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";

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
  // Each row gets a cross that deselects it.
  removable?: boolean;
  disableDescription?: boolean;
  truncateModalDescription?: number;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; selected: boolean }): void;
  (e: "reload"): void;
}>();

const itemsWithSelect: Ref<Record<string, ItemWithSelect>> = ref({});
const itemsWithSelectList: Ref<ItemWithSelect[]> = ref([]);

watch(
  [() => props.initSelectedItems, () => props.itemList],
  ([selectedItems, itemList]) => {
    updateItemsWithSelect(selectedItems, itemList);
  },
  { immediate: true },
);

function updateItemsWithSelect(
  selectedItems: Set<string>,
  itemList: { name: string; id: string; description: string }[],
) {
  const newItemsWithSelect: Record<string, ItemWithSelect> = {};
  for (const item of itemList) {
    newItemsWithSelect[item.id] = {
      id: item.id,
      name: item.name,
      description: truncate(item.description, props.truncateModalDescription),
      selected: Boolean(selectedItems && selectedItems.has(item.id)),
    };
  }
  itemsWithSelect.value = newItemsWithSelect;
  itemsWithSelectList.value = Object.values(newItemsWithSelect).sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}

const selectedItems = computed(() => itemsWithSelectList.value.filter((x) => x.selected));

const modal = useModal();

const modalId = props.modalId ? props.modalId : "modifyItemsModal";

const openedCounter = ref(0);

const showRemove = computed(() => props.removable && !props.disabled);
// The title cell spans the remove column, which has no header, so the actions sit at the right edge.
const titleColspan = computed(() => (props.disableDescription ? 1 : 2) + (showRemove.value ? 1 : 0));

function onRemoveClick(id: string) {
  itemsWithSelect.value[id].selected = false;
  emit("selected", { id: id, selected: false });
}

function onEditClick() {
  if (props.loading) {
    return;
  }
  itemsWithSelectList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
  openedCounter.value += 1;
  modal.showModal(modalId);
}

function onToggle(id: string, selected: boolean) {
  itemsWithSelect.value[id].selected = selected;
  emit("selected", { id: id, selected: selected });
}
</script>

<template>
  <div>
    <ListTable :editable="!disabled" :title="title" :loading="props.loading" :titleColspan="titleColspan">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</SectionButton>
      </template>
      <tr v-for="src in selectedItems" :key="src.id" class="bg-white hover:bg-neutral-100">
        <td class="py-2 px-2 border-b border-neutral-300">
          <TextLink :routeName="routeName" :params="{ id: src.id }">
            {{ src.name }}
          </TextLink>
          <Edition4eBadge v-if="fourEIds?.has(src.id)" />
        </td>
        <td v-if="!disableDescription" class="hidden @sm:table-cell py-2 px-2 border-b border-neutral-300">
          {{ src.description }}
        </td>
        <td v-if="showRemove" class="py-2 px-2 border-b border-neutral-300 w-0">
          <IconButton icon="lucide:x" :label="`Remove ${src.name}`" @click="onRemoveClick(src.id)" />
        </td>
      </tr>
    </ListTable>
    <ModalWindow :id="modalId" fullHeight>
      <template #header> {{ modalTitle }} </template>
      <ChecklistPicker
        :items="itemsWithSelectList"
        :routeName="routeName"
        :opened="openedCounter"
        :loading="props.loading"
        :fourEIds="fourEIds"
        @toggle="(e) => onToggle(e.id, e.selected)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>

<style scoped></style>
