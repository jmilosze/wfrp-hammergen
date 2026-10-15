<script setup lang="ts" generic="T = number | string">
import { ValidationStatus } from "../../utils/validation.ts";
import { computed, useId } from "vue";

const props = defineProps<{
  modelValue: T;
  type?: "text" | "password" | "number";
  title?: string;
  disabled?: boolean;
  validationStatus?: ValidationStatus;
  centerText?: boolean;
  maxlength?: number;
  step?: number;
  // bare: no border or rounded corners, filling a table cell; styled like an editable sheet cell (faint yellow, white
  // when disabled).
  bare?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: T): void;
}>();

const inputId = useId();
const errorId = useId();

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
    <label v-if="title" :for="inputId" class="block mb-1">{{ title }}</label>
    <div class="flex items-stretch justify-between">
      <div class="flex-auto">
        <input
          :id="inputId"
          v-model="value"
          :type="type ?? 'text'"
          :disabled="disabled"
          :maxlength="maxlength"
          :step="step"
          :aria-invalid="validationStatus && !validationStatus.valid ? 'true' : undefined"
          :aria-describedby="validationStatus && !validationStatus.valid ? errorId : undefined"
          class="w-full h-10 px-2 focus:outline-neutral-700 focus:outline-2"
          :class="[
            centerText ? 'text-center' : '',
            bare
              ? 'block focus:-outline-offset-2 bg-editable disabled:bg-white disabled:text-neutral-900 disabled:opacity-100'
              : 'border border-neutral-300 rounded bg-white focus:border-transparent disabled:bg-neutral-200',
          ]"
        />
      </div>
      <div>
        <slot />
      </div>
    </div>
    <div
      v-if="validationStatus"
      :id="errorId"
      role="alert"
      class="text-sm text-error mt-1"
      :class="[validationStatus.valid ? 'hidden' : '']"
    >
      {{ validationStatus.message }}
    </div>
  </div>
</template>
