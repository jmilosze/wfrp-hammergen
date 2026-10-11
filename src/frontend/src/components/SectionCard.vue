<script setup lang="ts">
import SpinnerAnimation from "./SpinnerAnimation.vue";

// A titled box in the style of the paper character sheet (see SheetTable): a grey title band with optional hint and
// actions, then the content. The last row of any table inside drops its bottom border, which the box draws.
defineProps<{
  title: string;
  loading?: boolean;
}>();
</script>

<template>
  <div class="bg-white border border-neutral-400 min-w-fit [&_tbody>tr:last-child>td]:border-b-0">
    <div class="flex flex-wrap items-center justify-between gap-2 px-2 py-1 border-b border-neutral-300 bg-neutral-200">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-neutral-600 select-none">{{ title }}</span>
        <slot name="hint" />
      </div>
      <div class="flex flex-wrap gap-2">
        <slot name="actions" />
      </div>
    </div>
    <div v-if="loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <slot v-else />
  </div>
</template>

<style scoped></style>
