<script setup lang="ts">
import { AttributeName, Attributes, setAttributeValue, sumAttributes } from "../services/wh/core/attributes.ts";
import FormInput from "./FormInput.vue";
import { computed } from "vue";
import { ValidationStatus } from "../utils/validation.ts";
import SectionCard from "./SectionCard.vue";
import SectionButton from "./SectionButton.vue";
import { generateRolls } from "../services/wh/character/generation/shared/characteristics.ts";
import { rollDice } from "../utils/random.ts";

const props = defineProps<{
  title: string;
  // Species characteristic modifiers (2d10 + modifier), from the character's edition rules.
  speciesAttributes: Attributes;
  // Step of the advance inputs (5 in 5e, where an Advance adds +5).
  advanceStep?: number;
  otherAttributes: Attributes;
  rollsValidationStatus: ValidationStatus;
  advancesValidationStatus: ValidationStatus;
  disabled?: boolean;
}>();

const attributeRolls = defineModel<Attributes>("attributeRolls", { required: true });
const attributeAdvances = defineModel<Attributes>("attributeAdvances", { required: true });

const total = computed(() => {
  return sumAttributes(attributeRolls.value, attributeAdvances.value, props.otherAttributes, props.speciesAttributes);
});

const thClass = ["px-2", "py-2", "border-b", "border-neutral-300", "text-left"];
const tdClass = ["px-2", "py-2", "border-b", "border-neutral-300"];
// The first column (Source and the row names) is set off by a line on its right.
const labelThClass = [...thClass, "border-r"];
const labelTdClass = [...tdClass, "border-r"];
// Cells holding an input: the input fills the cell, so the cell has no padding of its own.
const tdInputClass = ["p-0", "border-b", "border-neutral-300"];

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
  <SectionCard :title="title">
    <template v-if="!disabled" #actions>
      <SectionButton icon="lucide:dices" variant="neutral" @click="newRolls">Generate rolls</SectionButton>
    </template>
    <div class="@container w-full">
      <div class="flex flex-col divide-y divide-neutral-400 @5xl:hidden">
        <div class="bg-white min-w-fit">
          <table class="w-full">
            <thead>
              <tr>
                <th :class="labelThClass">Source</th>
                <th :class="thClass">WS</th>
                <th :class="thClass">BS</th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-white">
                <td :class="labelTdClass">Rolls</td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    :modelValue="attributeRolls.WS"
                    type="number"
                    @update:modelValue="updateRolls(AttributeName.WS, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    :modelValue="attributeRolls.BS"
                    type="number"
                    @update:modelValue="updateRolls(AttributeName.BS, $event)"
                  />
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="labelTdClass">Racial</td>
                <td :class="tdClass">
                  {{ speciesAttributes.WS }}
                </td>
                <td :class="tdClass">
                  {{ speciesAttributes.BS }}
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="labelTdClass">Other</td>
                <td :class="tdClass">
                  {{ otherAttributes.WS }}
                </td>
                <td :class="tdClass">
                  {{ otherAttributes.BS }}
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="labelTdClass">Advances</td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.WS"
                    @update:modelValue="updateAdvances(AttributeName.WS, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.BS"
                    @update:modelValue="updateAdvances(AttributeName.BS, $event)"
                  />
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="labelTdClass">Sum</td>
                <td :class="tdClass">
                  {{ total.WS }}
                </td>
                <td :class="tdClass">
                  {{ total.BS }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-white min-w-fit">
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
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :modelValue="attributeRolls.S"
                    @update:modelValue="updateRolls(AttributeName.S, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :modelValue="attributeRolls.T"
                    @update:modelValue="updateRolls(AttributeName.T, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :modelValue="attributeRolls.I"
                    @update:modelValue="updateRolls(AttributeName.I, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :modelValue="attributeRolls.Ag"
                    @update:modelValue="updateRolls(AttributeName.Ag, $event)"
                  />
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="tdClass">
                  {{ speciesAttributes.S }}
                </td>
                <td :class="tdClass">
                  {{ speciesAttributes.T }}
                </td>
                <td :class="tdClass">
                  {{ speciesAttributes.I }}
                </td>
                <td :class="tdClass">
                  {{ speciesAttributes.Ag }}
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="tdClass">
                  {{ otherAttributes.S }}
                </td>
                <td :class="tdClass">
                  {{ otherAttributes.T }}
                </td>
                <td :class="tdClass">
                  {{ otherAttributes.I }}
                </td>
                <td :class="tdClass">
                  {{ otherAttributes.Ag }}
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.S"
                    @update:modelValue="updateAdvances(AttributeName.S, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.T"
                    @update:modelValue="updateAdvances(AttributeName.T, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.I"
                    @update:modelValue="updateAdvances(AttributeName.I, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.Ag"
                    @update:modelValue="updateAdvances(AttributeName.Ag, $event)"
                  />
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="tdClass">
                  {{ total.S }}
                </td>
                <td :class="tdClass">
                  {{ total.T }}
                </td>
                <td :class="tdClass">
                  {{ total.I }}
                </td>
                <td :class="tdClass">
                  {{ total.Ag }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="bg-white min-w-fit">
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
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :modelValue="attributeRolls.Dex"
                    @update:modelValue="updateRolls(AttributeName.Dex, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :modelValue="attributeRolls.Int"
                    @update:modelValue="updateRolls(AttributeName.Int, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :modelValue="attributeRolls.WP"
                    @update:modelValue="updateRolls(AttributeName.WP, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :modelValue="attributeRolls.Fel"
                    @update:modelValue="updateRolls(AttributeName.Fel, $event)"
                  />
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="tdClass">
                  {{ speciesAttributes.Dex }}
                </td>
                <td :class="tdClass">
                  {{ speciesAttributes.Int }}
                </td>
                <td :class="tdClass">
                  {{ speciesAttributes.WP }}
                </td>
                <td :class="tdClass">
                  {{ speciesAttributes.Fel }}
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="tdClass">
                  {{ otherAttributes.Dex }}
                </td>
                <td :class="tdClass">
                  {{ otherAttributes.Int }}
                </td>
                <td :class="tdClass">
                  {{ otherAttributes.WP }}
                </td>
                <td :class="tdClass">
                  {{ otherAttributes.Fel }}
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.Dex"
                    @update:modelValue="updateAdvances(AttributeName.Dex, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.Int"
                    @update:modelValue="updateAdvances(AttributeName.Int, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.WP"
                    @update:modelValue="updateAdvances(AttributeName.WP, $event)"
                  />
                </td>
                <td :class="tdInputClass">
                  <FormInput
                    bare
                    :disabled="props.disabled"
                    type="number"
                    :step="advanceStep"
                    :modelValue="attributeAdvances.Fel"
                    @update:modelValue="updateAdvances(AttributeName.Fel, $event)"
                  />
                </td>
              </tr>
              <tr class="bg-white">
                <td :class="tdClass">
                  {{ total.Dex }}
                </td>
                <td :class="tdClass">
                  {{ total.Int }}
                </td>
                <td :class="tdClass">
                  {{ total.WP }}
                </td>
                <td :class="tdClass">
                  {{ total.Fel }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="hidden @5xl:block bg-white min-w-fit">
        <table class="w-full">
          <thead>
            <tr>
              <th :class="labelThClass">Source</th>
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
              <td :class="labelTdClass">Rolls</td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.WS"
                  @update:modelValue="updateRolls(AttributeName.WS, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.BS"
                  @update:modelValue="updateRolls(AttributeName.BS, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.S"
                  @update:modelValue="updateRolls(AttributeName.S, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.T"
                  @update:modelValue="updateRolls(AttributeName.T, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.I"
                  @update:modelValue="updateRolls(AttributeName.I, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.Ag"
                  @update:modelValue="updateRolls(AttributeName.Ag, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.Dex"
                  @update:modelValue="updateRolls(AttributeName.Dex, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.Int"
                  @update:modelValue="updateRolls(AttributeName.Int, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.WP"
                  @update:modelValue="updateRolls(AttributeName.WP, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :modelValue="attributeRolls.Fel"
                  @update:modelValue="updateRolls(AttributeName.Fel, $event)"
                />
              </td>
            </tr>
            <tr class="bg-white">
              <td :class="labelTdClass">Racial</td>
              <td :class="tdClass">
                {{ speciesAttributes.WS }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.BS }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.S }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.T }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.I }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.Ag }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.Dex }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.Int }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.WP }}
              </td>
              <td :class="tdClass">
                {{ speciesAttributes.Fel }}
              </td>
            </tr>
            <tr class="bg-white">
              <td :class="labelTdClass">Other</td>
              <td :class="tdClass">
                {{ otherAttributes.WS }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.BS }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.S }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.T }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.I }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.Ag }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.Dex }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.Int }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.WP }}
              </td>
              <td :class="tdClass">
                {{ otherAttributes.Fel }}
              </td>
            </tr>
            <tr class="bg-white">
              <td :class="labelTdClass">Adv</td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.WS"
                  @update:modelValue="updateAdvances(AttributeName.WS, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.BS"
                  @update:modelValue="updateAdvances(AttributeName.BS, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.S"
                  @update:modelValue="updateAdvances(AttributeName.S, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.T"
                  @update:modelValue="updateAdvances(AttributeName.T, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.I"
                  @update:modelValue="updateAdvances(AttributeName.I, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.Ag"
                  @update:modelValue="updateAdvances(AttributeName.Ag, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.Dex"
                  @update:modelValue="updateAdvances(AttributeName.Dex, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.Int"
                  @update:modelValue="updateAdvances(AttributeName.Int, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.WP"
                  @update:modelValue="updateAdvances(AttributeName.WP, $event)"
                />
              </td>
              <td :class="tdInputClass">
                <FormInput
                  bare
                  :disabled="props.disabled"
                  type="number"
                  :step="advanceStep"
                  :modelValue="attributeAdvances.Fel"
                  @update:modelValue="updateAdvances(AttributeName.Fel, $event)"
                />
              </td>
            </tr>
            <tr class="bg-white">
              <td :class="labelTdClass">Sum</td>
              <td :class="tdClass">
                {{ total.WS }}
              </td>
              <td :class="tdClass">
                {{ total.BS }}
              </td>
              <td :class="tdClass">
                {{ total.S }}
              </td>
              <td :class="tdClass">
                {{ total.T }}
              </td>
              <td :class="tdClass">
                {{ total.I }}
              </td>
              <td :class="tdClass">
                {{ total.Ag }}
              </td>
              <td :class="tdClass">
                {{ total.Dex }}
              </td>
              <td :class="tdClass">
                {{ total.Int }}
              </td>
              <td :class="tdClass">
                {{ total.WP }}
              </td>
              <td :class="tdClass">
                {{ total.Fel }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="text-sm text-danger-600 px-2 py-1" :class="[rollsValidationStatus.valid ? 'hidden' : '']">
        {{ rollsValidationStatus.message }}
      </div>
      <div class="text-sm text-danger-600 px-2 py-1" :class="[advancesValidationStatus.valid ? 'hidden' : '']">
        {{ advancesValidationStatus.message }}
      </div>
    </div>
  </SectionCard>
</template>

<style scoped></style>
