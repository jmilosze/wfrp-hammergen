<script setup lang="ts">
import { computed } from "vue";
import { characteristicList, getAttributeValue, printAttributeName } from "@/services/wh/core/attributes.ts";
import { printSpeciesWithRegion } from "@/services/wh/core/species.ts";
import {
  guidedCareer5e,
  GuidedContext5e,
  guidedPreview5e,
  GuidedState5e,
} from "@/services/wh/character/generation/5e/guided5e.ts";

// The character so far (Q2 of step 3), beside the step: species and career, the characteristics, Wounds, Movement,
// Fate and Fortune with the bonuses earned so far.
const props = defineProps<{ state: GuidedState5e; context: GuidedContext5e }>();

const character = computed(() => guidedPreview5e(props.state, props.context));
const career = computed(() => guidedCareer5e(props.state, props.context));
const attributes = computed(() => character.value?.getTotalAttributes() ?? null);
const rolled = computed(() => props.state.characteristics.method !== null);
</script>

<template>
  <div class="flex flex-col gap-2 rounded border border-neutral-300 bg-white p-3 text-sm">
    <div class="font-semibold">Your character so far</div>
    <p v-if="character === null" class="text-neutral-700">It takes shape here as you go.</p>
    <template v-else>
      <div>
        {{ printSpeciesWithRegion(character.species) }}<template v-if="career !== null">, {{ career.name }}</template>
      </div>
      <table v-if="rolled && attributes !== null" class="w-full text-center tabular-nums">
        <tbody>
          <tr>
            <th v-for="att in characteristicList.slice(0, 5)" :key="att" class="font-semibold">
              {{ printAttributeName(att) }}
            </th>
          </tr>
          <tr>
            <td v-for="att in characteristicList.slice(0, 5)" :key="att">{{ getAttributeValue(att, attributes) }}</td>
          </tr>
          <tr>
            <th v-for="att in characteristicList.slice(5)" :key="att" class="font-semibold">
              {{ printAttributeName(att) }}
            </th>
          </tr>
          <tr>
            <td v-for="att in characteristicList.slice(5)" :key="att">{{ getAttributeValue(att, attributes) }}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <template v-if="rolled">Wounds {{ character.getWounds() }} · </template>Movement {{ character.getMovement() }}
      </div>
      <div>Fate {{ character.fate }} · Fortune {{ character.fortune }}</div>
    </template>
  </div>
</template>
