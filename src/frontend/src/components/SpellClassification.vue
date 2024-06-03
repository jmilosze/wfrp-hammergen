<script setup lang="ts">
import {
  getAllowedLabels,
  getSimplifiedLabels,
  printSpellLabel,
  printSpellType,
  SpellClassification,
  SpellLabel,
  SpellType,
  spellTypeList,
} from "../services/wh/spell.ts";
import SelectInput from "./SelectInput.vue";
import { Ref, ref, watch } from "vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
import TableWithSearch from "./TableWithSearch.vue";

const props = defineProps<{ modelValue: SpellClassification; disabled?: boolean; stacked?: boolean }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SpellClassification): void;
  (e: "update:simplifiedLabels", value: SpellLabel[]): void;
}>();

const contentContainerRef = ref(null);
const sm = useElSize(ViewSize.sm, contentContainerRef);

const modal = useModal();
const searchTerm = ref("");

const typeOptions = spellTypeList.map((x) => ({ text: printSpellType(x), value: x }));

function updateType(newType: SpellType) {
  if (newType === props.modelValue.type) {
    return;
  }
  emit("update:modelValue", { type: newType, labels: new Set<SpellLabel>() });
}

function updateLabel(label: SpellLabel, selected: boolean) {
  const newLabels = new Set(props.modelValue.labels);

  if (selected) {
    newLabels.add(label);
  } else {
    newLabels.delete(label);
  }

  emit("update:modelValue", { type: props.modelValue.type, labels: newLabels });
}

const modalColumns = [
  { name: "name", displayName: "Label", skipStackedTitle: false },
  { name: "selected", displayName: "Select", skipStackedTitle: false },
];

const labelsWithSelect: Ref<Record<SpellLabel, boolean>> = ref({} as Record<SpellLabel, boolean>);
const labelsWithSelectList: Ref<{ id: SpellLabel; name: string; selected: boolean }[]> = ref([]);
const simplifiedLabels: Ref<SpellLabel[]> = ref(new Array<SpellLabel>());

function updateLabelsWithSelect(newValue: SpellClassification) {
  const labelsForType = getAllowedLabels(newValue.type);

  labelsWithSelect.value = {} as Record<SpellLabel, boolean>;
  for (const label of labelsForType) {
    labelsWithSelect.value[label] = false;
  }

  for (const label of newValue.labels) {
    if (label in labelsWithSelect.value) {
      labelsWithSelect.value[label] = true;
    }
  }

  labelsWithSelectList.value = [];
  for (const [k, v] of Object.entries(labelsWithSelect.value)) {
    const lb = parseInt(k);
    labelsWithSelectList.value.push({ id: lb, name: printSpellLabel(lb), selected: v });
  }
}

function updateSimplifiedLabels(newValue: SpellClassification) {
  simplifiedLabels.value = [...getSimplifiedLabels(newValue.type, newValue.labels)];
  emit("update:simplifiedLabels", [...simplifiedLabels.value]);
}

watch(
  () => props.modelValue,
  (newValue) => {
    updateLabelsWithSelect(newValue);
    updateSimplifiedLabels(newValue);
  },
  { immediate: true },
);

function onModifyClick() {
  modal.showModal("modifyClassificationModal");
  searchTerm.value = "";
}
</script>

<template>
  <div>
    <div ref="contentContainerRef">
      <p class="mb-1">Classification</p>
      <div class="border p-2 rounded border-neutral-400">
        <div class="flex gap-4" :class="[sm.isEqualOrGreater.value ? '' : 'flex-col']">
          <SelectInput
            :modelValue="props.modelValue.type"
            :options="typeOptions"
            :disabled="props.disabled"
            title="Type"
            class="flex-1"
            @update:modelValue="updateType($event)"
          />
          <div class="flex-1">
            <div class="flex items-center mb-1">
              <div class="mr-2">Labels</div>
              <ActionButton v-if="!disabled" size="sm" @click="onModifyClick">Modify</ActionButton>
            </div>
            <span v-for="(label, i) in simplifiedLabels.sort((a, b) => b - a)" :key="i">
              {{ printSpellLabel(label) + (i !== simplifiedLabels.length - 1 ? ", " : "") }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <ModalWindow id="modifyClassificationModal" size="xs">
      <template #header> Modify labels</template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <div>
        <TableWithSearch
          v-model="searchTerm"
          :fields="modalColumns"
          :items="labelsWithSelectList"
          :stackedViewSize="ViewSize.zero"
        >
          <template #selected="{ id }: { id: SpellLabel }">
            <div>
              <input
                v-model="labelsWithSelect[id]"
                type="checkbox"
                class="w-5 h-5 accent-neutral-600"
                @input="updateLabel(id, !labelsWithSelect[id])"
              />
            </div>
          </template>
        </TableWithSearch>
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
