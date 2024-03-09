<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref } from "vue";
import { source } from "../services/wh/source.ts";
import ModalWindow from "./ModalWindow.vue";
import { useModal } from "../composables/modal.ts";
import { ViewSize } from "../utils/viewSize.ts";
import TableWithSearch from "./TableWithSearch.vue";

const props = defineProps<{ initSources: Record<string, string> }>();

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name" },
  { name: "notes", displayName: "Notes" },
  { name: "selected", displayName: "Select" },
];

const sources: Ref<Record<string, { id: string; name: string; notes: string; selected: boolean }>> = ref({});

for (const [allSourceName, allSourceDispName] of Object.entries(source)) {
  if (props.initSources && allSourceName in props.initSources) {
    sources.value[allSourceName] = {
      id: allSourceName,
      name: allSourceDispName,
      notes: props.initSources[allSourceName],
      selected: true,
    };
  } else {
    sources.value[allSourceName] = { id: allSourceName, name: allSourceDispName, notes: "", selected: false };
  }
}

const allSources = computed(() => Object.values(sources.value));
const selectedSources = computed(() => allSources.value.filter((x) => x.selected));

function onModifyClick() {
  modal.showModal("modifySourceModal");
  searchTerm.value = "";
}
</script>

<template>
  <div>
    <div class="flex items-center mb-3">
      <div class="mb-1 mr-2">Sources</div>
      <ActionButton size="sm" @click="onModifyClick">Modify</ActionButton>
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
    <ModalWindow id="modifySourceModal">
      <template #header> Modify sources </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <div class="">
        <TableWithSearch
          v-model="searchTerm"
          :fields="modalColumns"
          :items="allSources"
          :stackedViewSize="ViewSize.zero"
        >
          <template #selected="{ id }: { id: string }">
            <input
              v-model="sources[id].selected"
              type="checkbox"
              class="w-5 h-5 accent-neutral-600"
              @input="console.log(`Source ${id} updated to ${sources[id].selected}`)"
            />
          </template>

          <template #notes="{ id }: { id: string }">
            <input
              v-model="sources[id].notes"
              class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2"
              @input="console.log(`Source ${id} updated to ${!sources[id].notes}`)"
            />
          </template>
        </TableWithSearch>
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
