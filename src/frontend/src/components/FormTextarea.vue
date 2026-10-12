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
  // bare: no border or rounded corners of its own, to fill a box (e.g. SectionCard) edge to edge; styled like an
  // editable sheet cell (faint yellow, white when disabled).
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
  <div class="w-full" :class="{ 'flex flex-col grow': bare }">
    <div class="flex items-center">
      <label v-if="title" :for="textareaId" class="mb-1 mr-2">{{ title }}</label>
      <slot />
    </div>
    <textarea
      :id="textareaId"
      v-model="value"
      class="w-full p-2 focus:outline-neutral-700 focus:outline-2"
      :class="[
        size ? heightClasses[size] : 'h-36',
        { grow: bare },
        bare
          ? 'block focus:-outline-offset-2 bg-primary-50 disabled:bg-white disabled:text-neutral-900 disabled:opacity-100'
          : 'border border-neutral-300 rounded focus:border-transparent bg-white disabled:bg-neutral-200',
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
