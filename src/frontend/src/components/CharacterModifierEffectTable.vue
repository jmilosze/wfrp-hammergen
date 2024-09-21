<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { computed, ref, Ref, watch } from "vue";
import ModalWindow from "./ModalWindow.vue";
import { useModal } from "../composables/modal.ts";
import { ViewSize } from "../utils/viewSize.ts";
import TableWithSearch from "./TableWithSearch.vue";
import { addSpaces } from "../utils/string.ts";
import { modifierEffectList, printEffectDesc, printEffectName } from "../services/wh/characterModifiers.ts";

const props = defineProps<{ initEffects: Set<number>; disabled?: boolean }>();

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
    for (const effectType of modifierEffectList) {
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

function onModifyClick() {
  modal.showModal("modifyEffectsModal");
  searchTerm.value = "";
  effectList.value.sort((a, b) => {
    return a.selected === b.selected ? a.name.localeCompare(b.name) : a.selected ? -1 : 1;
  });
}
</script>

<template>
  <div>
    <div class="flex items-center mb-1">
      <div class="mr-2">Effects</div>
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
            <td class="py-2 px-5 border-b border-neutral-300">{{ addSpaces(src.desc) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
    </div>
    <ModalWindow id="modifyEffectsModal">
      <template #header> Modify sources </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <div class="">
        <TableWithSearch v-model="searchTerm" :fields="modalColumns" :items="effectList" :stackedViewSize="ViewSize.sm">
          <template #selected="{ id }: { id: number }">
            <div>
              <input
                v-model="effects[id].selected"
                type="checkbox"
                class="w-5 h-5 accent-neutral-600"
                @input="emit('selected', { id: id, selected: !effects[id].selected })"
              >
            </div>
          </template>
        </TableWithSearch>
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
