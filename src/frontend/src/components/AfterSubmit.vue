<script setup lang="ts">
import AlertBlock from "./AlertBlock.vue";
import { SubmissionState } from "../utils/submission.ts";

defineProps<{
  submissionState: SubmissionState;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div>
    <AlertBlock
      v-if="submissionState.status === 'failure' && submissionState.message !== ''"
      alertType="red"
      @click="emit('close')"
    >
      {{ submissionState.message }}
    </AlertBlock>
    <AlertBlock
      v-if="submissionState.status === 'success' && submissionState.message !== ''"
      alertType="green"
      @click="emit('close')"
    >
      {{ submissionState.message }}
    </AlertBlock>
  </div>
</template>

<style scoped></style>
