<script setup lang="ts">
import AlertBlock from "./AlertBlock.vue";

withDefaults(
  defineProps<{
    display: boolean;
    submissionSuccessful: boolean;
    message: string;
  }>(),
  {
    display: false,
    submissionSuccessful: false,
    message: "",
  },
);
</script>

<template>
  <AlertBlock alertType="red" :visible="display && !submissionSuccessful">{{ message }}</AlertBlock>
  <AlertBlock alertType="green" :visible="display && submissionSuccessful">{{ message }}</AlertBlock>
</template>

<style scoped></style>
