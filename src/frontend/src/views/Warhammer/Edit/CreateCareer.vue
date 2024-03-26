<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new career.</div>
  <div v-else>Modify/View career {{ id }}</div>
</template>

<style scoped></style>
