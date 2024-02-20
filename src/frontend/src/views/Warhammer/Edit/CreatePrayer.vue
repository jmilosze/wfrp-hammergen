<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new prayer.</div>
  <div v-else>Modify/View prayer {{ id }}</div>
</template>

<style scoped></style>
