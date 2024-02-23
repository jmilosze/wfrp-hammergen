<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new item.</div>
  <div v-else>Modify/View item {{ id }}</div>
</template>

<style scoped></style>
