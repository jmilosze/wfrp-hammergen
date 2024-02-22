<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new mutation.</div>
  <div v-else>Modify/View mutation {{ id }}</div>
</template>

<style scoped></style>
