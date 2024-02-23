<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Viewcharacter.</div>
  <div v-else>View character {{ id }}</div>
</template>

<style scoped></style>
