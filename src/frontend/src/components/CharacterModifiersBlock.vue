<script setup lang="ts">
import IconButton from "./IconButton.vue";
import { Edition } from "../services/wh/core/edition.ts";
import HintModal from "./HintModal.vue";
import SectionCard from "./SectionCard.vue";
import { computed, ref } from "vue";
import {
  AttributeName,
  attributeNameList,
  getAttributeValue,
  printAttributeName,
  setAttributeValue,
} from "../services/wh/core/attributes.ts";
import SheetTable from "./SheetTable.vue";
import SheetSelect from "./SheetSelect.vue";
import { CharacterModifiers } from "../services/wh/core/characterModifiers.ts";
import FormInput from "./FormInput.vue";
import CharacterModifierEffectTable from "./CharacterModifierEffectTable.vue";
import ListTable from "./ListTable.vue";
import SectionButton from "./SectionButton.vue";

const props = defineProps<{
  disabled?: boolean;
  modelValue: CharacterModifiers;
  edition: Edition;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modifiers: CharacterModifiers): void;
}>();

function updateAttributes(attribute: AttributeName, newValue: number) {
  const newModifiers = props.modelValue.copy();
  setAttributeValue(attribute, newValue, newModifiers.attributes);
  emit("update:modelValue", newModifiers);
}

// Characteristic modifiers are edited as a list of the characteristics a modifier changes (usually one or two), not as
// all ten. A row is shown for every non-zero characteristic and for any just added (still 0). Rows keep the order they
// were added in; characteristics already set when the page loads come first, in WS…Fel order.
const CHARACTERISTICS = attributeNameList.filter((x) => x !== AttributeName.None && x !== AttributeName.Various);
const addedCharacteristics = ref(new Set<AttributeName>());
const rowOrder = ref<AttributeName[]>([]);

function isListed(name: AttributeName): boolean {
  return getAttributeValue(name, props.modelValue.attributes) !== 0 || addedCharacteristics.value.has(name);
}

const characteristicRows = computed(() => {
  const ordered = rowOrder.value.filter((x) => isListed(x));
  const rest = CHARACTERISTICS.filter((x) => isListed(x) && !ordered.includes(x));
  return [...ordered, ...rest].map((x) => ({ name: x, value: getAttributeValue(x, props.modelValue.attributes) }));
});

const unusedCharacteristics = computed(() =>
  CHARACTERISTICS.filter((x) => !characteristicRows.value.some((row) => row.name === x)),
);

// The options of a row's dropdown: its own characteristic and those not in the list yet.
function characteristicOptions(name: AttributeName) {
  return CHARACTERISTICS.filter((x) => x === name || unusedCharacteristics.value.includes(x)).map((x) => ({
    text: printAttributeName(x),
    value: x,
  }));
}

// addCharacteristic adds a row below the others, for the first characteristic not in the list.
function addCharacteristic() {
  const name = unusedCharacteristics.value[0];
  rowOrder.value = [...characteristicRows.value.map((row) => row.name), name];
  addedCharacteristics.value = new Set([...addedCharacteristics.value, name]);
}

function removeCharacteristic(name: AttributeName) {
  addedCharacteristics.value = new Set([...addedCharacteristics.value].filter((x) => x !== name));
  updateAttributes(name, 0);
}

// changeCharacteristic moves a row's value to another characteristic; the row keeps its place.
function changeCharacteristic(from: AttributeName, to: AttributeName) {
  const newModifiers = props.modelValue.copy();
  const value = getAttributeValue(from, newModifiers.attributes);
  setAttributeValue(from, 0, newModifiers.attributes);
  setAttributeValue(to, value, newModifiers.attributes);
  rowOrder.value = characteristicRows.value.map((row) => (row.name === from ? to : row.name));
  addedCharacteristics.value = new Set([...[...addedCharacteristics.value].filter((x) => x !== from), to]);
  emit("update:modelValue", newModifiers);
}

function onCharacteristicChange(from: AttributeName, event: Event) {
  if (!(event.target instanceof HTMLSelectElement)) {
    return;
  }
  const selected = Number(event.target.value);
  const to = CHARACTERISTICS.find((x) => x === selected);
  if (to !== undefined) {
    changeCharacteristic(from, to);
  }
}

function updateSize(newSize: number) {
  const newModifiers = props.modelValue.copy();
  newModifiers.size = newSize;
  emit("update:modelValue", newModifiers);
}

