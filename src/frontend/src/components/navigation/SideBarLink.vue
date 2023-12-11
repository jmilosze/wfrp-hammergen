<script setup lang="ts">
defineProps<{ routeName: string }>();
defineEmits<{}>();

import { useRoute } from "vue-router";
const route = useRoute();
</script>

<template>
  <RouterLink
    :to="{ name: routeName }"
    class="block hover:bg-neutral-700 hover:text-amber-300 py-1 px-2 rounded"
    :class="[route.name == routeName && route.name != 'placeholder' ? 'font-bold' : '']"
  >
    <slot />
  </RouterLink>
</template>

<style scoped></style>
