<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  alertType?: "green" | "red";
}>();

const blockClass = ref(["p-2", "rounded", "border"]);

if (props.alertType === "red") {
  blockClass.value.push(...["bg-red-200", "text-red-800", "border-red-500"]);
} else {
  blockClass.value.push(...["bg-green-200", "text-green-800", "border-green-500"]);
}
</script>

<template>
  <div :class="blockClass">
    <slot></slot>
  </div>
</template>
