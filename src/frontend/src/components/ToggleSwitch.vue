<script setup lang="ts" generic="T extends string">
import { computed } from "vue";

const props = defineProps<{
  options: { value: T; text: string }[];
  label: string;
}>();

const model = defineModel<T>({ required: true });

const selectedIndex = computed(() => props.options.findIndex((option) => option.value === model.value));
</script>

<template>
  <div
    class="relative inline-grid rounded-full border-2 border-neutral-700 p-0.5 select-none"
    :style="{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }"
    role="radiogroup"
    :aria-label="label"
  >
    <span
      v-if="selectedIndex >= 0"
      class="absolute top-0.5 bottom-0.5 left-0.5 rounded-full bg-neutral-700 transition-transform duration-200"
      :style="{
        width: `calc((100% - 0.25rem) / ${options.length})`,
        transform: `translateX(${selectedIndex * 100}%)`,
      }"
    />
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      class="relative z-10 px-4 py-0.5 rounded-full font-semibold transition-colors duration-200"
      :class="model === option.value ? 'text-amber-300' : 'text-neutral-700 hover:text-neutral-950'"
      @click="model = option.value"
    >
      {{ option.text }}
    </button>
  </div>
</template>
