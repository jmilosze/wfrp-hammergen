<script setup lang="ts">
import router from "../router.ts";
import ActionButton from "./ActionButton.vue";
import { onBeforeRouteLeave } from "vue-router";

const props = defineProps<{
  disabled: boolean;
  confirmExit: boolean;
  addAnother: boolean;
  saving: boolean;
  list: string;
  submitForm: () => Promise<void>;
}>();

onBeforeRouteLeave((_, __, next) => {
  if (props.disabled || !props.confirmExit) {
    next();
  } else {
    const answer = window.confirm("Changes that you made may not be saved.");
    if (answer) {
      next();
    } else {
      next(false);
    }
  }
});

async function onSave() {
  await props.submitForm();
  await router.push({ name: props.list });
}
</script>

<template>
  <div class="ml-1 mt-2 flex flex-wrap gap-4">
    <ActionButton v-if="!disabled" :spinner="saving" @click="onSave">Save</ActionButton>
    <ActionButton @click="router.push({ name: list })">Back to list</ActionButton>
  </div>
</template>

<style scoped></style>
