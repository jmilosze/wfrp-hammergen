<script setup lang="ts">
defineProps<{ labelList: string[] }>();
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <div
      v-for="(label, i) in labelList.toSorted((a, b) => a.localeCompare(b))"
      :key="i"
      class="border p-1 border-neutral-500 rounded bg-amber-200"
    >
      {{ label }}
    </div>
  </div>
</template>
