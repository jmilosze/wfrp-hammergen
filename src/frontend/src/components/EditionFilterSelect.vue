<script setup lang="ts">
import { EditionFilter } from "../utils/editionFilter.ts";

const model = defineModel<EditionFilter>({ required: true });

const options: { text: string; value: EditionFilter }[] = [
  { text: "5e and 4e", value: "both" },
  { text: "5e only", value: "5e" },
  { text: "4e only", value: "4e" },
];
</script>

<template>
  <select
    v-model="model"
    aria-label="Show content of edition"
    class="mr-2 mb-2 h-10 shrink-0 border border-neutral-300 rounded px-2 bg-white focus:outline-neutral-700"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">{{ option.text }}</option>
  </select>
</template>

<style scoped></style>
