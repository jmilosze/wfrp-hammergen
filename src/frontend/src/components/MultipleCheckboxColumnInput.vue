<script setup lang="ts" generic="T = string | number">
const props = defineProps<{
  modelValue: T[];
  title?: string;
  disabled?: boolean;
  options: { text: string; value: T }[];
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
    <div class="@container w-full border border-neutral-300 rounded px-2">
      <ul class="columns-1 @sm:columns-2 @lg:columns-3 gap-4 list-none p-0 m-0">
        <li v-for="option in options" :key="String(option.value)" class="break-inside-avoid py-2 flex">
          <label class="inline-flex items-center cursor-pointer">
            <input
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
