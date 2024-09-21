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

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  let newValue = [...props.modelValue];
  let changed: T;

  if (typeof props.options[0].value === "number") {
    // due to this options have to have at least 1 element
    changed = parseInt(target.id) as T;
  } else {
    changed = target.id as T;
  }

  if (target.checked) {
    newValue.push(changed);
  } else {
    newValue = newValue.filter((value) => value !== changed);
  }
  emit("update:modelValue", newValue);
}
</script>

<template>
  <div>
    <p v-if="title" class="mb-1">{{ title }}</p>
    <div v-for="option in options" :key="String(option.value)" class="inline-flex items-center">
      <input
        :id="String(option.value)"
        type="checkbox"
        :checked="isSelected(option.value)"
        :disabled="disabled ? disabled : false"
        class="w-5 h-5 accent-neutral-600"
        @change="handleChange"
      >
      <div class="ml-2 mr-3">{{ option.text }}</div>
    </div>
  </div>
</template>

<style scoped></style>
