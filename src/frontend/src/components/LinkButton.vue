<script setup lang="ts">
defineProps<{
  routeName: string;
  params?: any;
  newWindow?: boolean;
}>();
</script>

<template>
  <RouterLink :to="{ name: routeName, params: params }" :target="newWindow ? '_blank' : ''">
    <span class="flex justify-between items-center">
      <slot />
    </span>
  </RouterLink>
</template>
