<script setup lang="ts">
const props = defineProps<{
  variant?: "normal" | "danger" | "amber";
}>();

function setClass() {
  if (props.variant && props.variant == "danger") {
    return "bg-red-600 hover:bg-red-800 rounded text-neutral-50 px-3 py-2 active:outline outline-2 outline-red-400 select-none";
  }
  if (props.variant && props.variant == "amber") {
    return "bg-amber-300 hover:bg-amber-400 rounded text-neutral-600 px-3 py-2 active:outline outline-2 outline-neutral-400 select-none";
  } else {
    return "bg-neutral-600 hover:bg-neutral-800 rounded text-neutral-50 px-3 py-2 active:outline outline-2 outline-neutral-400 select-none";
  }
}
</script>

<template>
  <button :class="setClass()">
    <slot></slot>
  </button>
</template>
