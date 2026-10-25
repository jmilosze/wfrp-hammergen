<script setup lang="ts">
import { computed, ref } from "vue";
import AppButton from "@/components/ui/AppButton.vue";
import FormRadio from "@/components/form/FormRadio.vue";
import IconButton from "@/components/ui/IconButton.vue";
import {
  AttributeName,
  characteristicList,
  copyAttributes,
  getAttributeValue,
  printAttributeName,
  setAttributeValue,
  zeroAttributes,
} from "@/services/wh/core/attributes.ts";
import { getCareerAttributesByLevel } from "@/services/wh/content/career.ts";
import { getSpeciesAttributes5e } from "@/services/wh/character/rules/rules5e.ts";
import { generateRolls } from "@/services/wh/character/generation/shared/characteristics.ts";
import {
  CharacteristicsMethod5e,
  characteristicRolls5e,
  CREATION_CHARACTERISTIC_POINTS_5E,
  POINT_SPREAD_MAX_5E,
  POINT_SPREAD_MIN_5E,
  POINT_SPREAD_TOTAL_5E,
} from "@/services/wh/character/generation/5e/characteristics5e.ts";
import {
  GuidedContext5e,
  guidedCareer5e,
  GuidedState5e,
  guidedSpecies5e,
} from "@/services/wh/character/generation/5e/guided5e.ts";
import { rollDice } from "@/utils/random.ts";

// Step 3 (p. 38): ten 2d10 rolls, then A: kept in order plus up to 6 points over the three level 1 career
// characteristics; B: rearranged plus up to 3 points; C: ten new rolls assigned freely, or D: 100 points spread
// (4–16 each), with no points. Rolling the new values of C ends A and B. Rearranging swaps two values: click one,
// then the other.
const props = defineProps<{ context: GuidedContext5e }>();
const state = defineModel<GuidedState5e>("state", { required: true });

const c = computed(() => state.value.characteristics);
const species = computed(() => guidedSpecies5e(state.value));
const level1 = computed(() => {
  const career = guidedCareer5e(state.value, props.context);
  return career === null ? [] : getCareerAttributesByLevel(career)[0];
});
const speciesValues = computed(() => (species.value === null ? null : getSpeciesAttributes5e(species.value)));
const values = computed(() => characteristicRolls5e(c.value));
// No points when the career has no level 1 characteristics to put them on.
const pointLimit = computed(() =>
  c.value.method === null || level1.value.length === 0 ? 0 : CREATION_CHARACTERISTIC_POINTS_5E[c.value.method],
);
const pointsUsed = computed(() => Object.values(c.value.points).reduce((sum, x) => sum + x, 0));
const spreadUsed = computed(() => Object.values(c.value.assigned).reduce((sum, x) => sum + x, 0));
// A spread value outside 4–16 (or not a whole number) is marked in the table and named under it.
const outOfRange = (att: AttributeName) => {
  const value = getAttributeValue(att, c.value.assigned);
  return !Number.isInteger(value) || value < POINT_SPREAD_MIN_5E || value > POINT_SPREAD_MAX_5E;
};
const outOfRangeNames = computed(() => characteristicList.filter(outOfRange).map(printAttributeName));
const swapping = computed(() => c.value.method === "rearranged" || c.value.method === "rolledAgain");

const METHODS: { method: CharacteristicsMethod5e; label: string }[] = [
  { method: "inOrder", label: "A. Keep the rolls in order and add up to 6 points to your career characteristics" },
  { method: "rearranged", label: "B. Rearrange the rolls and add up to 3 points to your career characteristics" },
  { method: "rolledAgain", label: "C. Roll ten new values and arrange them as you like" },
  { method: "pointSpread", label: "D. Spread 100 points instead (4 to 16 each)" },
];

function available(method: CharacteristicsMethod5e): boolean {
  switch (method) {
    case "inOrder":
    case "rearranged":
      return c.value.firstRolls !== null && c.value.newRolls === null;
    case "rolledAgain":
      return c.value.newRolls !== null;
    case "pointSpread":
      return true;
  }
}

function setMethod(method: CharacteristicsMethod5e) {
  const step = c.value;
  step.method = method;
  step.points = zeroAttributes();
  if (method === "rearranged" && step.firstRolls !== null) {
    step.assigned = copyAttributes(step.firstRolls);
  } else if (method === "rolledAgain" && step.newRolls !== null) {
    step.assigned = copyAttributes(step.newRolls);
  } else if (method === "pointSpread") {
    step.assigned = { WS: 10, BS: 10, S: 10, T: 10, I: 10, Ag: 10, Dex: 10, Int: 10, WP: 10, Fel: 10 };
  }
}

function rollFirst() {
  c.value.firstRolls = generateRolls(rollDice);
  setMethod("inOrder");
}

function rollNew() {
  c.value.newRolls = generateRolls(rollDice);
  setMethod("rolledAgain");
}

const selected = ref<AttributeName | null>(null);

function pickToSwap(att: AttributeName) {
  if (selected.value === null || selected.value === att) {
    selected.value = selected.value === att ? null : att;
    return;
  }
  const assigned = copyAttributes(c.value.assigned);
  setAttributeValue(selected.value, getAttributeValue(att, c.value.assigned), assigned);
  setAttributeValue(att, getAttributeValue(selected.value, c.value.assigned), assigned);
  c.value.assigned = assigned;
  selected.value = null;
}

function addPoint(att: AttributeName, delta: number) {
  const points = copyAttributes(c.value.points);
  setAttributeValue(att, getAttributeValue(att, points) + delta, points);
  c.value.points = points;
}

function setSpread(att: AttributeName, event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const assigned = copyAttributes(c.value.assigned);
    setAttributeValue(att, Number(event.target.value), assigned);
    c.value.assigned = assigned;
  }
}

