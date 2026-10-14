<script setup lang="ts">
// A labelled cell of a SheetTable that shows content rather than an input; the slot is the cell's content.
// editable: the content can be changed elsewhere (e.g. picked with an Edit button), so it gets the faint yellow of
// editable cells.
defineProps<{ title: string; editable?: boolean }>();
</script>

<template>
  <div class="flex items-stretch min-w-0 bg-white">
    <div
      data-sheet-label
      class="flex items-center shrink-0 min-w-32 px-2 border-r border-neutral-300 font-semibold whitespace-nowrap"
    >
      {{ title }}
    </div>
    <div class="flex flex-col justify-center flex-1 min-w-0 min-h-9 px-2 py-1" :class="{ 'bg-editable': editable }">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
