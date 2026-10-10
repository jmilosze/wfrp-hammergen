<script setup lang="ts">
// A navigation entry: an internal route, an external link (new tab) or, with neither, a button. The parent styles it
// through class, which falls through to the element.
defineProps<{
  routeName?: string;
  href?: string;
}>();
</script>

<template>
  <RouterLink v-if="routeName" :to="{ name: routeName }">
    <slot />
  </RouterLink>
  <a v-else-if="href" :href="href" target="_blank">
    <slot />
  </a>
  <button v-else>
    <slot />
  </button>
</template>

<style scoped></style>
