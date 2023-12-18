<script setup lang="ts">
defineProps<{ routeName: string }>();

import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <RouterLink
    :to="{ name: routeName }"
    class="text-amber-300 hover:text-amber-100"
    :class="[route.name == routeName && route.name != 'placeholder' ? 'text-amber-200' : '']"
  >
    <slot />
  </RouterLink>
</template>

<style scoped></style>
