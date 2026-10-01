<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useElementSize } from "@vueuse/core";

const attributeNames = ["WS", "BS", "S", "T", "I", "Ag", "Dex", "Int", "WP", "Fel"];

const container = useTemplateRef<HTMLElement>("container");
const { width } = useElementSize(container);

// One table row of 10, two of 5 or five of 2 characteristics, depending on the available width.
const attributeRows = computed(() => {
  const perRow = width.value >= 1024 ? 10 : width.value >= 672 ? 5 : 2;
  const rows: string[][] = [];
  for (let i = 0; i < attributeNames.length; i += perRow) {
    rows.push(attributeNames.slice(i, i + perRow));
  }
  return rows;
});

const thClass = ["px-2", "py-2", "border-b", "border-neutral-300", "text-left"];
const tdClass = ["px-2", "py-2", "border-b", "border-neutral-300"];
</script>

<template>
  <div ref="container" class="flex flex-col gap-4">
    <div
      v-for="(row, index) in attributeRows"
      :key="index"
      class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit"
    >
      <table class="w-full">
        <thead>
          <tr>
            <th v-for="attributeName in row" :key="attributeName" :class="thClass">
              {{ attributeName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td v-for="attributeName in row" :key="attributeName" :class="tdClass">
              <slot :name="attributeName" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
    </div>
  </div>
</template>

<style scoped></style>
