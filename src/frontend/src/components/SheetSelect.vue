<script setup lang="ts" generic="T = string | number">
import { useId } from "vue";

// A labelled dropdown cell of a SheetTable.
defineProps<{
  title: string;
  options: { text: string; value: T }[];
  disabled?: boolean;
}>();

const value = defineModel<T>({ required: true });

const selectId = useId();
</script>

<template>
  <div
    class="flex items-stretch min-w-0 bg-white focus-within:outline-2 focus-within:-outline-offset-2 outline-neutral-700"
  >
    <label
      :for="selectId"
      data-sheet-label
      class="flex items-center shrink-0 min-w-32 px-2 border-r border-neutral-300 font-semibold whitespace-nowrap"
    >
      {{ title }}
    </label>
    <select
      :id="selectId"
      v-model="value"
      :disabled="disabled"
      class="flex-1 min-w-0 h-9 px-1 bg-white outline-none disabled:bg-neutral-200"
    >
      <option v-for="option in options" :key="String(option.value)" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<style scoped></style>
