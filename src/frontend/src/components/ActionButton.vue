<script setup lang="ts">
import SpinnerAnimation from "./SpinnerAnimation.vue";

defineProps<{
  spinner?: boolean;
}>();
</script>

<template>
  <button>
    <span class="flex justify-between items-center">
      <span class="text-center mx-auto">
        <slot />
      </span>
      <SpinnerAnimation class="w-4 h-4 ml-2" :class="{ hidden: !spinner }" />
    </span>
  </button>
</template>
