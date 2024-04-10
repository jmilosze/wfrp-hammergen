<script setup lang="ts">
import { Attributes, getAttributes, sumAttributes } from "../services/wh/attributes.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import FormInput from "./FormInput.vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";
import { computed, ref } from "vue";

const props = defineProps<{
  title: string;
  cols: boolean;
  species: SpeciesWithRegion;
  otherAttributes: Attributes;
}>();

const attributeRolls = defineModel<Attributes>("attributeRolls", { required: true });
const attributeAdvances = defineModel<Attributes>("attributeAdvances", { required: true });

const contentContainerRef = ref(null);
const smELSize = useElSize(ViewSize.sm, contentContainerRef);
const mdELSize = useElSize(ViewSize.md, contentContainerRef);

const racial = computed(() => {
  return getAttributes(props.species);
});

const total = computed(() => {
  return sumAttributes(attributeRolls.value, attributeAdvances.value, props.otherAttributes, racial.value);
});
</script>

<template>
  <div class="mb-1">{{ title }}</div>
  <div ref="contentContainerRef" class="w-full">
    <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit w-full">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-2">Source</th>
            <th class="border-b border-neutral-300 py-2 px-2">WS</th>
            <th class="border-b border-neutral-300 py-2 px-2">BS</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white hover:bg-neutral-200">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Rolls</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
          </tr>
          <tr class="bg-white hover:bg-neutral-200">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Racial</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              {{ racial.WS }}
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              {{ racial.BS }}
            </td>
          </tr>
          <tr class="bg-white hover:bg-neutral-200">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Other</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.WS }}
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.BS }}
            </td>
          </tr>
          <tr class="bg-white hover:bg-neutral-200">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Advances</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
          </tr>
          <tr class="bg-white hover:bg-neutral-200">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Sum</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="total.WS" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="total.WS" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
