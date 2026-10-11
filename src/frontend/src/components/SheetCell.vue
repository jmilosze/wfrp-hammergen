<script setup lang="ts">
// A labelled read-only cell of a SheetTable; the slot is the cell's content.
defineProps<{ title: string }>();
</script>

<template>
  <div class="flex items-stretch min-w-0 bg-white">
    <div class="flex items-center shrink-0 min-w-32 px-2 border-r border-neutral-300 font-semibold whitespace-nowrap">
      {{ title }}
    </div>
    <div class="flex flex-col justify-center flex-1 min-w-0 min-h-9 px-2 py-1">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
