<script setup lang="ts">
type AlertType = "green" | "red";

const GREEN_SCHEME = ["bg-green-200", "text-green-800", "border-green-500", "p-2", "rounded", "border"];
const RED_SCHEME = ["bg-red-200", "text-red-800", "border-red-500", "p-2", "rounded", "border"];

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

function setClass() {
  if (props.alertType === "red") {
    return RED_SCHEME;
  } else {
    return GREEN_SCHEME;
  }
}
</script>

<template>
  <div :class="[...setClass(), visible ? '' : 'hidden']">
    <slot></slot>
  </div>
</template>
