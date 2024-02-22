<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new skill.</div>
  <div v-else>Modify/View skill {{ id }}</div>
</template>

<style scoped></style>
