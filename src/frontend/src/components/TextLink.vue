<script setup lang="ts">
defineProps<{ routeName?: string; params?: any; href?: string; sameWindow?: boolean }>();
</script>

<template>
  <RouterLink
    v-if="routeName"
    :to="{ name: routeName, params: params }"
    :target="sameWindow ? '' : '_blank'"
    class="text-blue-600 hover:underline"
  >
    <slot />
  </RouterLink>
  <a v-else-if="href" :href="href" target="_blank" class="text-blue-700 hover:underline"><slot /></a>
  <p v-else class="text-blue-700 hover:underline"><slot /></p>
</template>

<style scoped></style>
