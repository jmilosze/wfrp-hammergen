<script setup lang="ts">
defineProps<{
  routeName: string;
  params?: any;
  query?: Record<string, string>;
  newWindow?: boolean;
}>();
</script>

<template>
  <RouterLink :to="{ name: routeName, params: params, query: query }" :target="newWindow ? '_blank' : ''">
    <span class="flex justify-between items-center">
      <slot />
    </span>
  </RouterLink>
</template>
