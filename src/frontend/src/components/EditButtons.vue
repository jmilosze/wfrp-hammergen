<script setup lang="ts">
import router from "../router.ts";
import ActionButton from "./ActionButton.vue";
import { onBeforeRouteLeave } from "vue-router";
import { ref } from "vue";
import { SubmissionState } from "../utils/submission.ts";

onBeforeRouteLeave((to, from, next) => {
  if (1 === 3) {
    next();
  } else {
    const answer = window.confirm("zxc");
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
});

const submissionState = ref(new SubmissionState());
async function submitForm() {}
</script>

<template>
  <div class="ml-1 mt-2 flex flex-wrap gap-4">
    <ActionButton :spinner="submissionState.status === 'inProgress'" @click="submitForm">Save</ActionButton>
    <ActionButton @click="router.push({ name: 'prayers' })">Back to list</ActionButton>
  </div>
</template>

<style scoped></style>
