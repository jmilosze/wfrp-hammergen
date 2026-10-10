<script setup lang="ts" generic="T extends string">
import { computed } from "vue";

const COLORS = {
  light: {
    border: "border-neutral-700",
    pill: "bg-neutral-700",
    selected: "text-amber-300",
    unselected: "text-neutral-700 hover:text-neutral-950",
  },
  dark: {
    border: "border-amber-300",
    pill: "bg-amber-300",
    selected: "text-neutral-900",
    unselected: "text-amber-300 hover:text-amber-100",
  },
};

// dark: for a dark background (the top bar).
const props = defineProps<{
  options: { value: T; text: string }[];
  label: string;
  dark?: boolean;
}>();

const model = defineModel<T>({ required: true });

const selectedIndex = computed(() => props.options.findIndex((option) => option.value === model.value));
const colors = computed(() => (props.dark ? COLORS.dark : COLORS.light));
</script>

<template>
  <div
    class="relative inline-grid rounded-full border-2 p-0.5 select-none"
    :class="colors.border"
    :style="{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }"
    role="radiogroup"
    :aria-label="label"
  >
    <span
      v-if="selectedIndex >= 0"
      class="absolute top-0.5 bottom-0.5 left-0.5 rounded-full transition-transform duration-200"
      :class="colors.pill"
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
      :class="model === option.value ? colors.selected : colors.unselected"
      @click="model = option.value"
    >
      {{ option.text }}
    </button>
  </div>
</template>