function updateMovement(newMovement: number) {
  const newModifiers = props.modelValue.copy();
  newModifiers.movement = newMovement;
  emit("update:modelValue", newModifiers);
}

function updateEffects(id: number, selected: boolean) {
  const newModifiers = props.modelValue.copy();
  newModifiers.updateEffects(id, selected);
  emit("update:modelValue", newModifiers);
}

const sizeOptions = [
  { text: "3", value: 3 },
  { text: "2", value: 2 },
  { text: "1", value: 1 },
  { text: "0", value: 0 },
  { text: "-1", value: -1 },
  { text: "-2", value: -2 },
  { text: "-3", value: -3 },
];
const movementOptions = [
  { text: "3", value: 3 },
  { text: "2", value: 2 },
  { text: "1", value: 1 },
  { text: "0", value: 0 },
  { text: "-1", value: -1 },
  { text: "-2", value: -2 },
  { text: "-3", value: -3 },
];

const validAtts = computed(() => {
  return props.modelValue.validateAttributes();
});
</script>

<template>
  <div class="@container">
    <SectionCard title="Character modifiers">
      <template #hint>
        <HintModal modalHeader="Character modifiers">
          <div>
            Talent modifiers are automatically added to character sheet in both edit and view modes. For example, if you
            add a talent that modifies the Size, it will automatically affect the number of Wounds. Sum of all Attribute
            modifiers is displayed in "other" row in character sheet.
          </div>
          <div>
            All characters have default size Average, by using size modifier you can change is to Small (-1), Large (+1)
            etc.
          </div>
        </HintModal>
      </template>
    </SectionCard>
    <div class="flex flex-col @2xl:flex-row -mt-px">
      <ListTable :editable="!disabled" title="Characteristics" :titleColspan="disabled ? 2 : 3" class="flex-1">
        <template v-if="!disabled" #actions>
          <SectionButton icon="lucide:plus" :disabled="unusedCharacteristics.length === 0" @click="addCharacteristic">
            Add
          </SectionButton>
        </template>
        <tr v-for="row in characteristicRows" :key="row.name">
          <td class="p-0 w-32 border-b border-r border-neutral-300">
            <select
              :value="row.name"
              :disabled="disabled"
              :aria-label="`Characteristic (${printAttributeName(row.name)})`"
              class="w-full h-10 px-1 font-semibold outline-none bg-editable focus:outline-2 focus:-outline-offset-2 outline-neutral-700 disabled:bg-white disabled:text-neutral-900 disabled:opacity-100 disabled:appearance-none"
              @change="onCharacteristicChange(row.name, $event)"
            >
              <option v-for="option in characteristicOptions(row.name)" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </td>
          <td class="p-0 border-b border-neutral-300">
            <FormInput
              bare
              :modelValue="row.value"
              type="number"
              :disabled="disabled"
              @update:modelValue="updateAttributes(row.name, $event)"
            />
          </td>
          <td v-if="!disabled" class="w-0 px-1 border-b border-neutral-300">
            <IconButton
              icon="lucide:x"
              size="lg"
              :label="`Remove ${printAttributeName(row.name)}`"
              @click="removeCharacteristic(row.name)"
            />
          </td>
        </tr>
      </ListTable>
      <CharacterModifierEffectTable
        :initEffects="modelValue.effects"
        :edition="edition"
        :disabled="props.disabled ? props.disabled : false"
        class="flex-1 -mt-px @2xl:mt-0 @2xl:-ml-px"
        @selected="(event) => updateEffects(event.id, event.selected)"
      />
    </div>
    <SheetTable :columns="2" class="-mt-px">
      <SheetSelect
        :modelValue="modelValue.size"
        :options="sizeOptions"
        title="Size"
        :disabled="props.disabled ? props.disabled : false"
        @update:modelValue="(event) => updateSize(event)"
      />
      <SheetSelect
        :modelValue="modelValue.movement"
        :options="movementOptions"
        title="Movement"
        :disabled="props.disabled ? props.disabled : false"
        @update:modelValue="(event) => updateMovement(event)"
      />
    </SheetTable>
    <p class="text-sm text-error px-2 py-1" :class="[validAtts.valid ? 'hidden' : '']">
      {{ validAtts.message }}
    </p>
  </div>
</template>

<style scoped></style>
