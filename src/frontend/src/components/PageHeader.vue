<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 mt-5 pb-2 border-b-2 border-neutral-200">
    <div class="text-3xl font-semibold">{{ title }}</div>
    <slot name="nextToHeader" />
  </div>

  <div class="pt-2 text-justify">
    <p><slot /></p>
  </div>
</template>

<style scoped></style>
