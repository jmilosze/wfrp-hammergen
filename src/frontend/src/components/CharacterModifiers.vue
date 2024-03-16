<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
import CharacterModifiersAttributes from "./CharacterModifiersAttributes.vue";
import { computed, ref } from "vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";
import { AttributeName, Attributes, copyAttributes, setAttributeValue } from "../services/wh/attributes.ts";
import SelectInput from "./SelectInput.vue";

const props = defineProps<{
  disabled?: boolean;
  attributes: Attributes;
  size: number;
  movement: number;
}>();

const emit = defineEmits<{
  (e: "update:attributes", attributes: Attributes): void;
  (e: "update:size", size: number): void;
  (e: "update:movement", movement: number): void;
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
  const newAttributes = copyAttributes(props.attributes);
  setAttributeValue(att, parseInt(target.value), newAttributes);
  emit("update:attributes", newAttributes);
}

const sizeOptions = [
  { text: "2", value: 2 },
  { text: "1", value: 1 },
  { text: "0", value: 0 },
  { text: "-1", value: -1 },
  { text: "-2", value: -2 },
];
const movementOptions = [
  { text: "2", value: 2 },
  { text: "1", value: 1 },
  { text: "0", value: 0 },
  { text: "-1", value: -1 },
  { text: "-2", value: -2 },
];
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
          :value="attributes.WS"
          @input="(event) => updateAtts(event, AttributeName.WS)"
        />
      </template>
      <template #BS>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.BS"
          @input="(event) => updateAtts(event, AttributeName.BS)"
        />
      </template>
      <template #S>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.S"
          @input="(event) => updateAtts(event, AttributeName.S)"
        />
      </template>
      <template #T>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.T"
          @input="(event) => updateAtts(event, AttributeName.T)"
        />
      </template>
      <template #I>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.I"
          @input="(event) => updateAtts(event, AttributeName.I)"
        />
      </template>
      <template #Ag>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.Ag"
          @input="(event) => updateAtts(event, AttributeName.Ag)"
        />
      </template>
      <template #Dex>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.Dex"
          @input="(event) => updateAtts(event, AttributeName.Dex)"
        />
      </template>
      <template #Int>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.Int"
          @input="(event) => updateAtts(event, AttributeName.Int)"
        />
      </template>
      <template #WP>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.WP"
          @input="(event) => updateAtts(event, AttributeName.WP)"
        />
      </template>
      <template #Fel>
        <input
          type="number"
          :class="inputClass"
          :disabled="props.disabled ? props.disabled : false"
          :value="attributes.Fel"
          @input="(event) => updateAtts(event, AttributeName.Fel)"
        />
      </template>
    </CharacterModifiersAttributes>

    <div class="justify-between text-left gap-4" :class="[lg.isEqualOrGreater.value ? 'flex' : 'flex-col']">
      <SelectInput
        :modelValue="props.size"
        :options="sizeOptions"
        title="Character size"
        class="flex-1 my-4"
        :disabled="props.disabled ? props.disabled : false"
        @update:modelValue="(event) => emit('update:size', event)"
      />
      <SelectInput
        :modelValue="props.movement"
        :options="movementOptions"
        title="Character movement"
        :disabled="props.disabled ? props.disabled : false"
        class="flex-1 my-4"
        @update:modelValue="(event) => emit('update:movement', event)"
      />
    </div>
    <!--    <p class="text-sm text-red-600" :class="[selectedSourcesValid ? 'hidden' : '']">Some of the sources are invalid.</p>-->
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
