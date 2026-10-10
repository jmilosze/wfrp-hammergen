<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

// top: dark top bar, secondary: light bar under it, menu: dropdown panel, side: mobile sidebar.
const VARIANTS = {
  top: {
    static: ["block", "px-3", "py-2", "rounded", "select-none", "whitespace-nowrap", "hover:bg-neutral-800"],
    unselected: ["text-amber-300"],
    selected: ["bg-neutral-800", "text-amber-100"],
  },
  secondary: {
    static: ["block", "px-3", "py-0.5", "rounded", "select-none", "whitespace-nowrap", "hover:bg-neutral-300"],
    unselected: ["text-neutral-600", "hover:text-neutral-900"],
    selected: ["bg-neutral-300", "text-neutral-900"],
  },
  menu: {
    static: ["block", "px-3", "py-1.5", "rounded", "select-none", "whitespace-nowrap"],
    unselected: ["hover:bg-neutral-700", "hover:text-amber-300"],
    selected: ["bg-neutral-700", "text-amber-300"],
  },
  side: {
    static: ["block", "w-full", "py-1", "px-2", "rounded", "select-none", "text-end"],
    unselected: ["hover:bg-neutral-700", "hover:text-amber-300"],
    selected: ["bg-neutral-700", "text-amber-300"],
  },
};

// activeRoutes: other routes on which the link counts as selected (e.g. the editor of a list).
const props = defineProps<{
  routeName?: string;
  href?: string;
  activeRoutes?: string[];
  variant: keyof typeof VARIANTS;
}>();

const route = useRoute();

const linkClass = computed(() => {
  const variant = VARIANTS[props.variant];
  const name = route.name;
  const selected =
    name === props.routeName || (typeof name === "string" && props.activeRoutes?.includes(name) === true);
  return variant.static.concat(selected ? variant.selected : variant.unselected);
});
</script>

<template>
  <RouterLink v-if="routeName" :to="{ name: routeName }" :class="linkClass">
    <slot />
  </RouterLink>
  <a v-else-if="href" :href="href" target="_blank" :class="linkClass">
    <slot />
  </a>
  <button v-else :class="linkClass">
    <slot />
  </button>
</template>

<style scoped></style>
