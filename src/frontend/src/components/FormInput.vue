<script setup lang="ts">
import { ValidationStatus } from "../utils/validation.ts";
import { computed } from "vue";

const props = defineProps<{
  type?: "text" | "password" | "number";
  title?: string;
  disabled?: boolean;
  validationStatus: ValidationStatus;
  modelValue: string | number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string | number): void;
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
    <p v-if="title" class="mb-1">{{ title }}</p>
    <div class="flex items-stretch justify-between">
      <div class="flex-auto">
        <input
          v-model="value"
          :type="type ? type : 'text'"
          class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
          :disabled="disabled ? disabled : false"
        />
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
    <p class="text-sm text-red-600" :class="[validationStatus.valid ? 'hidden' : '']">{{ validationStatus.message }}</p>
  </div>
</template>
