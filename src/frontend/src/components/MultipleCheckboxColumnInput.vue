<script setup lang="ts" generic="T = string | number">
import SheetCheckbox from "./SheetCheckbox.vue";

const props = defineProps<{
  modelValue: T[];
  title?: string;
  disabled?: boolean;
  options: { text: string; value: T }[];
  // bare: no border or rounded corners of its own, to sit inside a box (e.g. SectionCard). Its checkboxes are drawn
  // like editable sheet cells: faint yellow inside, greyed out when disabled.
  bare?: boolean;
  // twoColumns: always two columns, for short lists in a narrow cell; otherwise one to three columns by width.
  twoColumns?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: T[]): void;
}>();

function isSelected(value: T): boolean {
  return props.modelValue.includes(value);
}

function toggle(optionValue: T) {
  const newValue = isSelected(optionValue)
    ? props.modelValue.filter((value) => value !== optionValue)
    : [...props.modelValue, optionValue];
  emit("update:modelValue", newValue);
}
</script>

<template>
  <fieldset>
    <legend v-if="title" class="mb-1">{{ title }}</legend>
    <div class="@container w-full px-2" :class="{ 'border border-neutral-300 rounded': !bare }">
      <ul :class="twoColumns ? 'columns-2' : 'columns-1 @sm:columns-2 @lg:columns-3'" class="gap-4 list-none p-0 m-0">
        <li v-for="option in options" :key="String(option.value)" class="break-inside-avoid py-2 flex">
          <label class="inline-flex items-center cursor-pointer">
            <SheetCheckbox
              v-if="bare"
              :checked="isSelected(option.value)"
              :disabled="disabled"
              @change="toggle(option.value)"
            />
            <input
              v-else
              type="checkbox"
              :checked="isSelected(option.value)"
              :disabled="disabled"
              class="w-5 h-5 accent-neutral-600"
              @change="toggle(option.value)"
            />
            <span class="ml-2 mr-3">{{ option.text }}</span>
          </label>
        </li>
      </ul>
    </div>
  </fieldset>
</template>

<style scoped></style>
