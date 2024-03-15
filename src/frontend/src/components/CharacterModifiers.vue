<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
import CharacterModifiersAttributes from "./CharacterModifiersAttributes.vue";
import { computed, ref, watch } from "vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";
import { AttributeName, Attributes, copyAttributes, setAttributeValue } from "../services/wh/attributes.ts";

const props = defineProps<{
  disabled?: boolean;
  modelValue: Attributes;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: Attributes): void;
}>();

const modal = useModal();

const contentContainerRef = ref(null);
const sm = useElSize(ViewSize.sm, contentContainerRef);
const lg = useElSize(ViewSize.lg, contentContainerRef);

const inputClass = ref([
  "border",
  "border-neutral-300",
  "rounded",
  "w-full",
  "h-10",
  "px-2",
  "focus:outline-neutral-700",
  "focus:border-transparent",
  "focus:outline",
  "focus:outline-2",
  "disabled:bg-neutral-200",
  "text-center",
]);

const rows = computed(() => {
  if (lg.isEqualOrGreater.value) {
    return 1;
  } else if (sm.isEqualOrGreater.value) {
    return 3;
  } else {
    return 5;
  }
});

function updateAtts(event: Event, att: AttributeName) {
  const target = event.target as HTMLInputElement;
  const newAttributes = copyAttributes(props.modelValue);
  setAttributeValue(att, parseInt(target.value), newAttributes);
  emit("update:modelValue", newAttributes);
}
</script>

<template>
  <div ref="contentContainerRef">
    <div class="flex items-center mb-2">
      <div class="mb-1 mr-2">Character modifiers</div>
      <ActionButton size="sm" @click="modal.showModal('modifiersHelpModal')">What are modifiers?</ActionButton>
    </div>

    <CharacterModifiersAttributes :rows="rows">
      <template #WS>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.WS"
          @input="(event) => updateAtts(event, AttributeName.WS)"
        />
      </template>
      <template #BS>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.BS"
          @input="(event) => updateAtts(event, AttributeName.BS)"
        />
      </template>
      <template #S>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.S"
          @input="(event) => updateAtts(event, AttributeName.S)"
        />
      </template>
      <template #T>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.T"
          @input="(event) => updateAtts(event, AttributeName.T)"
        />
      </template>
      <template #I>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.I"
          @input="(event) => updateAtts(event, AttributeName.I)"
        />
      </template>
      <template #Ag>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.Ag"
          @input="(event) => updateAtts(event, AttributeName.Ag)"
        />
      </template>
      <template #Dex>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.Dex"
          @input="(event) => updateAtts(event, AttributeName.Dex)"
        />
      </template>
      <template #Int>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.Int"
          @input="(event) => updateAtts(event, AttributeName.Int)"
        />
      </template>
      <template #WP>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.WP"
          @input="(event) => updateAtts(event, AttributeName.WP)"
        />
      </template>
      <template #Fel>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="modelValue.Fel"
          @input="(event) => updateAtts(event, AttributeName.Fel)"
        />
      </template>
    </CharacterModifiersAttributes>
  </div>

  <ModalWindow id="modifiersHelpModal">
    <template #header> Character modifiers </template>
    <template #buttons>
      <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
    </template>
    <div>
      Talent modifiers are automatically added to character sheet in both edit and view modes. For example, if you add a
      talent that modifies the Size, it will automatically affect the number of Wounds. Sum of all Attribute modifiers
      is displayed in "other" row in character sheet.
    </div>
    <div>
      All characters have default size Average, by using size modifier you can change is to Small (-1), Large (+1) etc.
    </div>
  </ModalWindow>
</template>

<style scoped></style>
