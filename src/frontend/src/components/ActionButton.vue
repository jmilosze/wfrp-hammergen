<script setup lang="ts">
const props = defineProps<{
  variant?: "normal" | "danger";
}>();

function setClass() {
  if (props.variant && props.variant == "danger") {
    return "bg-red-600 hover:bg-red-800 rounded text-neutral-50 px-3 py-2 active:outline outline-2 outline-red-400";
  } else {
    return "bg-neutral-600 hover:bg-neutral-800 rounded text-neutral-50 px-3 py-2 active:outline outline-2 outline-neutral-400";
  }
}
</script>

<template>
  <button :class="setClass()">
    <slot></slot>
  </button>
</template>
