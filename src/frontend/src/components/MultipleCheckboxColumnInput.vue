<script setup lang="ts" generic="T = string | number">
import { ref, computed } from "vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";

const props = defineProps<{
  modelValue: T[];
  title?: string;
  disabled?: boolean;
  options: { text: string; value: T }[];
  viewBreakpoint: { columns: number; view: ViewSize }[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: T[]): void;
}>();

const contentContainerRef = ref<HTMLDivElement | null>(null);
const elSize = props.viewBreakpoint.map((x) => useElSize(x.view, contentContainerRef));

const columnCount = computed(() => {
  let count = 1;
  for (let i = 0; i < props.viewBreakpoint.length; i++) {
    if (elSize[i].isEqualOrGreater.value && count <= props.viewBreakpoint[i].columns) {
      count = props.viewBreakpoint[i].columns;
    }
  }
  return count;
});

const columnData = computed(() => {
  const itemsPerColumn = Math.ceil(props.options.length / columnCount.value);
  const columns: (typeof props.options)[] = [];

  for (let i = 0; i < columnCount.value; i++) {
    const startIndex = i * itemsPerColumn;
    const endIndex = Math.min(startIndex + itemsPerColumn, props.options.length);
    const columnItems = props.options.slice(startIndex, endIndex);
    if (columnItems.length > 0) {
      columns.push(columnItems);
    }
  }

  return columns;
});

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
  <div ref="contentContainerRef">
    <p v-if="title" class="mb-1">{{ title }}</p>
    <div class="w-full border border-neutral-300 rounded px-2">
      <div class="flex gap-4 flex-row">
        <!-- Dynamic columns -->
        <ul v-for="(column, columnIndex) in columnData" :key="`column-${columnIndex}`" class="list-none p-0 m-0 flex-1">
          <li v-for="(option, optionIndex) in column" :key="`${columnIndex}-${optionIndex}`" class="py-2 flex">
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
  </div>
</template>

<style scoped></style>
