<script setup lang="ts">
import {
  expandLabel,
  getAllowedLabels,
  getSimplifiedLabels,
  loreGroups,
  printSpellLabel,
  printSpellType,
  SpellClassification,
  SpellLabel,
  SpellType,
  spellTypeList,
} from "../../../services/wh/content/spell.ts";
import SheetTable from "../../sheet/SheetTable.vue";
import SheetSelect from "../../sheet/SheetSelect.vue";
import SheetCell from "../../sheet/SheetCell.vue";
import LabelChips from "../../picker/LabelChips.vue";
import LabelAddSelect from "../../picker/LabelAddSelect.vue";
import { computed } from "vue";

const props = defineProps<{ modelValue: SpellClassification; disabled?: boolean; stacked?: boolean }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SpellClassification): void;
}>();

const typeOptions = spellTypeList.map((x) => ({ text: printSpellType(x), value: x }));

function updateType(newType: SpellType) {
  if (newType === props.modelValue.type) {
    return;
  }
  emit("update:modelValue", { type: newType, labels: new Set<SpellLabel>() });
}

function toLabel(label: SpellLabel) {
  return { text: printSpellLabel(label), value: label };
}

// Labels are shown simplified: a full group of lores is one label (e.g. Any Colour Lore), removed as a whole.
const shownLabels = computed(() =>
  [...getSimplifiedLabels(props.modelValue.type, props.modelValue.labels)]
    .map(toLabel)
    .sort((a, b) => a.text.localeCompare(b.text)),
);

// Add offers the lore groups the type allows that are not complete yet, then the single labels not selected yet.
const addOptions = computed(() => {
  const allowed = getAllowedLabels(props.modelValue.type);
  const selected = props.modelValue.labels;
  const groups = [...loreGroups]
    .filter(([, lores]) => [...lores].every((x) => allowed.includes(x)) && [...lores].some((x) => !selected.has(x)))
    .map(([group]) => toLabel(group));
  const singles = allowed
    .filter((x) => !selected.has(x))
    .map(toLabel)
    .sort((a, b) => a.text.localeCompare(b.text));
  return [...groups, ...singles];
});

function addLabel(label: SpellLabel) {
  const labels = new Set([...props.modelValue.labels, ...expandLabel(label)]);
  emit("update:modelValue", { type: props.modelValue.type, labels: labels });
}

function removeLabel(label: SpellLabel) {
  const removed = expandLabel(label);
  const labels = new Set([...props.modelValue.labels].filter((x) => !removed.has(x)));
  emit("update:modelValue", { type: props.modelValue.type, labels: labels });
}
</script>

<template>
  <div>
    <SheetTable title="Classification">
      <SheetSelect
        :modelValue="props.modelValue.type"
        :options="typeOptions"
        :disabled="props.disabled"
        title="Type"
        @update:modelValue="updateType($event)"
      />
    </SheetTable>
    <SheetTable class="-mt-px">
      <SheetCell title="Labels">
        <LabelChips :labels="shownLabels" :removable="!disabled" class="py-1" @remove="removeLabel" />
      </SheetCell>
      <template v-if="!disabled" #actions>
        <LabelAddSelect :options="addOptions" ariaLabel="Add label" @add="addLabel" />
      </template>
    </SheetTable>
  </div>
</template>

<style scoped></style>
