<script setup lang="ts">
import SheetTitle from "./SheetTitle.vue";
// A table of labelled cells in the style of the paper character sheet. Cells (SheetField, SheetSelect) sit in a
// grid that drops to one column when narrow; the 1px gaps show the background and draw the cell borders.
// Editable cells (SheetField, SheetSelect) have a faint yellow fill; read-only and calculated cells are white.
// Stretched taller than its content (e.g. next to a taller table in a row), the rows share the extra height.
// An optional title is a small header row above the cells; actions fill a cell on the right.
// Columns "short" and "short-6": short read-only cells (values of a few characters, e.g. Wealth) in three columns from a
// narrower width; "short-6" makes a single row of six cells once there is room (e.g. Encumbrance).
type Columns = 1 | 2 | 3 | "short" | "short-6";

withDefaults(defineProps<{ title?: string; columns?: Columns }>(), { title: "", columns: 1 });

const COLUMNS_CLASS: Record<Columns, string> = {
  1: "",
  2: "@md:grid-cols-2",
  // Three short cells fit side by side once labels shrink to their text.
  3: "@md:grid-cols-3 @md:[&_[data-sheet-label]]:min-w-0",
  short: "@xs:grid-cols-3 @xs:[&_[data-sheet-label]]:min-w-0",
  "short-6": "@xs:grid-cols-3 @2xl:grid-cols-6 @xs:[&_[data-sheet-label]]:min-w-0",
};
</script>

<template>
  <div class="@container flex flex-col font-sheet lining-nums [&_button]:font-sans print:break-inside-avoid">
    <div class="flex flex-col grow gap-px border border-neutral-400 bg-neutral-300">
      <SheetTitle v-if="title">{{ title }}</SheetTitle>
      <div class="flex grow gap-px">
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
