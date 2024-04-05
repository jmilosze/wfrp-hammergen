<script setup lang="ts">
import { ref, computed } from "vue";
import SpinnerAnimation from "./SpinnerAnimation.vue";

const props = defineProps<{
  variant?: "normal" | "red" | "amber";
  size?: "md" | "sm";
  spinner?: boolean;
}>();

const btnClass = ref(["rounded", "active:outline", "outline-2", "outline-neutral-400", "select-none"]);

if (props.variant === "red") {
  btnClass.value.push(...["bg-red-600", "hover:bg-red-800", "text-neutral-50"]);
} else if (props.variant === "amber") {
  btnClass.value.push(...["bg-amber-300", "hover:bg-amber-400", "text-neutral-600"]);
} else {
  btnClass.value.push(...["bg-neutral-600", "hover:bg-neutral-800", "text-neutral-50"]);
}

if (props.size === "sm") {
  btnClass.value.push(...["p-2", "text-sm"]);
} else {
  btnClass.value.push(...["px-3", "py-2"]);
}

const spinnerClass = computed(() => {
  if (props.spinner) {
    return ["w-4", "h-4", "ml-2"];
  } else {
    return ["w-4", "h-4", "ml-2", "hidden"];
  }
});
</script>

<template>
  <div>
    <button :class="btnClass">
      <span class="flex justify-between items-center">
        <slot></slot>
        <SpinnerAnimation :class="spinnerClass" />
      </span>
    </button>
  </div>
</template>
