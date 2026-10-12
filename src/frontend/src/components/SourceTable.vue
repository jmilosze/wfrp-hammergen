<script setup lang="ts">
import SectionCard from "./SectionCard.vue";
import SectionButton from "./SectionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import { source, sourcesByEdition, validateSourceRecord } from "../services/wh/core/source.ts";
import { Edition } from "../services/wh/core/edition.ts";
import ModalWindow from "./ModalWindow.vue";
import { useModal } from "../composables/modal.ts";
import TableWithSearch from "./TableWithSearch.vue";

const props = defineProps<{ initSources: Record<string, string>; edition: Edition; disabled?: boolean }>();

const emit = defineEmits<{
  (e: "selected", value: { id: string; notes: string; selected: boolean }): void;
}>();

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "notes", displayName: "Notes", skipStackedTitle: false },
  { name: "selected", displayName: "Select", skipStackedTitle: false },
];

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

function onEditClick() {
  modal.showModal("modifySourceModal");
  searchTerm.value = "";
  sourcesList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
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
          <tr class="text-left" :class="{ 'bg-primary-50': !disabled }">
            <th class="border-b border-neutral-300 py-2 px-2">Name</th>
            <th class="border-b border-neutral-300 py-2 px-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedSources" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.name }}</td>
            <td class="py-2 px-2 border-b border-neutral-300">{{ src.notes }}</td>
          </tr>
        </tbody>
      </table>
    </SectionCard>
    <p class="text-sm text-danger-600 mt-1" :class="[selectedSourcesValid ? 'hidden' : '']">
      Some of the sources are invalid.
    </p>
    <ModalWindow id="modifySourceModal">
      <template #header> Edit sources </template>
      <div>
        <TableWithSearch v-model="searchTerm" :fields="modalColumns" :items="sourcesList" stackBreakpoint="lg">
          <template #selected="{ id }: { id: string }">
            <div>
              <input
                v-model="sources[id].selected"
                type="checkbox"
                class="w-5 h-5 accent-neutral-600"
                @input="emit('selected', { id: id, notes: sources[id].notes, selected: !sources[id].selected })"
              />
            </div>
          </template>

          <template #notes="{ id }: { id: string }">
            <input
              v-model="sources[id].notes"
              class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2"
              @input="emit('selected', { id: id, notes: sources[id].notes, selected: sources[id].selected })"
            />
            <p class="text-sm text-danger-600" :class="[validateSourceRecord(sources[id].notes).valid ? 'hidden' : '']">
              {{ validateSourceRecord(sources[id].notes).message }}
            </p>
          </template>
        </TableWithSearch>
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
