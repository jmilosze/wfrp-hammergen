<script setup lang="ts">
import { Icon } from "@iconify/vue";

// A navigation entry: an internal route, an external link (new tab, marked with an icon) or, with neither, a button.
// The parent styles it through class, which falls through to the element. An optional icon goes before the text.
defineProps<{
  routeName?: string;
  href?: string;
  icon?: string;
}>();
</script>

<template>
  <!-- The inline-flex row drops the whitespace around the slot text; baseline alignment plus the offset centres the
  icons on the capital letters. -->
  <RouterLink v-if="routeName" :to="{ name: routeName }">
    <span class="inline-flex items-baseline gap-1.5">
      <Icon v-if="icon" :icon="icon" class="shrink-0 size-[1em] relative top-[0.15em]" />
      <slot />
    </span>
  </RouterLink>
  <a v-else-if="href" :href="href" target="_blank">
    <span class="inline-flex items-baseline gap-1.5">
      <Icon v-if="icon" :icon="icon" class="shrink-0 size-[1em] relative top-[0.15em]" />
      <slot />
      <Icon
        icon="lucide:external-link"
        class="shrink-0 size-[1em] relative top-[0.15em]"
        aria-label="opens in a new tab"
      />
    </span>
  </a>
  <button v-else>
    <span class="inline-flex items-baseline gap-1.5">
      <Icon v-if="icon" :icon="icon" class="shrink-0 size-[1em] relative top-[0.15em]" />
      <slot />
    </span>
  </button>
</template>

<style scoped></style>
