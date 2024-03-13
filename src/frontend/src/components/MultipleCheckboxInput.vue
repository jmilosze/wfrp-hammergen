<script setup lang="ts" generic="T = string | number">
const model = defineModel<T[]>();

const props = defineProps<{
  title?: string;
  disabled?: boolean;
  options: { text: string; value: T }[];
}>();

function isSelected(value: T): boolean {
  return !!model?.value?.includes(value);
}
</script>

<template>
  <div>
    <p v-if="title" class="mb-1">{{ title }}</p>
    <div v-for="option in options" :key="String(option.value)" class="inline-flex items-center">
      <input
        type="checkbox"
        :checked="isSelected(option.value)"
        :disabled="disabled ? disabled : false"
        class="w-5 h-5 accent-neutral-600"
      />
      <div class="ml-1 mr-3">{{ option.text }}</div>
    </div>
  </div>
</template>

<style scoped></style>
