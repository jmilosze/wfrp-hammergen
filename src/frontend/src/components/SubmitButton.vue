<script setup lang="ts">
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { SubmissionState } from "../utils/submission.ts";

const props = defineProps<{
  submissionState: SubmissionState;
  variant?: "normal" | "danger";
}>();

function setClass() {
  if (props.variant && props.variant == "danger") {
    return "bg-red-600 hover:bg-red-800 rounded text-neutral-50 px-3 py-2 active:outline outline-2 outline-red-400 select-none";
  } else {
    return "bg-neutral-600 hover:bg-neutral-800 rounded text-neutral-50 px-3 py-2 active:outline outline-2 outline-neutral-400 select-none";
  }
}
</script>

<template>
  <button :class="setClass()">
    <span class="flex justify-between items-center">
      <slot></slot>
      <SpinnerAnimation class="w-4 h-4 ml-2" :class="[submissionState.status == 'inProgress' ? '' : 'hidden']" />
    </span>
  </button>
</template>
