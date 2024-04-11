<script setup lang="ts">
import {
  AttributeName,
  Attributes,
  getAttributes,
  setAttributeValue,
  sumAttributes,
} from "../services/wh/attributes.ts";
import { SpeciesWithRegion } from "../services/wh/characterUtils.ts";
import FormInput from "./FormInput.vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";
import { computed, ref } from "vue";
import { ValidationStatus } from "../utils/validation.ts";
import ActionButton from "./ActionButton.vue";
import { generateRolls } from "../services/wh/characterGeneration/generateAttributes.ts";
import { rollDice } from "../utils/random.ts";

const props = defineProps<{
  title: string;
  cols: boolean;
  species: SpeciesWithRegion;
  otherAttributes: Attributes;
  rollsValidationStatus: ValidationStatus;
  advancesValidationStatus: ValidationStatus;
  disabled?: boolean;
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
const tdClassNoInput = ["px-4", "py-2", "border-b", "border-neutral-300", "text-center"];
const tdClass = ["px-2", "py-2", "border-b", "border-neutral-300"];

function updateRolls(attribute: AttributeName, newValue: number) {
  setAttributeValue(attribute, newValue, attributeRolls.value);
}

function updateAdvances(attribute: AttributeName, newValue: number) {
  setAttributeValue(attribute, newValue, attributeAdvances.value);
}

function newRolls() {
  attributeRolls.value = generateRolls(rollDice);
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 mb-1">
    <div class="mb-1">{{ title }}</div>
    <ActionButton v-if="!disabled" size="sm" @click="newRolls">Generate rolls</ActionButton>
  </div>
  <div ref="contentContainerRef" class="w-full">
    <div v-if="!lgELSize.isEqualOrGreater.value" class="flex flex-col gap-4">
      <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
        <table class="w-full">
          <thead>
            <tr>
              <th :class="thClass">Source</th>
              <th :class="thClass">WS</th>
              <th :class="thClass">BS</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td :class="tdClass">Rolls</td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  :modelValue="attributeRolls.WS"
                  type="number"
                  @update:modelValue="updateRolls(AttributeName.WS, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  :modelValue="attributeRolls.BS"
                  type="number"
                  @update:modelValue="updateRolls(AttributeName.BS, $event)"
                />
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
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.WS"
                  @update:modelValue="updateAdvances(AttributeName.WS, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.BS"
                  @update:modelValue="updateAdvances(AttributeName.BS, $event)"
                />
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
        <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
      </div>
      <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
        <table class="w-full">
          <thead>
            <tr>
              <th :class="thClass">S</th>
              <th :class="thClass">T</th>
              <th :class="thClass">I</th>
              <th :class="thClass">Ag</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeRolls.S"
                  @update:modelValue="updateRolls(AttributeName.S, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeRolls.T"
                  @update:modelValue="updateRolls(AttributeName.T, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeRolls.I"
                  @update:modelValue="updateRolls(AttributeName.I, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeRolls.Ag"
                  @update:modelValue="updateRolls(AttributeName.Ag, $event)"
                />
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
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.S"
                  @update:modelValue="updateAdvances(AttributeName.S, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.T"
                  @update:modelValue="updateAdvances(AttributeName.T, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.I"
                  @update:modelValue="updateAdvances(AttributeName.I, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.Ag"
                  @update:modelValue="updateAdvances(AttributeName.Ag, $event)"
                />
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
        <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
      </div>
      <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
        <table class="w-full">
          <thead>
            <tr>
              <th :class="thClass">Dex</th>
              <th :class="thClass">Int</th>
              <th :class="thClass">WP</th>
              <th :class="thClass">Fel</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeRolls.Dex"
                  @update:modelValue="updateRolls(AttributeName.Dex, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeRolls.Int"
                  @update:modelValue="updateRolls(AttributeName.Int, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeRolls.WP"
                  @update:modelValue="updateRolls(AttributeName.WP, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeRolls.Fel"
                  @update:modelValue="updateRolls(AttributeName.Fel, $event)"
                />
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
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.Dex"
                  @update:modelValue="updateAdvances(AttributeName.Dex, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.Int"
                  @update:modelValue="updateAdvances(AttributeName.Int, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.WP"
                  @update:modelValue="updateAdvances(AttributeName.WP, $event)"
                />
              </td>
              <td :class="tdClass">
                <FormInput
                  :disabled="props.disabled"
                  :centerText="true"
                  type="number"
                  :modelValue="attributeAdvances.Fel"
                  @update:modelValue="updateAdvances(AttributeName.Fel, $event)"
                />
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
    </div>
    <div v-else class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
      <table class="w-full">
        <thead>
          <tr>
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
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.WS"
                @update:modelValue="updateRolls(AttributeName.WS, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.BS"
                @update:modelValue="updateRolls(AttributeName.BS, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.S"
                @update:modelValue="updateRolls(AttributeName.S, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.T"
                @update:modelValue="updateRolls(AttributeName.T, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.I"
                @update:modelValue="updateRolls(AttributeName.I, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.Ag"
                @update:modelValue="updateRolls(AttributeName.Ag, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.Dex"
                @update:modelValue="updateRolls(AttributeName.Dex, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.Int"
                @update:modelValue="updateRolls(AttributeName.Int, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.WP"
                @update:modelValue="updateRolls(AttributeName.WP, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeRolls.Fel"
                @update:modelValue="updateRolls(AttributeName.Fel, $event)"
              />
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
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.WS"
                @update:modelValue="updateAdvances(AttributeName.WS, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.BS"
                @update:modelValue="updateAdvances(AttributeName.BS, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.S"
                @update:modelValue="updateAdvances(AttributeName.S, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.T"
                @update:modelValue="updateAdvances(AttributeName.T, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.I"
                @update:modelValue="updateAdvances(AttributeName.I, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.Ag"
                @update:modelValue="updateAdvances(AttributeName.Ag, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.Dex"
                @update:modelValue="updateAdvances(AttributeName.Dex, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.Int"
                @update:modelValue="updateAdvances(AttributeName.Int, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.WP"
                @update:modelValue="updateAdvances(AttributeName.WP, $event)"
              />
            </td>
            <td :class="tdClass">
              <FormInput
                :disabled="props.disabled"
                :centerText="true"
                type="number"
                :modelValue="attributeAdvances.Fel"
                @update:modelValue="updateAdvances(AttributeName.Fel, $event)"
              />
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
    <div class="text-sm text-red-600 mt-1" :class="[rollsValidationStatus.valid ? 'hidden' : '']">
      {{ rollsValidationStatus.message }}
    </div>
    <div class="text-sm text-red-600 mt-1" :class="[advancesValidationStatus.valid ? 'hidden' : '']">
      {{ advancesValidationStatus.message }}
    </div>
  </div>
</template>

<style scoped></style>
