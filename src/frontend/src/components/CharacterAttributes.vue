<script setup lang="ts">
import { Attributes } from "../services/wh/attributes.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import FormInput from "./FormInput.vue";

const props = defineProps<{
  title: string;
  cols: boolean;
  species: SpeciesWithRegion;
}>();

const attributeRolls = defineModel<Attributes>("attributeRolls", { required: true });
const attributeAdvances = defineModel<Attributes>("attributeAdvances", { required: true });
</script>

<template>
  <div class="mb-1">{{ title }}</div>
  <div ref="contentContainerRef" class="flex justify-between text-left gap-4" :class="[cols ? '' : 'flex-col']">
    <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit w-full">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 pl-2 pr-1">Att</th>
            <th class="border-b border-neutral-300 py-2 px-1">Rolls</th>
            <th class="border-b border-neutral-300 py-2 px-1">Racial</th>
            <th class="border-b border-neutral-300 py-2 px-1">Other</th>
            <th class="border-b border-neutral-300 py-2 px-1">Adv</th>
            <th class="border-b border-neutral-300 py-2 pl-1 pr-2">Sum</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white hover:bg-neutral-200">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">WS</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">100</td>
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">100</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">100</td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
