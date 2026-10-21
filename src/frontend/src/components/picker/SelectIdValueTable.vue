<script setup lang="ts">
import type { RouteName } from "@/router.ts";
import IconButton from "@/components/ui/IconButton.vue";
import { computed, reactive, ref, watchEffect } from "vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import SheetList from "@/components/sheet/SheetList.vue";
import AppButton from "@/components/ui/AppButton.vue";
import { truncate } from "@/utils/string.ts";
import TextLink from "@/components/ui/TextLink.vue";
import Edition4eBadge from "@/components/edition/Edition4eBadge.vue";
import FormInput from "@/components/form/FormInput.vue";
import { IdValue, MAX_VALUE_LENGTH } from "@/utils/idValue.ts";
import { ValidationStatus } from "@/utils/validation.ts";

// Selects entities together with a value (e.g. Ward 8, Hatred Elves). The modal only picks entities;
// values are edited in the table of selected entities.
type Entity = { id: string; name: string; description: string; hasValue: boolean };

const props = defineProps<{
  title: string;
  itemList: Entity[];
  selected: IdValue[];
  // The entities' page: names link to it. Without it (e.g. sources) names are text.
  routeName?: RouteName;
  // The longest value (MAX_VALUE_LENGTH unless given, e.g. a source's notes are longer).
  maxlength?: number;
  // Entities that take a value can be added more than once (each with its own value).
  allowRepeat?: boolean;
  disabled?: boolean;
  modalTitle?: string;
  loading?: boolean;
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
}>();

const entities = computed(() => new Map(props.itemList.map((x) => [x.id, x])));

// Selected entries with their index in `selected`, sorted by name; entries of unknown entities are skipped.
const selectedRows = computed(() =>
  props.selected
    .map((x, index) => ({ index: index, value: x.value, entity: entities.value.get(x.id) }))
    .filter((x): x is { index: number; value: string; entity: Entity } => x.entity !== undefined)
    .sort((a, b) => a.entity.name.localeCompare(b.entity.name) || a.index - b.index),
);

// How many times each entity is selected. Kept as one reactive record updated key by key, so a popup row that reads
// its own count is redrawn only when that count changes.
const counts = reactive<Record<string, number>>({});
watchEffect(() => {
  const fresh: Record<string, number> = {};
  for (const x of props.selected) {
    fresh[x.id] = (fresh[x.id] ?? 0) + 1;
  }
  for (const id of Object.keys(counts)) {
    if (!(id in fresh)) {
      delete counts[id];
    }
  }
  for (const [id, count] of Object.entries(fresh)) {
    if (counts[id] !== count) {
      counts[id] = count;
    }
  }
});

const showValueColumn = computed(() => selectedRows.value.some((x) => x.entity.hasValue));

// The title cell spans every column (none has a header of its own), so the actions sit at the right edge.
const titleColspan = computed(
  () => 1 + (showValueColumn.value ? 1 : 0) + (props.disableDescription ? 0 : 1) + (props.disabled ? 0 : 1),
);

function isRepeatable(id: string): boolean {
  return Boolean(props.allowRepeat && entities.value.get(id)?.hasValue);
}

// The popup's rows, by name; the popup lists the picked ones first.
const modalItems = computed(() =>
  props.itemList
    .map((x) => ({
      id: x.id,
      name: x.name,
      description: truncate(x.description, props.truncateModalDescription),
      repeatable: isRepeatable(x.id),
      get selected() {
        return x.id in counts;
      },
      get count() {
        return counts[x.id];
      },
    }))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

const modalOpen = ref(false);

function onEditClick() {
  if (props.loading) {
    return;
  }
  modalOpen.value = true;
}

const tdClass = ["py-2", "px-2", "border-b", "border-neutral-300"];
// A cell holding an input: the input fills the cell, so the cell has no padding of its own.
const tdInputClass = ["p-0", "border-b", "border-neutral-300"];
</script>

<template>
  <div>
    <SheetList :editable="!disabled" :title="title" :loading="props.loading" :titleColspan="titleColspan">
      <template v-if="!disabled" #actions>
        <AppButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</AppButton>
      </template>
      <tr
        v-for="row in selectedRows"
        :key="row.index"
        class="bg-white transition-colors duration-100 hover:bg-neutral-100"
      >
        <td :class="tdClass">
          <TextLink v-if="routeName" :routeName="routeName" :params="{ id: row.entity.id }">
            {{ row.entity.name }}
          </TextLink>
          <template v-else>{{ row.entity.name }}</template>
          <Edition4eBadge v-if="fourEIds?.has(row.entity.id)" />
        </td>
        <td v-if="showValueColumn" :class="row.entity.hasValue && !disabled ? tdInputClass : tdClass">
          <template v-if="row.entity.hasValue">
            <FormInput
              v-if="!disabled"
              :modelValue="row.value"
              :maxlength="maxlength ?? MAX_VALUE_LENGTH"
              bare
              class="min-w-24"
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
          <IconButton
            icon="lucide:x"
            :label="`Remove ${row.entity.name}`"
            @click="emit('remove', { index: row.index, id: row.entity.id })"
          />
        </td>
      </tr>
    </SheetList>
    <div class="text-sm text-error mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow v-model:open="modalOpen" fullHeight>
      <template #header> {{ modalTitle }} </template>
      <ChecklistPicker
        :items="modalItems"
        :routeName="routeName"
        :loading="props.loading"
        :fourEIds="fourEIds"
        @toggle="(e) => emit('selected', e)"
        @add="(id) => emit('add', id)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>
