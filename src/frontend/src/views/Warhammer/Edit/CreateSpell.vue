<script setup lang="ts">
defineProps<{
  id: string;
}>();
</script>

<template>
  <div v-if="id === 'create'">Create new spell.</div>
  <div v-else>Modify/View spell {{ id }}</div>
</template>

<style scoped></style>
