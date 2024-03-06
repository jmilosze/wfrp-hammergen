<script setup lang="ts">
defineProps<{ routeName?: string; href?: string }>();
</script>

<template>
  <RouterLink v-if="routeName" :to="{ name: routeName }" target="_blank" class="text-blue-600 hover:underline"
    ><slot
  /></RouterLink>
  <a v-else-if="href" :href="href" target="_blank" class="text-blue-600 hover:underline"><slot /></a>
  <p v-else class="text-blue-600 hover:underline"><slot /></p>
</template>

<style scoped></style>
