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
const lgELSize = useElSize(ViewSize.lg, contentContainerRef);

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
    <div v-if="!lgELSize.isEqualOrGreater.value" class="bg-neutral-50 rounded-xl border border-neutral-300 w-full">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-2">Source</th>
            <th class="border-b border-neutral-300 py-2 px-2">WS</th>
            <th class="border-b border-neutral-300 py-2 px-2">BS</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Rolls</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Racial</td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.WS }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.BS }}
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Other</td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.WS }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.BS }}
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Adv</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 pl-2 pr-1 border-b border-neutral-300">Sum</td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              {{ total.WS }}
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              {{ total.BS }}
            </td>
          </tr>
        </tbody>
      </table>
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-2">S</th>
            <th class="border-b border-neutral-300 py-2 px-2">T</th>
            <th class="border-b border-neutral-300 py-2 px-2">I</th>
            <th class="border-b border-neutral-300 py-2 px-2">Ag</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.S" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.T" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.I" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.Ag" />
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.S }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.T }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.I }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.Ag }}
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.S }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.T }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.I }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.Ag }}
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.S" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.T" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.I" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.Ag" />
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ total.S }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ total.T }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ total.I }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ total.Ag }}
            </td>
          </tr>
        </tbody>
      </table>
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="border-b border-neutral-300 py-2 px-2">Dex</th>
            <th class="border-b border-neutral-300 py-2 px-2">Int</th>
            <th class="border-b border-neutral-300 py-2 px-2">WP</th>
            <th class="border-b border-neutral-300 py-2 px-2">Fel</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.Dex" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.Int" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.WP" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeRolls.Fel" />
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.Dex }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.Int }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.WP }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ racial.Fel }}
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.Dex }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.Int }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.WP }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ otherAttributes.Fel }}
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.Dex" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.Int" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.WP" />
            </td>
            <td class="py-2 px-1 border-b border-neutral-300 max-w-12">
              <FormInput type="number" :modelValue="attributeAdvances.Fel" />
            </td>
          </tr>
          <tr class="bg-white">
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ total.Dex }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ total.Int }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ total.WP }}
            </td>
            <td class="py-2 px-3 border-b border-neutral-300 max-w-12">
              {{ total.Fel }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
