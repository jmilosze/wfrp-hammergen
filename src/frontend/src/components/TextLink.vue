<script setup lang="ts">
import { Icon } from "@iconify/vue";

// A web link opens in a new tab and is marked with an icon; mailto links get no icon.
const props = defineProps<{
  routeName?: string;
  params?: any;
  query?: any;
  href?: string;
  sameWindow?: boolean;
  noColour?: boolean;
}>();

const linkClass = ["group", "hover:underline", "font-semibold"];
if (!props.noColour) {
  linkClass.push("text-danger-700");
}
</script>

<template>
  <RouterLink
    v-if="routeName"
    :to="{ name: routeName, params: params, query: query }"
    :target="sameWindow ? '' : '_blank'"
    :class="linkClass"
  >
    <slot />
  </RouterLink>
  <a v-else-if="href" :href="href" target="_blank" :class="linkClass">
    <slot v-if="href.startsWith('mailto:')" />
    <!-- The inline-flex row drops the whitespace around the slot text, as in NavLink. The link's underline does not
    reach into an inline-flex box, so the row underlines itself. -->
    <span v-else class="inline-flex items-baseline gap-1 group-hover:underline">
      <slot />
      <Icon
        icon="lucide:external-link"
        class="shrink-0 size-[0.9em] relative top-[0.1em]"
        aria-label="opens in a new tab"
      />
    </span>
  </a>
  <p v-else :class="linkClass"><slot /></p>
</template>

<style scoped></style>
