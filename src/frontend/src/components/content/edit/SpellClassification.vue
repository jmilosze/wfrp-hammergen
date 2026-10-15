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
} from "@/services/wh/content/spell.ts";
import SheetTable from "@/components/sheet/SheetTable.vue";
import SheetSelect from "@/components/sheet/SheetSelect.vue";
import SheetCell from "@/components/sheet/SheetCell.vue";
import LabelChips from "@/components/picker/LabelChips.vue";
import LabelAddSelect from "@/components/picker/LabelAddSelect.vue";
import { computed } from "vue";

defineProps<{ disabled?: boolean; stacked?: boolean }>();

const classification = defineModel<SpellClassification>({ required: true });

const typeOptions = spellTypeList.map((x) => ({ text: printSpellType(x), value: x }));

function updateType(newType: SpellType) {
  if (newType === classification.value.type) {
    return;
  }
  classification.value = { type: newType, labels: new Set<SpellLabel>() };
}

function toLabel(label: SpellLabel) {
  return { text: printSpellLabel(label), value: label };
}

// Labels are shown simplified: a full group of lores is one label (e.g. Any Colour Lore), removed as a whole.
const shownLabels = computed(() =>
  [...getSimplifiedLabels(classification.value.type, classification.value.labels)]
    .map(toLabel)
    .sort((a, b) => a.text.localeCompare(b.text)),
);

// Add offers the lore groups the type allows that are not complete yet, then the single labels not selected yet.
const addOptions = computed(() => {
  const allowed = getAllowedLabels(classification.value.type);
  const selected = classification.value.labels;
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
  const labels = new Set([...classification.value.labels, ...expandLabel(label)]);
  classification.value = { type: classification.value.type, labels: labels };
}

function removeLabel(label: SpellLabel) {
  const removed = expandLabel(label);
  const labels = new Set([...classification.value.labels].filter((x) => !removed.has(x)));
  classification.value = { type: classification.value.type, labels: labels };
}
</script>

<template>
  <div>
    <SheetTable title="Classification">
      <SheetSelect
        :modelValue="classification.type"
        :options="typeOptions"
        :disabled="disabled"
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
