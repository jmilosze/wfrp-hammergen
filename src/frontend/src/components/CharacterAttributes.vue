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

const thClass = ["px-2", "py-2", "border-b", "border-neutral-300"];
const tdClassNoInput = ["px-4", "py-2", "border-b", "border-neutral-300"];
const tdClass = ["px-2", "py-2", "border-b", "border-neutral-300"];
</script>

<template>
  <div class="mb-1">{{ title }}</div>
  <div ref="contentContainerRef" class="w-full">
    <div v-if="!lgELSize.isEqualOrGreater.value" class="bg-neutral-50 rounded-xl border border-neutral-300 w-full">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th :class="thClass">Source</th>
            <th :class="thClass">WS</th>
            <th :class="thClass">BS</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td :class="tdClass">Rolls</td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">Racial</td>
            <td :class="tdClassNoInput">
              {{ racial.WS }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.BS }}
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">Other</td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.WS }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.BS }}
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">Advances</td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">Sum</td>
            <td :class="tdClassNoInput">
              {{ total.WS }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.BS }}
            </td>
          </tr>
        </tbody>
      </table>
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th :class="thClass">S</th>
            <th :class="thClass">T</th>
            <th :class="thClass">I</th>
            <th :class="thClass">Ag</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.S" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.T" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.I" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.Ag" />
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClassNoInput">
              {{ racial.S }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.T }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.I }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.Ag }}
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClassNoInput">
              {{ otherAttributes.S }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.T }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.I }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.Ag }}
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.S" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.T" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.I" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.Ag" />
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClassNoInput">
              {{ total.S }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.T }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.I }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.Ag }}
            </td>
          </tr>
        </tbody>
      </table>
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th :class="thClass">Dex</th>
            <th :class="thClass">Int</th>
            <th :class="thClass">WP</th>
            <th :class="thClass">Fel</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.Dex" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.Int" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.WP" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.Fel" />
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClassNoInput">
              {{ racial.Dex }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.Int }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.WP }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.Fel }}
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClassNoInput">
              {{ otherAttributes.Dex }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.Int }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.WP }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.Fel }}
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.Dex" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.Int" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.WP" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.Fel" />
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClassNoInput">
              {{ total.Dex }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.Int }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.WP }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.Fel }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
    <div v-else class="bg-neutral-50 rounded-xl border border-neutral-300 w-full">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th :class="thClass">Source</th>
            <th :class="thClass">WS</th>
            <th :class="thClass">BS</th>
            <th :class="thClass">S</th>
            <th :class="thClass">T</th>
            <th :class="thClass">I</th>
            <th :class="thClass">Ag</th>
            <th :class="thClass">Dex</th>
            <th :class="thClass">Int</th>
            <th :class="thClass">WP</th>
            <th :class="thClass">Fel</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td :class="tdClass">Rolls</td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.WS" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.S" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.T" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.I" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.Ag" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.Dex" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.Int" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.WP" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeRolls.Fel" />
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">Racial</td>
            <td :class="tdClassNoInput">
              {{ racial.WS }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.BS }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.S }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.T }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.I }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.Ag }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.Dex }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.Int }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.WP }}
            </td>
            <td :class="tdClassNoInput">
              {{ racial.Fel }}
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">Other</td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.WS }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.BS }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.S }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.T }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.I }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.Ag }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.Dex }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.Int }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.WP }}
            </td>
            <td :class="tdClassNoInput">
              {{ otherAttributes.Fel }}
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">Adv</td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.WS" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.S" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.T" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.I" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.Ag" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.Dex" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.Int" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.WP" />
            </td>
            <td :class="tdClass">
              <FormInput type="number" :modelValue="attributeAdvances.Fel" />
            </td>
          </tr>
          <tr class="bg-white">
            <td :class="tdClass">Sum</td>
            <td :class="tdClassNoInput">
              {{ total.WS }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.BS }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.S }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.T }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.I }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.Ag }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.Dex }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.Int }}
            </td>
            <td :class="tdClassNoInput">
              {{ total.WP }}
            </td>
            <td :class="tdClassNoInput">
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
