<script setup lang="ts">
import { computed } from "vue";

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

function moveToLastPage(direction: -1 | 1): void {
  if (direction === -1) {
    startRow.value = 0;
  } else {
    startRow.value = Math.floor(props.totalRows / props.rowsPerPage) * props.rowsPerPage;
  }
}
</script>

<template>
  <div class="flex flex-wrap">
    <div
      class="bg-neutral-50 py-1 px-2 border border-neutral-200 hover:bg-neutral-200 rounded-l-md"
      @click="moveToLastPage(-1)"
    >
      {{ "<<" }}
    </div>
    <div
      class="bg-neutral-50 py-1 px-2 border-r border-t border-b border-neutral-200 hover:bg-neutral-200"
      @click="moveToNextPage(-1)"
    >
      {{ "<" }}
    </div>

    <div
      class="bg-neutral-50 py-1 px-2 border-t border-b border-neutral-200 hover:bg-neutral-200"
      @click="moveToNextPage(1)"
    >
      {{ ">" }}
    </div>
    <div
      class="bg-neutral-50 py-1 px-2 border border-neutral-200 hover:bg-neutral-200 rounded-r-md"
      @click="moveToLastPage(1)"
    >
      {{ ">>" }}
    </div>
    <div class="pl-2 py-1">
      Results {{ startRow + 1 }} - {{ Math.min(startRow + rowsPerPage, totalRows) }} out of {{ totalRows }}
    </div>
  </div>
</template>

<style scoped></style>
