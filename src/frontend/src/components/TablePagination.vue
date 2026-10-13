<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";

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

const BUTTON_CLASS =
  "inline-flex items-center justify-center size-8 rounded border border-neutral-400 bg-white text-neutral-800 " +
  "hover:bg-neutral-200 cursor-pointer disabled:cursor-default disabled:border-neutral-300 disabled:bg-neutral-100 " +
  "disabled:text-neutral-400";

function moveToLastPage(direction: -1 | 1): void {
  if (direction === -1) {
    startRow.value = 0;
  } else {
    startRow.value = lastStartRow.value;
  }
}
</script>

<template>
  <!-- First and previous, the rows shown, then next and last; the buttons at an end of the list are greyed out.
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
