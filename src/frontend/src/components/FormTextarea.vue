<script setup lang="ts">
import { ValidationStatus } from "../utils/validation.ts";
import { computed, useId } from "vue";

type BoxHeight = "sm" | "md";

const heightClasses: Record<BoxHeight, string> = {
  sm: "h-18",
  md: "h-36",
};

const props = defineProps<{
  title?: string;
  disabled?: boolean;
  validationStatus: ValidationStatus;
  modelValue: string;
  size?: BoxHeight;
  // bare: no border or rounded corners of its own, to fill a box (e.g. SectionCard) edge to edge.
  bare?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();

const textareaId = useId();
const errorId = useId();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div class="w-full">
    <div class="flex items-center">
      <label v-if="title" :for="textareaId" class="mb-1 mr-2">{{ title }}</label>
      <slot />
    </div>
    <textarea
      :id="textareaId"
      v-model="value"
      class="w-full p-2 bg-white focus:outline-neutral-700 focus:outline-2 disabled:bg-neutral-200"
      :class="[
        size ? heightClasses[size] : 'h-36',
        bare ? 'block focus:-outline-offset-2' : 'border border-neutral-300 rounded focus:border-transparent',
      ]"
      :disabled="disabled"
      :aria-invalid="validationStatus && !validationStatus.valid ? 'true' : undefined"
      :aria-describedby="validationStatus && !validationStatus.valid ? errorId : undefined"
    />
    <p
      :id="errorId"
      role="alert"
      class="text-sm text-danger-600"
      :class="[validationStatus.valid ? 'hidden' : '', bare ? 'px-2 py-1' : '']"
    >
      {{ validationStatus.message }}
    </p>
  </div>
</template>
