<script setup lang="ts" generic="T">
import { Icon } from "@iconify/vue";

// Labels in one row (e.g. a career level's characteristics or a spell's labels). Removable labels have the faint yellow
// of editable fields and a cross; read-only ones are white.
defineProps<{ labels: { text: string; value: T }[]; removable?: boolean }>();

const emit = defineEmits<{
  (e: "remove", value: T): void;
}>();
</script>

<template>
  <ul class="flex flex-wrap gap-2 list-none p-0 m-0">
    <li
      v-for="label in labels"
      :key="label.text"
      class="inline-flex items-center gap-1 rounded border border-neutral-400 px-2 py-0.5 font-semibold"
      :class="removable ? 'bg-editable pr-0.5' : 'bg-white'"
    >
      {{ label.text }}
      <button
        v-if="removable"
        type="button"
        class="text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 rounded p-0.5"
        :aria-label="`Remove ${label.text}`"
        @click="emit('remove', label.value)"
      >
        <Icon icon="lucide:x" class="size-4" />
      </button>
    </li>
  </ul>
</template>

<style scoped></style>
