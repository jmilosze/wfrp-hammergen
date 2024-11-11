<script setup lang="ts">
const props = defineProps<{
  routeName?: string;
  params?: any;
  query?: any;
  href?: string;
  sameWindow?: boolean;
  noColour?: boolean;
}>();

const linkClass = ["hover:underline", "font-semibold"];
if (!props.noColour) {
  linkClass.push("text-red-700");
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
  <a v-else-if="href" :href="href" target="_blank" :class="linkClass"><slot /></a>
  <p v-else :class="linkClass"><slot /></p>
</template>

<style scoped></style>
