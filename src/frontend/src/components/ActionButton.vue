<script setup lang="ts">
import { computed } from "vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { useButton } from "../composables/button.ts";

const props = defineProps<{
  variant?: "normal" | "red" | "amber";
  size?: "md" | "sm";
  spinner?: boolean;
}>();

const { btnClass } = useButton(props.variant, props.size);

const spinnerClass = computed(() => {
  if (props.spinner) {
    return ["w-4", "h-4", "ml-2"];
  } else {
    return ["w-4", "h-4", "ml-2", "hidden"];
  }
});
</script>

<template>
  <button :class="btnClass">
    <span class="flex justify-between items-center">
      <slot></slot>
      <SpinnerAnimation :class="spinnerClass" />
    </span>
  </button>
</template>
