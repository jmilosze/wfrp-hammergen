<script setup lang="ts">
import IconButton from "../../ui/IconButton.vue";
import SheetCard from "../../sheet/SheetCard.vue";
import AppButton from "../../ui/AppButton.vue";
import { computed, ref } from "vue";
import { source, sourcesByEdition, validateSourceRecord } from "../../../services/wh/core/source.ts";
import { Edition } from "../../../services/wh/core/edition.ts";
import ModalWindow from "../../ui/ModalWindow.vue";
import ChecklistPicker from "../../picker/ChecklistPicker.vue";

// The entry's sources (source id to page notes), read directly (the parent changes them on the emitted events).
const props = defineProps<{ sources: Record<string, string>; edition: Edition; disabled?: boolean }>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; notes: string; selected: boolean }): void;
}>();

const modalOpen = ref(false);

// The notes of sources unticked here, so ticking one again brings its notes back.
const keptNotes = ref<Record<string, string>>({});

// The edition's sources, by name.
const sourceRows = computed(() =>
  sourcesByEdition[props.edition]
    .map((id) => ({ id: id, name: source[id] }))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

const selectedSources = computed(() =>
  sourceRows.value.filter((x) => x.id in props.sources).map((x) => ({ ...x, notes: props.sources[x.id] })),
);
const selectedSourcesValid = computed(() => selectedSources.value.every((x) => validateSourceRecord(x.notes).valid));

function notesOf(id: string): string {
  return props.sources[id] ?? keptNotes.value[id] ?? "";
}

// Popup rows are made once per list; each reads its live values through getters, so a change redraws only its own row.
const modalItems = computed(() =>
  sourceRows.value.map((x) => ({
    id: x.id,
    name: x.name,
    description: "",
    get selected() {
      return x.id in props.sources;
    },
    get text() {
      return notesOf(x.id);
    },
    get textError() {
      const valid = validateSourceRecord(notesOf(x.id));
      return valid.valid ? undefined : valid.message;
    },
  })),
);

function setSelected(id: string, selected: boolean) {
  const notes = notesOf(id);
  if (!selected) {
    keptNotes.value[id] = notes;
  }
  emit("selected", { id: id, notes: notes, selected: selected });
}

function setNotes(id: string, notes: string) {
  const selected = id in props.sources;
  if (!selected) {
    keptNotes.value[id] = notes;
  }
  emit("selected", { id: id, notes: notes, selected: selected });
}
</script>

<template>
  <div>
    <SheetCard title="Sources">
      <template v-if="!disabled" #actions>
        <AppButton icon="lucide:pencil" @click="modalOpen = true">Edit</AppButton>
      </template>
      <table class="w-full">
        <thead>
          <tr class="text-left" :class="{ 'bg-editable': !disabled }">
            <th class="border-b border-neutral-300 py-2 px-2">Name</th>
            <th class="border-b border-neutral-300 py-2 px-2">Notes</th>
            <th v-if="!disabled" class="border-b border-neutral-300 py-2 px-2 w-0" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedSources" :key="src.id" class="bg-white hover:bg-neutral-100">
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.name }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.notes }}</td>
            <td v-if="!disabled" class="py-2 px-2 border-b border-neutral-300 w-0">
              <IconButton icon="lucide:x" :label="`Remove ${src.name}`" @click="setSelected(src.id, false)" />
            </td>
          </tr>
        </tbody>
      </table>
    </SheetCard>
    <p class="text-sm text-error mt-1" :class="[selectedSourcesValid ? 'hidden' : '']">
      Some of the sources are invalid.
    </p>
    <ModalWindow v-model:open="modalOpen" fullHeight>
      <template #header> Edit sources </template>
      <ChecklistPicker
        :items="modalItems"
        textLabel="Notes"
        @toggle="(e) => setSelected(e.id, e.selected)"
        @setText="(e) => setNotes(e.id, e.text)"
      />
    </ModalWindow>
  </div>
</template>

<style scoped></style>
