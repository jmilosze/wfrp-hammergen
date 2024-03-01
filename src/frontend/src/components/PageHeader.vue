<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div>
    <div class="text-3xl font-semibold mt-5 pb-2 border-b-2 border-neutral-200">{{ title }}</div>
    <div class="pt-2 text-justify">
      <p><slot></slot></p>
    </div>
  </div>
</template>

<style scoped></style>