function total(att: AttributeName): number | null {
  if (values.value === null || speciesValues.value === null) {
    return null;
  }
  return (
    getAttributeValue(att, values.value) +
    getAttributeValue(att, speciesValues.value) +
    getAttributeValue(att, c.value.points)
  );
}
</script>

<template>
  <p>
    Roll 2d10 for every characteristic, then retain the rolls in order (A) or rearrange them (B). You can roll again and
    rearrange as you like (C), but this will <b class="font-semibold">permanently disable choices A and B</b>.
    Alternatively, manually distribute 100 points (D). Keeping first rolls of Species, Career, and Characteristics,
    increase your Fate by 1.
  </p>
  <div class="flex flex-wrap gap-2">
    <!-- Roll takes the spare room beside Roll again, up to about twice its own width, and never pushes it down. -->
    <AppButton
      class="grow max-w-[7.75rem]"
      icon="lucide:dices"
      :disabled="c.firstRolls !== null || c.newRolls !== null"
      @click="rollFirst"
    >
      Roll
    </AppButton>
    <AppButton icon="lucide:dices" :disabled="c.firstRolls === null || c.newRolls !== null" @click="rollNew">
      Roll again (ends A and B)
    </AppButton>
  </div>
  <fieldset class="flex flex-col gap-1">
    <legend class="sr-only">Method</legend>
    <label
      v-for="m in METHODS"
      :key="m.method"
      class="flex items-start gap-2"
      :class="available(m.method) ? '' : 'text-neutral-400'"
    >
      <FormRadio
        class="mt-0.5"
        name="characteristics-method"
        :checked="c.method === m.method"
        :disabled="!available(m.method)"
        @change="setMethod(m.method)"
      />
      {{ m.label }}
    </label>
  </fieldset>
  <div v-if="c.method !== null && speciesValues !== null" class="overflow-x-auto">
    <table class="w-full max-w-xl border-collapse">
      <thead>
        <tr class="border-b border-neutral-400 text-left">
          <th class="py-1 pr-1.5"><span class="sr-only">Characteristic</span></th>
          <th class="py-1 px-1.5 text-right">{{ c.method === "pointSpread" ? "Spread" : "Roll" }}</th>
          <th class="py-1 px-1.5 text-right">Species</th>
          <th v-if="pointLimit > 0" class="py-1 px-1.5 text-center">Points</th>
          <th class="py-1 pl-1.5 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="att in characteristicList" :key="att" class="border-b border-neutral-200">
          <td class="py-1 pr-1.5">
            {{ printAttributeName(att) }}
            <span v-if="level1.includes(att)" class="block text-xs text-neutral-600">career</span>
          </td>
          <td class="py-1 px-1.5 text-right tabular-nums">
            <button
              v-if="swapping"
              type="button"
              class="w-10 rounded border px-1"
              :class="selected === att ? 'border-brand bg-parchment font-semibold' : 'border-neutral-300'"
              :aria-pressed="selected === att"
              :aria-label="`Swap ${printAttributeName(att)} (${values ? getAttributeValue(att, values) : ''})`"
              @click="pickToSwap(att)"
            >
              {{ values ? getAttributeValue(att, values) : "" }}
            </button>
            <input
              v-else-if="c.method === 'pointSpread'"
              type="number"
              class="w-14 rounded border bg-editable px-1 text-right"
              :class="outOfRange(att) ? 'border-error text-error' : 'border-neutral-300'"
              :aria-invalid="outOfRange(att)"
              :min="POINT_SPREAD_MIN_5E"
              :max="POINT_SPREAD_MAX_5E"
              :value="getAttributeValue(att, c.assigned)"
              :aria-label="`${printAttributeName(att)} points`"
              @input="setSpread(att, $event)"
            />
            <template v-else>{{ values ? getAttributeValue(att, values) : "" }}</template>
          </td>
          <td class="py-1 px-1.5 text-right tabular-nums">+{{ getAttributeValue(att, speciesValues) }}</td>
          <td v-if="pointLimit > 0" class="py-1 px-1.5">
            <span v-if="level1.includes(att)" class="flex items-center justify-center gap-1">
              <IconButton
                icon="lucide:minus"
                size="sm"
                variant="circle"
                :label="`Remove a point from ${printAttributeName(att)}`"
                :disabled="getAttributeValue(att, c.points) === 0"
                @click="addPoint(att, -1)"
              />
              <span class="w-6 text-center tabular-nums">{{ getAttributeValue(att, c.points) }}</span>
              <IconButton
                icon="lucide:plus"
                size="sm"
                variant="circle"
                :label="`Add a point to ${printAttributeName(att)}`"
                :disabled="pointsUsed >= pointLimit"
                @click="addPoint(att, 1)"
              />
            </span>
          </td>
          <td class="py-1 pl-1.5 text-right font-semibold tabular-nums">{{ total(att) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-if="pointLimit > 0">Career points left: {{ pointLimit - pointsUsed }} of {{ pointLimit }}.</p>
  <p v-if="swapping">To swap two values, click one and then the other.</p>
  <p v-if="c.method === 'pointSpread'">
    <span :class="spreadUsed === POINT_SPREAD_TOTAL_5E ? '' : 'text-error'">
      Points spread: {{ spreadUsed }} of {{ POINT_SPREAD_TOTAL_5E }}, each {{ POINT_SPREAD_MIN_5E }} to
      {{ POINT_SPREAD_MAX_5E }}.
    </span>
    <span v-if="outOfRangeNames.length > 0" class="text-error"> Check {{ outOfRangeNames.join(", ") }}.</span>
  </p>
</template>
