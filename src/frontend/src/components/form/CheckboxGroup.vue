<script setup lang="ts" generic="T = string | number">
import FormCheckbox from "./FormCheckbox.vue";

defineProps<{
  title?: string;
  disabled?: boolean;
  options: { text: string; value: T }[];
  // bare: no border or rounded corners of its own, to sit inside a box (e.g. SheetCard). Its checkboxes are drawn
  // like editable sheet cells: faint yellow inside, greyed out when disabled.
  bare?: boolean;
  // twoColumns: always two columns, for short lists in a narrow cell; otherwise one to three columns by width.
  twoColumns?: boolean;
}>();

const selected = defineModel<T[]>({ required: true });

function isSelected(value: T): boolean {
  return selected.value.includes(value);
}

function toggle(optionValue: T) {
  selected.value = isSelected(optionValue)
    ? selected.value.filter((value) => value !== optionValue)
    : [...selected.value, optionValue];
}
</script>

<template>
  <fieldset>
    <legend v-if="title" class="mb-1">{{ title }}</legend>
    <div class="@container w-full px-2" :class="{ 'border border-neutral-300 rounded': !bare }">
      <ul :class="twoColumns ? 'columns-2' : 'columns-1 @sm:columns-2 @lg:columns-3'" class="gap-4 list-none p-0 m-0">
        <li v-for="option in options" :key="String(option.value)" class="break-inside-avoid py-2 flex">
          <label class="inline-flex items-center cursor-pointer">
            <FormCheckbox
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
