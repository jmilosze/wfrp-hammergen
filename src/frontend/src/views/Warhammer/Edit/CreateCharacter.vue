<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new character.</div>
  <div v-else>Modify character {{ id }}</div>
</template>

<style scoped></style>
