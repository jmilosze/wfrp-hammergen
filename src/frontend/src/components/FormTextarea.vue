<script setup lang="ts">
import { ValidationStatus } from "../utils/validation.ts";
import { computed } from "vue";

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
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();

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
      <p v-if="title" class="mb-1 mr-2">{{ title }}</p>
      <slot />
    </div>
    <textarea
      v-model="value"
      class="border border-neutral-300 rounded w-full p-2 focus:outline-neutral-700 focus:border-transparent focus:outline-2 disabled:bg-neutral-200"
      :class="size ? heightClasses[size] : 'h-36'"
      :disabled="disabled ? disabled : false"
    />
    <p class="text-sm text-red-600" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </p>
  </div>
</template>
