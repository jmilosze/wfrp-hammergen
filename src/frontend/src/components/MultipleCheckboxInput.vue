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
    <label
      v-for="option in options"
      :key="String(option.value)"
      class="inline-flex items-center cursor-pointer"
    >
      <input
        type="checkbox"
        :checked="isSelected(option.value)"
        :disabled="disabled"
        class="w-5 h-5 accent-neutral-600"
        @change="toggle(option.value)"
      />
      <span class="ml-2 mr-3">{{ option.text }}</span>
    </label>
  </fieldset>
</template>

<style scoped></style>
