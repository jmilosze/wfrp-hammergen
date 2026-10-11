<script setup lang="ts">
import SpinnerAnimation from "./SpinnerAnimation.vue";

defineProps<{
  title: string;
  loading?: boolean;
}>();
</script>

<template>
  <div class="bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit overflow-hidden">
    <div
      class="flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 border-b border-neutral-300 bg-neutral-100"
    >
      <div class="flex items-center gap-2">
        <span class="font-semibold">{{ title }}</span>
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
