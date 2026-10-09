<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref } from "vue";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";
import { useModal } from "../composables/modal.ts";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import Edition4eBadge from "./Edition4eBadge.vue";
import EditionFilterSelect from "./EditionFilterSelect.vue";
import { EditionFilter, matchesEditionFilter } from "../utils/editionFilter.ts";
import LinkButton from "./LinkButton.vue";
import ReloadButton from "./ReloadButton.vue";
import FormInput from "./FormInput.vue";
import { IdValue, MAX_VALUE_LENGTH } from "../utils/idValue.ts";
import { ValidationStatus } from "../utils/validation.ts";
import { Icon } from "@iconify/vue";

// Selects entities together with a value (e.g. Ward 8, Hatred Elves). The modal only picks entities;
// values are edited in the table of selected entities.
type Entity = { id: string; name: string; description: string; hasValue: boolean };

const props = defineProps<{
  title: string;
  itemList: Entity[];
  selected: IdValue[];
  routeName: string;
  // Entities that take a value can be added more than once (each with its own value).
  allowRepeat?: boolean;
  disabled?: boolean;
  modalTitle?: string;
  loading?: boolean;
  clearAllBtn?: boolean;
  disableDescription?: boolean;
  truncateModalDescription?: number;
  validationStatus: ValidationStatus;
  // Ids of 4e content offered to a 5e character that allows 4e content: badged and filterable.
  fourEIds?: Set<string>;
}>();

const emit = defineEmits<{
  (e: "add", id: string): void;
  (e: "remove", value: { index: number; id: string }): void;
  (e: "selected", value: { id: string; selected: boolean }): void;
  (e: "updateValue", value: { index: number; id: string; value: string }): void;
  (e: "reload"): void;
  (e: "clearAll"): void;
}>();

const entities = computed(() => new Map(props.itemList.map((x) => [x.id, x])));

// Selected entries with their index in `selected`, sorted by name; entries of unknown entities are skipped.
const selectedRows = computed(() =>
  props.selected
    .map((x, index) => ({ index: index, value: x.value, entity: entities.value.get(x.id) }))
    .filter((x): x is { index: number; value: string; entity: Entity } => x.entity !== undefined)
    .sort((a, b) => a.entity.name.localeCompare(b.entity.name) || a.index - b.index),
);

const counts = computed(() => {
  const counts: Record<string, number> = {};
  for (const x of props.selected) {
    counts[x.id] = (counts[x.id] ?? 0) + 1;
  }
  return counts;
});

const showValueColumn = computed(() => selectedRows.value.some((x) => x.entity.hasValue));

function isRepeatable(id: string): boolean {
  return Boolean(props.allowRepeat && entities.value.get(id)?.hasValue);
}

// Modal rows are sorted when the modal opens, so that rows do not jump while selecting.
const modalItems = ref<{ id: string; name: string; description: string }[]>([]);
const editionFilter = ref<EditionFilter>("both");
const modalItemsFiltered = computed(() =>
  modalItems.value.filter((x) => matchesEditionFilter(x.id, props.fourEIds, editionFilter.value)),
);

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "description", displayName: "Description", skipStackedTitle: true },
  { name: "selected", displayName: "Select", skipStackedTitle: false },
];

const modalId = window.crypto.randomUUID();
const resetPaginationCounter = ref(0);

function onModifyClick() {
  if (props.loading) {
    return;
  }
  resetPaginationCounter.value += 1;
  searchTerm.value = "";
  modalItems.value = props.itemList
    .map((x) => ({ id: x.id, name: x.name, description: truncate(x.description, props.truncateModalDescription) }))
    .sort((a, b) => {
      const aSelected = a.id in counts.value;
      const bSelected = b.id in counts.value;
      return aSelected === bSelected ? a.name.localeCompare(b.name) : aSelected ? -1 : 1;
    });
  modal.showModal(modalId);
}

const thClass = ["border-b", "border-neutral-300", "py-2", "px-2"];
const tdClass = ["py-2", "px-2", "border-b", "border-neutral-300"];
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-1">
      <div v-if="title">{{ title }}</div>
      <ActionButton v-if="!disabled" :disabled="props.loading" class="btn btn-sm" @click="onModifyClick">
        Modify
      </ActionButton>
      <ActionButton
        v-if="!disabled && clearAllBtn"
        :disabled="props.loading"
        class="btn btn-danger btn-sm"
        @click="emit('clearAll')"
      >
        Clear all
      </ActionButton>
    </div>
    <div v-if="props.loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else class="@container bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th :class="thClass">Name</th>
            <th v-if="showValueColumn" :class="thClass">Value</th>
            <th v-if="!disableDescription" class="hidden @2xl:table-cell" :class="thClass">Description</th>
            <th v-if="!disabled" :class="thClass" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in selectedRows" :key="row.index" class="bg-white hover:bg-neutral-200">
            <td :class="tdClass">
              <TextLink :routeName="routeName" :params="{ id: row.entity.id }">
                {{ row.entity.name }}
              </TextLink>
              <Edition4eBadge v-if="fourEIds?.has(row.entity.id)" />
            </td>
            <td v-if="showValueColumn" :class="tdClass">
              <template v-if="row.entity.hasValue">
                <FormInput
                  v-if="!disabled"
                  :modelValue="row.value"
                  :maxlength="MAX_VALUE_LENGTH"
                  class="min-w-24 max-w-48"
                  @update:modelValue="
                    (value: string) => emit('updateValue', { index: row.index, id: row.entity.id, value: value })
                  "
                />
                <span v-else>{{ row.value }}</span>
              </template>
            </td>
            <td v-if="!disableDescription" class="hidden @2xl:table-cell" :class="tdClass">
              {{ truncate(row.entity.description, truncateModalDescription) }}
            </td>
            <td v-if="!disabled" :class="tdClass" class="w-0">
              <button
                class="hover:bg-neutral-700 hover:text-amber-300 p-1 rounded"
                :aria-label="`Remove ${row.entity.name}`"
                @click="emit('remove', { index: row.index, id: row.entity.id })"
              >
                <Icon icon="lucide:x" class="size-5" />
              </button>
            </td>
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
      <TableWithSearch
        v-model="searchTerm"
        :fields="modalColumns"
        :items="modalItemsFiltered"
        stackBreakpoint="lg"
        :loading="props.loading"
        :resetPagination="resetPaginationCounter"
      >
        <LinkButton class="mr-2 mb-2 shrink-0 btn" :routeName="routeName" :params="{ id: 'create' }" :newWindow="true">
          Create new
        </LinkButton>
        <ReloadButton @click="emit('reload')" />
        <EditionFilterSelect v-if="fourEIds" v-model="editionFilter" />

        <template #name="{ id, name }: { id: string; name: string }">
          <TextLink :routeName="routeName" :params="{ id: id }">
            {{ name }}
          </TextLink>
          <Edition4eBadge v-if="fourEIds?.has(id)" />
        </template>

        <template #selected="{ id }: { id: string }">
          <div v-if="isRepeatable(id)" class="flex items-center gap-2">
            <ActionButton class="btn btn-sm" @click="emit('add', id)">Add</ActionButton>
            <span v-if="counts[id]">×{{ counts[id] }}</span>
          </div>
          <div v-else>
            <input
              :checked="id in counts"
              type="checkbox"
              class="w-5 h-5 accent-neutral-600 my-1"
              @change="emit('selected', { id: id, selected: !(id in counts) })"
            />
          </div>
        </template>
      </TableWithSearch>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
