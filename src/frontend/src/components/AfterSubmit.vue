<script setup lang="ts">
import AlertBlock from "./AlertBlock.vue";
import { SubmissionState } from "../utils/submission.ts";

defineProps<{
  submissionState: SubmissionState;
  visible: boolean;
  centered?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div v-if="visible">
    <AlertBlock
      v-if="submissionState.status === 'failure' && submissionState.message !== ''"
      alertType="red"
      :centered="centered"
      @close="emit('close')"
    >
      {{ submissionState.message }}
    </AlertBlock>
    <AlertBlock
      v-if="submissionState.status === 'success' && submissionState.message !== ''"
      alertType="green"
      :centered="centered"
      @close="emit('close')"
    >
      {{ submissionState.message }}
    </AlertBlock>
  </div>
</template>

<style scoped></style>
