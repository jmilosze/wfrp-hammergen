<script setup lang="ts">
import { Attributes } from "../services/wh/attributes.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";

const props = defineProps<{
  title: string;
  cols: boolean;
  baseAttributes: Attributes;
  attributeAdvances: Attributes;
  species: SpeciesWithRegion;
}>();
</script>

<template>
  <div class="mb-1">{{ title }}</div>
  <div ref="contentContainerRef" class="flex justify-between text-left gap-4" :class="[cols ? '' : 'flex-col']">
    <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-5">Name</th>
            <th class="border-b border-neutral-300 py-2 px-5">Description</th>
          </tr>
        </thead>
        <tbody>
          <!--          <tr class="bg-white hover:bg-neutral-200">-->
          <!--            <td class="py-2 px-5 border-b border-neutral-300">{{ src.name }}</td>-->
          <!--            <td class="py-2 px-5 border-b border-neutral-300">{{ src.description }}</td>-->
          <!--          </tr>-->
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
