<script setup lang="ts">
import { ValidationStatus } from "../utils/validation.ts";
import { computed } from "vue";

const props = defineProps<{
  title?: string;
  disabled?: boolean;
  validationStatus: ValidationStatus;
  modelValue: string;
  minH?: number;
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
      :class="[minH ? 'h-' + minH : 'h-36']"
      :disabled="disabled ? disabled : false"
    />
    <p class="text-sm text-red-600" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </p>
  </div>
</template>
