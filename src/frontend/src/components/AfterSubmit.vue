<script setup lang="ts">
import AlertBlock from "./AlertBlock.vue";
import { SubmissionState } from "../utils/submission.ts";

defineProps<{
  submissionState: SubmissionState;
}>();
</script>

<template>
  <div>
    <AlertBlock alertType="red" :visible="submissionState.status == 'failure' && submissionState.message != ''">
      {{ submissionState.message }}
    </AlertBlock>
    <AlertBlock alertType="green" :visible="submissionState.status == 'success' && submissionState.message != ''">
      {{ submissionState.message }}
    </AlertBlock>
  </div>
</template>

<style scoped></style>
