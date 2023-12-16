<script setup lang="ts">
import { computed } from "vue";

type AlertType = "green" | "red";

const props = withDefaults(
  defineProps<{
    alertType: AlertType;
    visible: boolean;
  }>(),
  {
    alertType: "red",
    visible: true,
  },
);

const colour = computed(() => {
  if (props.alertType === "green") {
    return ["bg-green-200", "text-green-800", "border-green-500"];
  }
  if (props.alertType === "red") {
    return ["bg-red-200", "text-red-800", "border-red-500"];
  }

  return { bg: "bg-red-400", text: "text-red-700" };
});
</script>

<template>
  <div :class="[...colour, visible ? '' : 'hidden']" class="text-neutral-50 p-2 rounded border">
    <slot></slot>
  </div>
</template>
