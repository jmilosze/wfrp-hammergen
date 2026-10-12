<script setup lang="ts">
import ListTable from "./ListTable.vue";
import SectionButton from "./SectionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import ModalWindow from "./ModalWindow.vue";
import { useModal } from "../composables/modal.ts";
import TableWithSearch from "./TableWithSearch.vue";
import { modifierEffectsByEdition, printEffectDesc, printEffectName } from "../services/wh/core/characterModifiers.ts";
import { Edition } from "../services/wh/core/edition.ts";

const props = defineProps<{ initEffects: Set<number>; edition: Edition; disabled?: boolean }>();

const emit = defineEmits<{
  (e: "selected", value: { id: number; selected: boolean }): void;
}>();

const modal = useModal();
const searchTerm = ref("");
const modalColumns = [
  { name: "name", displayName: "Name", skipStackedTitle: false },
  { name: "desc", displayName: "Description", skipStackedTitle: false },
  { name: "selected", displayName: "Select", skipStackedTitle: false },
];

const effectList: Ref<{ id: number; name: string; desc: string; selected: boolean }[]> = ref([]);

// The list is built per edition; ticking an effect only updates its selected flag, so the popup's order (ticked first,
// set when it opens) does not change while it is open.
watch(
  () => props.edition,
  (edition) => {
    effectList.value = modifierEffectsByEdition[edition]
      .map((effectType) => ({
        id: effectType,
        name: printEffectName(effectType),
        desc: printEffectDesc(effectType),
        selected: props.initEffects.has(effectType),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  { immediate: true },
);

watch(
  () => props.initEffects,
  (newVal) => {
    for (const effect of effectList.value) {
      effect.selected = newVal.has(effect.id);
    }
  },
);

// Lookup by id for the popup's checkboxes; its entries are the list's own objects.
const effects = computed(() => Object.fromEntries(effectList.value.map((x) => [x.id, x])));

const selectedSources = computed(() => effectList.value.filter((x) => x.selected));

function onEditClick() {
  modal.showModal("modifyEffectsModal");
  searchTerm.value = "";
  effectList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}
</script>

<template>
  <div class="flex flex-col">
    <ListTable :editable="!disabled" title="Effects" :titleColspan="2" class="grow">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" @click="onEditClick">Edit</SectionButton>
      </template>
      <tr v-for="src in selectedSources" :key="src.id" class="bg-white hover:bg-neutral-200">
        <td class="py-2 px-2 border-b border-neutral-300">{{ src.name }}</td>
        <td class="py-2 px-2 border-b border-neutral-300">{{ src.desc }}</td>
      </tr>
    </ListTable>
    <ModalWindow id="modifyEffectsModal">
      <template #header> Edit effects </template>
      <div class="">
        <TableWithSearch v-model="searchTerm" :fields="modalColumns" :items="effectList" stackBreakpoint="2xl">
          <template #selected="{ id }: { id: number }">
            <div>
              <input
                v-model="effects[id].selected"
                type="checkbox"
                class="w-5 h-5 accent-neutral-600"
                @input="emit('selected', { id: id, selected: !effects[id].selected })"
              />
            </div>
          </template>
        </TableWithSearch>
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
