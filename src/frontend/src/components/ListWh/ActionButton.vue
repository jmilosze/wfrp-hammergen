<script setup lang="ts">
defineProps<{
  variant?: "normal" | "danger" | "amber";
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <button
    v-if="!variant || variant === 'normal'"
    class="mr-2 bg-neutral-600 hover:bg-neutral-800 rounded text-neutral-50 p-2 active:outline outline-2 outline-neutral-400 select-none text-sm"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
  <button
    v-if="variant === 'danger'"
    class="bg-red-600 hover:bg-red-800 rounded text-neutral-50 p-2 active:outline outline-2 outline-neutral-400 select-none text-sm"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
  <button
    v-if="variant === 'amber'"
    class="mr-2 bg-amber-300 hover:bg-amber-400 rounded text-neutral-600 p-2 active:outline outline-2 outline-neutral-400 select-none text-sm"
    @click="emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
