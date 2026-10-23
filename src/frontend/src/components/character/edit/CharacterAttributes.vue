<script setup lang="ts">
import {
  AttributeName,
  Attributes,
  getAttributeValue,
  printAttributeName,
  setAttributeValue,
  sumAttributes,
} from "@/services/wh/core/attributes.ts";
import FormInput from "@/components/form/FormInput.vue";
import { computed } from "vue";
import { ValidationStatus } from "@/utils/validation.ts";
import SheetCard from "@/components/sheet/SheetCard.vue";
import AppButton from "@/components/ui/AppButton.vue";
import HelpButton from "@/components/ui/HelpButton.vue";
import { generateRolls } from "@/services/wh/character/generation/shared/characteristics.ts";
import { rollDice } from "@/utils/random.ts";

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
  // The characteristics the current career lets the character advance; their headers are highlighted.
  careerAttributes: Set<AttributeName>;
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
// The header of a career characteristic.
const careerThClass = ["bg-parchment", "text-brand"];

// The tables: on a narrow card three of them (the first with the row names), on a wide one a single table.
const NARROW_TABLES = [
  { attributes: [AttributeName.WS, AttributeName.BS], labels: true },
  { attributes: [AttributeName.S, AttributeName.T, AttributeName.I, AttributeName.Ag], labels: false },
  { attributes: [AttributeName.Dex, AttributeName.Int, AttributeName.WP, AttributeName.Fel], labels: false },
];
const WIDE_TABLE = { attributes: NARROW_TABLES.flatMap((x) => x.attributes), labels: true };

// The rows: values, and for the rows typed in, the update and the input step. The wide table has a shorter name for
// Advances.
type Row = {
  label: string;
  wideLabel?: string;
  values: Attributes;
  update?: (attribute: AttributeName, newValue: number) => void;
  step?: number;
};
const rows = computed((): Row[] => [
  { label: "Rolls", values: attributeRolls.value, update: updateRolls },
  { label: "Racial", values: props.speciesAttributes },
  { label: "Other", values: props.otherAttributes },
  {
    label: "Advances",
    wideLabel: "Adv",
    values: attributeAdvances.value,
    update: updateAdvances,
    step: props.advanceStep,
  },
  { label: "Sum", values: total.value },
]);

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
  <SheetCard :title="title">
    <template #hint>
      <HelpButton modalHeader="Career characteristics">
        <p class="my-1">
          The highlighted characteristics are those of your current career: you can advance them at the normal XP cost.
          Other characteristics cost double.
        </p>
        <p class="my-1">Without a current career no characteristic is highlighted.</p>
      </HelpButton>
    </template>
    <template v-if="!disabled" #actions>
      <AppButton icon="lucide:dices" variant="neutral" @click="newRolls">Generate rolls</AppButton>
    </template>
    <div class="@container w-full">
      <div class="flex flex-col divide-y divide-neutral-400 @5xl:divide-y-0">
        <div
          v-for="(table, tableIndex) in [...NARROW_TABLES, WIDE_TABLE]"
          :key="tableIndex"
          class="bg-white min-w-fit"
          :class="table === WIDE_TABLE ? 'hidden @5xl:block' : '@5xl:hidden'"
        >
          <table class="w-full">
            <thead>
              <tr>
                <th v-if="table.labels" :class="labelThClass">Source</th>
                <th
                  v-for="attribute in table.attributes"
                  :key="attribute"
                  :class="[thClass, careerAttributes.has(attribute) ? careerThClass : []]"
                  :title="careerAttributes.has(attribute) ? 'Career characteristic' : undefined"
                >
                  {{ printAttributeName(attribute) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.label" class="bg-white">
                <td v-if="table.labels" :class="labelTdClass">
                  {{ table === WIDE_TABLE ? (row.wideLabel ?? row.label) : row.label }}
                </td>
                <template v-for="attribute in table.attributes" :key="attribute">
                  <td v-if="row.update" :class="tdInputClass">
                    <FormInput
                      bare
                      :disabled="props.disabled"
                      type="number"
                      :step="row.step"
                      :modelValue="getAttributeValue(attribute, row.values)"
                      @update:modelValue="row.update(attribute, $event)"
                    />
                  </td>
                  <td v-else :class="tdClass">
                    {{ getAttributeValue(attribute, row.values) }}
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="careerAttributes.size > 0" class="text-sm text-neutral-600 px-2 py-1">
        Highlighted: career characteristics you can advance.
      </div>
      <div class="text-sm text-error px-2 py-1" :class="[rollsValidationStatus.valid ? 'hidden' : '']">
        {{ rollsValidationStatus.message }}
      </div>
      <div class="text-sm text-error px-2 py-1" :class="[advancesValidationStatus.valid ? 'hidden' : '']">
        {{ advancesValidationStatus.message }}
      </div>
    </div>
  </SheetCard>
</template>
