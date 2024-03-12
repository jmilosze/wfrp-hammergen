<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string | number;
  options: { text: string; value: string | number }[];
  title?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string | number): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div>
    <div v-if="title" class="mb-1">{{ title }}</div>
    <select
      v-model="value"
      class="border border-neutral-300 focus:border-neutral-700 focus:border-2 rounded outline-0 h-10 px-2 w-full bg-white disabled:bg-neutral-200"
      :disabled="disabled"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<style scoped></style>
