<script setup lang="ts" generic="T">
import IconButton from "@/components/ui/IconButton.vue";

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
      <IconButton
        v-if="removable"
        icon="lucide:x"
        size="sm"
        :label="`Remove ${label.text}`"
        @click="emit('remove', label.value)"
      />
    </li>
  </ul>
</template>
