<script setup lang="ts">
// Read-only tags (e.g. spell or rune labels), styled so they are not mistaken for buttons.
defineProps<{ labelList: string[] }>();
</script>

<template>
  <div class="flex flex-wrap gap-1">
    <div
      v-for="(label, i) in labelList.toSorted((a, b) => a.localeCompare(b))"
      :key="i"
      class="px-2 py-0.5 rounded-full border-2 border-neutral-600 bg-neutral-100 text-sm text-neutral-700 select-none"
    >
      {{ label }}
    </div>
  </div>
</template>
