<script setup lang="ts">
import { useRoute } from "vue-router";

const SIDE_VARIANT = {
  static: ["block", "hover:bg-neutral-700", "hover:text-amber-300", "py-1", "px-2", "rounded", "text-start"],
  unselected: [],
  selected: ["font-bold"],
};
const TOP_VARIANT = {
  static: ["hover:bg-neutral-800", "p-3", "rounded"],
  unselected: ["text-amber-300"],
  selected: ["text-amber-100"],
};

const props = defineProps<{ routeName?: string; href?: string; variant: "top" | "side" }>();

const route = useRoute();

function setClass() {
  if (props.variant == "top") {
    if (route.name == props.routeName && route.name != "placeholder") {
      return TOP_VARIANT.static.concat(TOP_VARIANT.selected);
    }
    return TOP_VARIANT.static.concat(TOP_VARIANT.unselected);
  } else {
    if (route.name == props.routeName && route.name != "placeholder") {
      return SIDE_VARIANT.static.concat(SIDE_VARIANT.selected);
    }
    return SIDE_VARIANT.static.concat(SIDE_VARIANT.unselected);
  }
}
</script>

<template>
  <RouterLink v-if="routeName" :to="{ name: routeName }" :class="setClass()">
    <slot />
  </RouterLink>
  <a v-else-if="href" :href="href" target="_blank" :class="setClass()"><slot /></a>
  <button v-else :class="[...setClass(), 'w-full', 'h-fit']"><slot /></button>
</template>

<style scoped></style>
