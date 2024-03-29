<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import { source, validateSourceRecord } from "../services/wh/source.ts";
import ModalWindow from "./ModalWindow.vue";
import { useModal } from "../composables/modal.ts";
import { ViewSize } from "../utils/viewSize.ts";
import TableWithSearch from "./TableWithSearch.vue";

const props = defineProps<{ initSources: Record<string, string>; disabled?: boolean }>();

const emit = defineEmits<{
  (e: "selected", modelValue: { id: string; notes: string; selected: boolean }): void;
}>();

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name" },
  { name: "notes", displayName: "Notes" },
  { name: "selected", displayName: "Select" },
];

const sources: Ref<Record<string, { id: string; name: string; notes: string; selected: boolean }>> = ref({});
const sourcesList: Ref<{ id: string; name: string; notes: string; selected: boolean }[]> = ref([]);

watch(
  () => props.initSources,
  (newVal) => {
    sources.value = {};
    for (const [allSourceName, allSourceDispName] of Object.entries(source)) {
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

function onModifyClick() {
  modal.showModal("modifySourceModal");
  searchTerm.value = "";
  sourcesList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center" :class="disabled ? 'mb-1' : 'mb-2'">
      <div class="mr-2">Sources</div>
      <ActionButton v-if="!disabled" size="sm" @click="onModifyClick">Modify</ActionButton>
    </div>
    <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-5">Name</th>
            <th class="border-b border-neutral-300 py-2 px-5">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="src in selectedSources" :key="src.id" class="bg-white hover:bg-neutral-200">
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.name }}</td>
            <td class="py-2 px-5 border-b border-neutral-300">{{ src.notes }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
    <p class="text-sm text-red-600 mt-1" :class="[selectedSourcesValid ? 'hidden' : '']">
      Some of the sources are invalid.
    </p>
    <ModalWindow id="modifySourceModal">
      <template #header> Modify sources </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <div class="">
        <TableWithSearch
          v-model="searchTerm"
          :fields="modalColumns"
          :items="sourcesList"
          :stackedViewSize="ViewSize.sm"
        >
          <template #selected="{ id }: { id: string }">
            <input
              v-model="sources[id].selected"
              type="checkbox"
              class="w-5 h-5 accent-neutral-600"
              @input="emit('selected', { id: id, notes: sources[id].notes, selected: !sources[id].selected })"
            />
          </template>

          <template #notes="{ id }: { id: string }">
            <input
              v-model="sources[id].notes"
              class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2"
              @input="emit('selected', { id: id, notes: sources[id].notes, selected: sources[id].selected })"
            />
            <p class="text-sm text-red-600" :class="[validateSourceRecord(sources[id].notes).valid ? 'hidden' : '']">
              {{ validateSourceRecord(sources[id].notes).message }}
            </p>
          </template>
        </TableWithSearch>
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
