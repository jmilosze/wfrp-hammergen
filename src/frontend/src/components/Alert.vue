<script setup lang="ts">
import { computed } from "vue";

type AlertType = "green" | "red";

const GREEN_SCHEME = ["bg-green-200", "text-green-800", "border-green-500"];
const RED_SCHEME = ["bg-red-200", "text-red-800", "border-red-500"];

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
  if (props.alertType === "red") {
    return RED_SCHEME;
  } else {
    return GREEN_SCHEME;
  }
});
</script>

<template>
  <div :class="[...colour, visible ? '' : 'hidden']" class="text-neutral-50 p-2 rounded border">
    <slot></slot>
  </div>
</template>
