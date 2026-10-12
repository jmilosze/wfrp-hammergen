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

const effects: Ref<Record<string, { id: number; name: string; desc: string; selected: boolean }>> = ref({});
const effectList: Ref<{ id: number; name: string; desc: string; selected: boolean }[]> = ref([]);

watch(
  () => props.initEffects,
  (newVal) => {
    effects.value = {};
    for (const effectType of modifierEffectsByEdition[props.edition]) {
      if (newVal && newVal.has(effectType)) {
        effects.value[effectType] = {
          id: effectType,
          name: printEffectName(effectType),
          desc: printEffectDesc(effectType),
          selected: true,
        };
      } else {
        effects.value[effectType] = {
          id: effectType,
          name: printEffectName(effectType),
          desc: printEffectDesc(effectType),
          selected: false,
        };
      }
    }
    effectList.value = Object.values(effects.value).sort((a, b) => a.name.localeCompare(b.name));
  },
  { immediate: true },
);

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
  <div>
    <ListTable :editable="!disabled" title="Effects">
      <template v-if="!disabled" #actions>
        <SectionButton icon="lucide:pencil" @click="onEditClick">Edit</SectionButton>
      </template>
      <template #headers>
        <th class="border-b border-neutral-300 py-2 px-2">Notes</th>
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
