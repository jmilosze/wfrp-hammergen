<script setup lang="ts">
import { printSpellType, SpellClassification, SpellType, spellTypeList } from "../services/wh/spell.ts";
import SelectInput from "./SelectInput.vue";
import DoubleRadioButton from "./DoubleRadioButton.vue";
import { computed, ref } from "vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";

const props = defineProps<{ modelValue: SpellClassification; disabled?: boolean; stacked?: boolean }>();

const emit = defineEmits<{
  (e: "update:modelValue", value: SpellClassification): void;
}>();

const contentContainerRef = ref(null);
const sm = useElSize(ViewSize.sm, contentContainerRef);

const typeOptions = spellTypeList.map((x) => ({ text: printSpellType(x), value: x }));

function updateType(newType: SpellType) {
  if (newType === props.modelValue.type) {
    return;
  }
  emit("update:modelValue", { type: newType, labels: [] });
}

const canBeRitual = computed(() => {
  return props.modelValue.type === SpellType.SpellTypeLore;
});

// watch(
//   () => props.modelValue,
//   (newVal) => {
//     classification.value = newVal;
//   },
//   { immediate: true },
// );
</script>

<template>
  <div ref="contentContainerRef">
    <div class="mr-2">Classification</div>
    <div class="border p-2 rounded border-neutral-300 bg-neutral-100">
      <div class="flex gap-4" :class="[sm.isEqualOrGreater.value ? '' : 'flex-col']">
        <SelectInput
          :modelValue="props.modelValue.type"
          :options="typeOptions"
          :disabled="props.disabled"
          title="Type"
          class="flex-1"
          @update:modelValue="updateType($event)"
        />
        <div class="flex-1" :class="canBeRitual ? [] : ['invisible']">
          <p class="mb-3">Ritual</p>
          <DoubleRadioButton trueText="Yes" falseText="No" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
