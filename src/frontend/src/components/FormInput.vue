<script setup lang="ts" generic="T = number | string">
import { ValidationStatus } from "../utils/validation.ts";
import { computed } from "vue";

const props = defineProps<{
  modelValue: T;
  type?: "text" | "password" | "number";
  title?: string;
  disabled?: boolean;
  validationStatus?: ValidationStatus;
  centerText?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: T): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    if (props.type === "number" && typeof value !== "number") {
      emit("update:modelValue", Number.NaN as T);
      return;
    }
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div>
    <p v-if="title" class="mb-1">{{ title }}</p>
    <div class="flex items-stretch justify-between">
      <div class="flex-auto">
        <input
          v-model="value"
          :type="type ? type : 'text'"
          class="border border-neutral-300 rounded w-full h-10 px-2 focus:outline-neutral-700 focus:border-transparent focus:outline focus:outline-2 disabled:bg-neutral-200"
          :class="centerText ? ['text-center'] : []"
          :disabled="disabled ? disabled : false"
        />
      </div>
      <div>
        <slot></slot>
      </div>
    </div>
    <div v-if="validationStatus" class="text-sm text-red-600 mt-1" :class="[validationStatus.valid ? 'hidden' : '']">
      {{ validationStatus.message }}
    </div>
  </div>
</template>
