<script setup lang="ts" generic="T = string | number">
import { ViewSize } from "../utils/viewSize.ts";

const props = defineProps<{
  modelValue: T[];
  title?: string;
  disabled?: boolean;
  options: { text: string; value: T }[];
  viewBreakpoint?: { columns: number; view: ViewSize }[];
  columns?: number;
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

  if (typeof props.options[0]?.value === "number") {
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
    <div class="@container w-full border border-neutral-300 rounded px-2">
      <ul class="columns-1 @[360px]:columns-2 @[500px]:columns-3 gap-4 list-none p-0 m-0">
        <li v-for="option in options" :key="String(option.value)" class="break-inside-avoid py-2 flex">
          <input
            :id="String(option.value)"
            type="checkbox"
            :checked="isSelected(option.value)"
            :disabled="disabled"
            class="w-5 h-5 accent-neutral-600"
            @change="handleChange"
          />
          <div class="ml-2 mr-3">{{ option.text }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
