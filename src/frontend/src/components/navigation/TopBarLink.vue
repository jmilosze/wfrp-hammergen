<script setup lang="ts">
defineProps<{ routeName: string }>();

import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <RouterLink
    :to="{ name: routeName }"
    class="text-amber-300 hover:bg-neutral-800 p-3 rounded"
    :class="[route.name == routeName && route.name != 'placeholder' ? 'text-amber-100' : '']"
  >
    <slot />
  </RouterLink>
</template>

<style scoped></style>
