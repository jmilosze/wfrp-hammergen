<script setup lang="ts">
import IconButton from "./IconButton.vue";
import CopyButton from "./CopyButton.vue";

// A character list row's View (the character sheet) and Copy.
defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  (e: "copy"): void;
}>();
</script>

<template>
  <div class="flex gap-2 my-1 shrink-0">
    <IconButton
      :to="{ name: 'viewCharacter', params: { id } }"
      icon="lucide:eye"
      label="View"
      variant="light"
      size="sm"
    />
    <CopyButton @copy="emit('copy')" />
  </div>
</template>
