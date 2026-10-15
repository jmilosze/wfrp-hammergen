<script setup lang="ts">
import IconButton from "./IconButton.vue";
import SectionCard from "./SectionCard.vue";
import SectionButton from "./SectionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import { source, sourcesByEdition, validateSourceRecord } from "../services/wh/core/source.ts";
import { Edition } from "../services/wh/core/edition.ts";
import ModalWindow from "./ModalWindow.vue";
import ChecklistPicker from "./ChecklistPicker.vue";

const props = defineProps<{ initSources: Record<string, string>; edition: Edition; disabled?: boolean }>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; notes: string; selected: boolean }): void;
}>();

const modalOpen = ref(false);

const sources: Ref<Record<string, { id: string; name: string; notes: string; selected: boolean }>> = ref({});
const sourcesList: Ref<{ id: string; name: string; notes: string; selected: boolean }[]> = ref([]);

watch(
  () => props.initSources,
  (newVal) => {
    sources.value = {};
    for (const allSourceName of sourcesByEdition[props.edition]) {
      const allSourceDispName = source[allSourceName];
      if (newVal && allSourceName in newVal) {
        sources.value[allSourceName] = {
          id: allSourceName,
          name: allSourceDispName,
          notes: newVal[allSourceName],
          selected: true,
        };
      } else {
        sources.value[allSourceName] = { id: allSourceName, name: allSourceDispName, notes: "", selected: false };
      }
    }
    sourcesList.value = Object.values(sources.value).sort((a, b) => a.name.localeCompare(b.name));
  },
  { immediate: true },
);

const selectedSources = computed(() => sourcesList.value.filter((x) => x.selected));
const selectedSourcesValid = computed(() => {
  for (const src of selectedSources.value) {
    if (!validateSourceRecord(src.notes).valid) {
      return false;
    }
  }
  return true;
});

function onRemoveClick(id: string) {
  sources.value[id].selected = false;
  emit("selected", { id: id, notes: sources.value[id].notes, selected: false });
}

function onEditClick() {
  sourcesList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
  modalOpen.value = true;
}

// Popup rows are made once per list; each reads its live values through getters, so a change redraws only its own row.
const modalItems = computed(() =>
  sourcesList.value.map((x) => ({
    id: x.id,
    name: x.name,
    description: "",
    get selected() {
      return x.selected;
    },
    get text() {
      return x.notes;
    },
    get textError() {
      const valid = validateSourceRecord(x.notes);
      return valid.valid ? undefined : valid.message;
    },
  })),
);

function setSelected(id: string, selected: boolean) {
  sources.value[id].selected = selected;
  emit("selected", { id: id, notes: sources.value[id].notes, selected: selected });
}

function setNotes(id: string, notes: string) {
  sources.value[id].notes = notes;
  emit("selected", { id: id, notes: notes, selected: sources.value[id].selected });
}
</script>

<template>
  <div>
    <SectionCard title="Sources">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" @click="onEditClick">Edit</SectionButton>
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
              <IconButton icon="lucide:x" :label="`Remove ${src.name}`" @click="onRemoveClick(src.id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </SectionCard>
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
