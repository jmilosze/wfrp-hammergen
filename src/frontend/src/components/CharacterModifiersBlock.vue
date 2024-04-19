<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
import CharacterModifiersAttributes from "./CharacterModifiersAttributes.vue";
import { computed, ref } from "vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";
import { AttributeName, setAttributeValue } from "../services/wh/attributes.ts";
import SelectInput from "./SelectInput.vue";
import { CharacterModifiers } from "../services/wh/characterModifiers.ts";
import FormInput from "./FormInput.vue";

const props = defineProps<{
  disabled?: boolean;
  modelValue: CharacterModifiers;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modifiers: CharacterModifiers): void;
}>();

const modal = useModal();

const contentContainerRef = ref(null);
const sm = useElSize(ViewSize.sm, contentContainerRef);
const lg = useElSize(ViewSize.lg, contentContainerRef);

const rows = computed(() => {
  if (lg.isEqualOrGreater.value) {
    return 1;
  } else if (sm.isEqualOrGreater.value) {
    return 2;
  } else {
    return 5;
  }
});

function updateAttributes(attribute: AttributeName, newValue: number) {
  const newModifiers = props.modelValue.copy();
  setAttributeValue(attribute, newValue, newModifiers.attributes);
  emit("update:modelValue", newModifiers);
}

function updateSize(newSize: number) {
  const newModifiers = props.modelValue.copy();
  newModifiers.size = newSize;
  emit("update:modelValue", newModifiers);
}

function updateMovement(newMovement: number) {
  const newModifiers = props.modelValue.copy();
  newModifiers.movement = newMovement;
  emit("update:modelValue", newModifiers);
}

const sizeOptions = [
  { text: "3", value: 3 },
  { text: "2", value: 2 },
  { text: "1", value: 1 },
  { text: "0", value: 0 },
  { text: "-1", value: -1 },
  { text: "-2", value: -2 },
  { text: "-3", value: -3 },
];
const movementOptions = [
  { text: "3", value: 3 },
  { text: "2", value: 2 },
  { text: "1", value: 1 },
  { text: "0", value: 0 },
  { text: "-1", value: -1 },
  { text: "-2", value: -2 },
  { text: "-3", value: -3 },
];

const validAtts = computed(() => {
  return props.modelValue.validateAttributes();
});
</script>

<template>
  <div ref="contentContainerRef">
    <div class="flex items-center mb-1">
      <div class="mr-2">Character modifiers</div>
      <ActionButton size="sm" @click="modal.showModal('modifiersHelpModal')">What are modifiers?</ActionButton>
    </div>

    <CharacterModifiersAttributes :rows="rows">
      <template #WS>
        <FormInput
          :modelValue="modelValue.attributes.WS"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.WS, $event)"
        />
      </template>
      <template #BS>
        <FormInput
          :modelValue="modelValue.attributes.BS"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.BS, $event)"
        />
      </template>
      <template #S>
        <FormInput
          :modelValue="modelValue.attributes.S"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.S, $event)"
        />
      </template>
      <template #T>
        <FormInput
          :modelValue="modelValue.attributes.T"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.T, $event)"
        />
      </template>
      <template #I>
        <FormInput
          :modelValue="modelValue.attributes.I"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.I, $event)"
        />
      </template>
      <template #Ag>
        <FormInput
          :modelValue="modelValue.attributes.Ag"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.Ag, $event)"
        />
      </template>
      <template #Dex>
        <FormInput
          :modelValue="modelValue.attributes.Dex"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.Dex, $event)"
        />
      </template>
      <template #Int>
        <FormInput
          :modelValue="modelValue.attributes.Int"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.Int, $event)"
        />
      </template>
      <template #WP>
        <FormInput
          :modelValue="modelValue.attributes.WP"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.WP, $event)"
        />
      </template>
      <template #Fel>
        <FormInput
          :modelValue="modelValue.attributes.Fel"
          type="number"
          :disabled="props.disabled"
          @update:modelValue="updateAttributes(AttributeName.Fel, $event)"
        />
      </template>
    </CharacterModifiersAttributes>
    <p class="text-sm text-red-600 mt-1" :class="[validAtts.valid ? 'hidden' : '']">{{ validAtts.message }}</p>

    <div class="justify-between text-left gap-4" :class="[lg.isEqualOrGreater.value ? 'flex' : 'flex-col']">
      <SelectInput
        :modelValue="modelValue.size"
        :options="sizeOptions"
        title="Character size"
        class="flex-1 mt-4"
        :disabled="props.disabled ? props.disabled : false"
        @update:modelValue="(event) => updateSize(event)"
      />
      <SelectInput
        :modelValue="modelValue.movement"
        :options="movementOptions"
        title="Character movement"
        :disabled="props.disabled ? props.disabled : false"
        class="flex-1 mt-4"
        @update:modelValue="(event) => updateMovement(event)"
      />
    </div>
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
