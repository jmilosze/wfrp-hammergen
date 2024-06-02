<script setup lang="ts">
import {
  getSimplifiedLabels,
  printSpellLabel,
  printSpellType,
  SpellClassification,
  SpellLabel,
  SpellType,
  spellTypeList,
} from "../services/wh/spell.ts";
import SelectInput from "./SelectInput.vue";
import DoubleRadioButton from "./DoubleRadioButton.vue";
import { computed, ref, watch } from "vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";

const props = defineProps<{ modelValue: SpellClassification; disabled?: boolean; stacked?: boolean }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SpellClassification): void;
  (e: "update:summary", value: string): void;
}>();

const contentContainerRef = ref(null);
const sm = useElSize(ViewSize.sm, contentContainerRef);

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

const canBeRitual = computed(() => {
  return props.modelValue.type === SpellType.SpellTypeLore;
});

const isRitual = ref(false);
const displayLabels = ref("");

function updateDisplayLabels(simplifiedLabels: Set<SpellLabel>) {
  const labelsWithoutRitual = new Set(simplifiedLabels);
  labelsWithoutRitual.delete(SpellLabel.SpellLabelRitual);
  displayLabels.value = [...labelsWithoutRitual]
    .sort()
    .map((x) => printSpellLabel(x))
    .join(", ");
}

function updateSummary(simplifiedLabels: Set<SpellLabel>) {
  const summary = [...simplifiedLabels].sort().map((x) => printSpellLabel(x));
  summary.unshift(printSpellType(props.modelValue.type));
  emit("update:summary", summary.join(", "));
}

watch(
  () => props.modelValue,
  (newValue) => {
    isRitual.value = newValue.labels.has(SpellLabel.SpellLabelRitual);
    const simplifiedLables = getSimplifiedLabels(newValue.type, newValue.labels);
    updateDisplayLabels(simplifiedLables);
    updateSummary(simplifiedLables);
  },
  { immediate: true },
);
</script>

<template>
  <div ref="contentContainerRef">
    <div class="mr-2">Classification</div>
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
          <p class="mb-3">Ritual</p>
          <DoubleRadioButton
            trueText="Yes"
            falseText="No"
            :modelValue="isRitual"
            :disabled="props.disabled || !canBeRitual"
            @update:modelValue="updateLabel(SpellLabel.SpellLabelRitual, $event)"
          />
        </div>
      </div>
      <div class="mt-4">
        <p>Labels</p>
        <p>{{ displayLabels }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
