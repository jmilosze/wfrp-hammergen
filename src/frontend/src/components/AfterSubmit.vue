<script setup lang="ts">
import AlertBlock from "./AlertBlock.vue";
import { SubmissionState } from "../utils/submission.ts";

defineProps<{
  submissionState: SubmissionState;
}>();
</script>

<template>
  <div>
    <AlertBlock v-if="submissionState.status === 'failure' && submissionState.message !== ''" alertType="red">
      {{ submissionState.message }}
    </AlertBlock>
    <AlertBlock v-if="submissionState.status === 'success' && submissionState.message !== ''" alertType="green">
      {{ submissionState.message }}
    </AlertBlock>
  </div>
</template>

<style scoped></style>
