<script setup lang="ts">
// Warns that modifiers of 4e talents, traits and mutations on a 5e character are not applied (R8).
defineProps<{
  names: string[];
}>();
</script>

<template>
  <div v-if="names.length > 0" role="note" class="p-2 rounded border bg-amber-100 text-amber-900 border-amber-700">
    Modifiers of 4e content are not taken into account: {{ names.join(", ") }}.
  </div>
</template>

<style scoped></style>
