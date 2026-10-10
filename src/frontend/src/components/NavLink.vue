<script setup lang="ts">
import { Icon } from "@iconify/vue";

// A navigation entry: an internal route, an external link (new tab, marked with an icon) or, with neither, a button.
// The parent styles it through class, which falls through to the element.
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
    <Icon icon="lucide:external-link" class="inline size-[1em] ml-1 align-[-0.15em]" aria-label="opens in a new tab" />
  </a>
  <button v-else>
    <slot />
  </button>
</template>

<style scoped></style>
