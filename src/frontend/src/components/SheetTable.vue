<script setup lang="ts">
// A table of labelled cells in the style of the paper character sheet. Cells (SheetField, SheetSelect) sit in a
// grid that drops to one column when narrow; the 1px gaps show the background and draw the cell borders.
// An optional title is a small header row above the cells; actions fill a cell on the right.
type Columns = 1 | 2 | 3;

withDefaults(defineProps<{ title?: string; columns?: Columns }>(), { title: "", columns: 1 });

const COLUMNS_CLASS: Record<Columns, string> = {
  1: "",
  2: "@md:grid-cols-2",
  // Three short cells fit side by side once labels shrink to their text.
  3: "@md:grid-cols-3 @md:[&_label]:min-w-0",
};
</script>

<template>
  <div class="@container">
    <div class="flex flex-col gap-px border border-neutral-400 bg-neutral-300">
      <div
        v-if="title"
        class="px-2 py-1 bg-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-600 select-none"
      >
        {{ title }}
      </div>
      <div class="flex gap-px">
        <div :class="COLUMNS_CLASS[columns]" class="grid flex-1 min-w-0 gap-px">
          <slot />
        </div>
        <div v-if="$slots.actions" class="flex flex-col gap-1 p-1 bg-white *:flex-1">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
