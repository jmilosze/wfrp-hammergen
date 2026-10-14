<script setup lang="ts">
// A row of a SheetTable made of several cells under one label cell, e.g. the parts of a formula. The parts sit side by
// side once there is room, their labels shrinking to their text; the note is a small line below them.
type Columns = 1 | 2 | 3;

withDefaults(defineProps<{ title: string; columns?: Columns }>(), { columns: 2 });

const COLUMNS_CLASS: Record<Columns, string> = {
  1: "",
  2: "@md:grid-cols-2 @md:[&_[data-sheet-label]]:min-w-0",
  3: "@lg:grid-cols-3 @lg:[&_[data-sheet-label]]:min-w-0",
};
</script>

<template>
  <div class="@container flex min-w-0 bg-white">
    <div class="flex items-center shrink-0 min-w-32 px-2 border-r border-neutral-300 font-semibold whitespace-nowrap">
      {{ title }}
    </div>
    <div :class="COLUMNS_CLASS[columns]" class="grid flex-1 min-w-0 gap-px bg-neutral-300">
      <slot />
      <p v-if="$slots.note" class="col-span-full px-2 py-1 bg-white font-sans text-xs text-neutral-600">
        <slot name="note" />
      </p>
    </div>
  </div>
</template>

<style scoped></style>
