<script setup lang="ts" generic="T = string | number">
import { useId } from "vue";
import { ValidationStatus } from "@/utils/validation.ts";

// A labelled input cell of a SheetTable.
const props = defineProps<{
  title: string;
  type?: "text" | "number";
  disabled?: boolean;
  validationStatus?: ValidationStatus;
  maxlength?: number;
}>();

const inputId = useId();
const errorId = useId();

// A number input that isn't a number (e.g. emptied) gives NaN, which validation then reports.
const value = defineModel<T>({
  required: true,
  set: (value) => (props.type === "number" && typeof value !== "number" ? (Number.NaN as T) : value),
});
</script>

<template>
  <div class="flex flex-col min-w-0 bg-white">
    <div class="flex grow items-stretch focus-within:outline-2 focus-within:-outline-offset-2 outline-neutral-700">
      <label
        :for="inputId"
        data-sheet-label
        class="flex items-center shrink-0 min-w-32 px-2 border-r border-neutral-300 font-semibold whitespace-nowrap"
      >
        {{ title }}
      </label>
      <input
        :id="inputId"
        v-model="value"
        :type="type ?? 'text'"
        :disabled="disabled"
        :maxlength="maxlength"
        :aria-invalid="validationStatus && !validationStatus.valid ? 'true' : undefined"
        :aria-describedby="validationStatus && !validationStatus.valid ? errorId : undefined"
        class="flex-1 min-w-0 min-h-9 px-2 outline-none bg-editable disabled:bg-white disabled:text-neutral-900 disabled:opacity-100"
      />
    </div>
    <div
      v-if="validationStatus"
      :id="errorId"
      role="alert"
      class="text-sm text-error px-2 py-1"
      :class="[validationStatus.valid ? 'hidden' : '']"
    >
      {{ validationStatus.message }}
    </div>
  </div>
</template>
