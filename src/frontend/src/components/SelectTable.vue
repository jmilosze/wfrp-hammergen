<script setup lang="ts">
import SectionButton from "./SectionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import { useModal } from "../composables/modal.ts";
import ListTable from "./ListTable.vue";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";
import EditionFilterSelect from "./EditionFilterSelect.vue";
import { EditionFilter, matchesEditionFilter } from "../services/wh/core/edition.ts";
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
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; selected: boolean }): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
}>();

const itemsWithSelect: Ref<Record<string, ItemWithSelect>> = ref({});
const itemsWithSelectList: Ref<ItemWithSelect[]> = ref([]);
const editionFilter = ref<EditionFilter>("both");
const itemsWithSelectListFiltered = computed(() =>
  itemsWithSelectList.value.filter((x) => matchesEditionFilter(x.id, props.fourEIds, editionFilter.value)),
);

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
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "selected", displayName: "Select", skipStackedTitle: false },
];

const modalId = props.modalId ? props.modalId : "modifyItemsModal";

const resetPaginationCounter = ref(0);

function onEditClick() {
  if (props.loading) {
    return;
  }
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
    <ListTable :editable="!disabled" :title="title" :loading="props.loading" :titleColspan="disableDescription ? 1 : 2">
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
      <tr v-for="src in selectedItems" :key="src.id" class="bg-white hover:bg-neutral-200">
        <td class="py-2 px-2 border-b border-neutral-300">
          <TextLink :routeName="routeName" :params="{ id: src.id }">
            {{ src.name }}
          </TextLink>
          <Edition4eBadge v-if="fourEIds?.has(src.id)" />
        </td>
        <td v-if="!disableDescription" class="hidden @sm:table-cell py-2 px-2 border-b border-neutral-300">
          {{ src.description }}
        </td>
      </tr>
    </ListTable>
    <ModalWindow :id="modalId">
      <template #header> {{ modalTitle }} </template>
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="itemsWithSelectListFiltered"
        stackBreakpoint="lg"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" :routeName="routeName" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton :loading="props.loading" @click="emit('reload')" />
        <EditionFilterSelect v-if="fourEIds" v-model="editionFilter" />

        <template #name="{ id }: { id: string }">
          <TextLink :routeName="routeName" :params="{ id: id }">
            {{ itemsWithSelect[id].name }}
          </TextLink>
          <Edition4eBadge v-if="fourEIds?.has(id)" />
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
