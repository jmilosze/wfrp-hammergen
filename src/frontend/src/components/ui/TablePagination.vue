<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS } from "./buttonStyle.ts";

const props = defineProps<{
  rowsPerPage: number;
  totalRows: number;
  modelValue: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: number): void;
}>();

const startRow = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

function moveToNextPage(direction: -1 | 1): void {
  let newStartRow = startRow.value + direction * props.rowsPerPage;
  if (newStartRow >= 0 && newStartRow < props.totalRows) {
    startRow.value = newStartRow;
  }
}

const lastStartRow = computed(
  () => Math.max(0, Math.ceil(props.totalRows / props.rowsPerPage) - 1) * props.rowsPerPage,
);
const onFirstPage = computed(() => startRow.value === 0);
const onLastPage = computed(() => startRow.value >= lastStartRow.value);

// The light button colours, as the rows' View and Copy buttons; a button at an end of the list is faded.
const BUTTON_CLASS = [
  BUTTON_BASE_CLASS,
  BUTTON_VARIANT_CLASS.light,
  "size-8 disabled:opacity-50 disabled:cursor-default disabled:hover:bg-parchment",
];

function moveToLastPage(direction: -1 | 1): void {
  if (direction === -1) {
    startRow.value = 0;
  } else {
    startRow.value = lastStartRow.value;
  }
}
</script>

<template>
  <!-- First and previous, the rows shown, then next and last; the buttons at an end of the list are faded.
  Centred on very small screens, at the right otherwise. -->
  <div class="flex items-center justify-center @md:justify-end gap-1.5">
    <button
      type="button"
      :class="BUTTON_CLASS"
      aria-label="First page"
      :disabled="onFirstPage"
      @click="moveToLastPage(-1)"
    >
      <Icon icon="lucide:chevrons-left" class="size-4" />
    </button>
    <button
      type="button"
      :class="BUTTON_CLASS"
      aria-label="Previous page"
      :disabled="onFirstPage"
      @click="moveToNextPage(-1)"
    >
      <Icon icon="lucide:chevron-left" class="size-4" />
    </button>
    <span class="px-1.5 text-sm text-neutral-700 tabular-nums" aria-live="polite">
      <template v-if="totalRows > 0">
        {{ startRow + 1 }}–{{ Math.min(startRow + rowsPerPage, totalRows) }} <span class="text-neutral-500">of</span>
        {{ totalRows }}
      </template>
      <template v-else>No results</template>
    </span>
    <button
      type="button"
      :class="BUTTON_CLASS"
      aria-label="Next page"
      :disabled="onLastPage"
      @click="moveToNextPage(1)"
    >
      <Icon icon="lucide:chevron-right" class="size-4" />
    </button>
    <button
      type="button"
      :class="BUTTON_CLASS"
      aria-label="Last page"
      :disabled="onLastPage"
      @click="moveToLastPage(1)"
    >
      <Icon icon="lucide:chevrons-right" class="size-4" />
    </button>
  </div>
</template>

<style scoped></style>
