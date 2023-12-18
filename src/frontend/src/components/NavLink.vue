<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";

const SIDE_VARIANT = {
  static: ["block hover:bg-neutral-700 hover:text-amber-300 py-1 px-2 rounded"],
  hover: ["font-bold"],
};
const TOP_VARIANT = {
  static: ["block text-amber-300 hover:bg-neutral-800 p-3 rounded"],
  hover: ["text-amber-100"],
};

const props = defineProps<{ routeName?: string; href?: string; variant: "top" | "side" }>();

const route = useRoute();

const style = computed(() => {
  if (props.variant == "top") {
    if (route.name == props.routeName && route.name != "placeholder") {
      return TOP_VARIANT.static.concat(TOP_VARIANT.hover);
    }
    return TOP_VARIANT.static;
  } else {
    if (route.name == props.routeName && route.name != "placeholder") {
      return SIDE_VARIANT.static.concat(SIDE_VARIANT.hover);
    }
    return SIDE_VARIANT.static;
  }
});
</script>

<template>
  <RouterLink v-if="routeName" :to="{ name: routeName }" :class="style">
    <slot />
  </RouterLink>
  <div v-else-if="href">
    <a :href="href" target="_blank" :class="style"><slot /></a>
  </div>
  <button v-else :class="[...style, 'text-start', 'w-full']"><slot /></button>
</template>

<style scoped></style>
