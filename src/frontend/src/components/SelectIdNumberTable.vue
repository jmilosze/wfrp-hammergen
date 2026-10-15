<script setup lang="ts">
import IconButton from "./IconButton.vue";
import SectionButton from "./SectionButton.vue";
import { computed, ref } from "vue";
import ModalWindow from "./ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";
import ListTable from "./ListTable.vue";
import { truncate } from "../utils/string.ts";
import TextLink from "./TextLink.vue";
import { ValidationStatus } from "../utils/validation.ts";

type Entity = { name: string; id: string; description: string };

// Picks entries of itemList with a number each (e.g. how many of a rune); selected is id to number, read directly (the
// parent changes it on the emitted events). An entry with 0 is not picked.
const props = defineProps<{
  title: string;
  itemList: Entity[];
  selected: Record<string, number>;
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

const byName = (a: Entity, b: Entity) => a.name.localeCompare(b.name);

function numberOf(id: string): number {
  return props.selected[id] ?? 0;
}

const selectedItems = computed(() =>
  props.itemList
    .filter((x) => numberOf(x.id) !== 0)
    .sort(byName)
    .map((x) => ({ id: x.id, name: x.name, number: numberOf(x.id) })),
);

// Popup rows are made once per list; each reads its number through a getter, so typing redraws only its own row.
const modalItems = computed(() =>
  [...props.itemList].sort(byName).map((x) => ({
    id: x.id,
    name: x.name,
    description: truncate(x.description, props.truncateModalDescription),
    get number() {
      return numberOf(x.id);
    },
    get selected() {
      return numberOf(x.id) !== 0;
    },
  })),
);

const modalOpen = ref(false);

function onEditClick() {
  if (props.loading) {
    return;
  }
  modalOpen.value = true;
}
</script>

<template>
  <div>
    <!-- The title cell spans the remove column, which has no header, so the actions sit at the right edge. -->
    <ListTable :editable="!disabled" :title="title" :loading="props.loading" :titleColspan="disabled ? 1 : 2">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" :disabled="props.loading" @click="onEditClick">Edit</SectionButton>
      </template>
      <tr v-for="src in selectedItems" :key="src.id" class="bg-white hover:bg-neutral-100">
        <td class="py-2 px-2 border-b border-neutral-300">
          <TextLink :routeName="routeName" :params="{ id: src.id }">
            {{ src.name }}
          </TextLink>
          <span v-if="src.number > 1" class="ml-1">x{{ src.number }}</span>
        </td>
        <td v-if="!disabled" class="py-2 px-2 border-b border-neutral-300 w-0">
          <IconButton
            icon="lucide:x"
            :label="`Remove ${src.name}`"
            @click="emit('updated', { id: src.id, number: 0 })"
          />
        </td>
      </tr>
    </ListTable>
    <div class="text-sm text-error mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
    <ModalWindow v-model:open="modalOpen" fullHeight>
      <template #header> {{ modalTitle }} </template>
      <ChecklistPicker
        :items="modalItems"
        :routeName="routeName"
        :loading="props.loading"
        numberLabel="Number"
        @setNumber="(e) => emit('updated', e)"
        @reload="emit('reload')"
      />
    </ModalWindow>
  </div>
</template>
