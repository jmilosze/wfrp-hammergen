<script setup lang="ts">
import { computed } from "vue";

// 5e Career Advancement Tracker: one row of boxes per career, with the next career level reached
// after 10, 22 and 36 ticks (pp. 23, 196).
const props = defineProps<{
  ticks: number;
}>();

const LEVEL_TICKS = [
  { level: 2, ticks: 10 },
  { level: 3, ticks: 22 },
  { level: 4, ticks: 36 },
];

const segments = computed(() => {
  let start = 0;
  return LEVEL_TICKS.map(({ level, ticks }) => {
    const boxes = Array.from({ length: ticks - start }, (_, i) => start + i < props.ticks);
    start = ticks;
    return { level, boxes };
  });
});
</script>

<template>
  <div class="flex flex-wrap items-center gap-1" :aria-label="`Career Advancement Tracker: ${ticks} of 36 ticks`">
    <template v-for="segment in segments" :key="segment.level">
      <span
        v-for="(ticked, i) in segment.boxes"
        :key="i"
        class="inline-block size-3 border border-neutral-500"
        :class="ticked ? 'bg-neutral-700' : 'bg-white'"
      />
      <span class="mx-1 text-sm font-semibold" :title="`Career level ${segment.level}`">{{ segment.level }}</span>
    </template>
  </div>
</template>

<style scoped></style>
