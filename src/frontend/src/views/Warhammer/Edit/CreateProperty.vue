<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new property.</div>
  <div v-else>Modify/View property {{ id }}</div>
</template>

<style scoped></style>
