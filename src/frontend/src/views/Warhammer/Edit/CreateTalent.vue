<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new talent.</div>
  <div v-else>Modify/View talent {{ id }}</div>
</template>

<style scoped></style>
