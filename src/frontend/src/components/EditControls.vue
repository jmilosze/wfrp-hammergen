<script setup lang="ts">
import router from "../router.ts";
import ActionButton from "./ActionButton.vue";
import { onBeforeRouteLeave } from "vue-router";
import { ref } from "vue";

const props = defineProps<{
  disabled: boolean;
  confirmExit: boolean;
  allowAddAnother?: boolean;
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

const addAnother = ref(false);
</script>

<template>
  <div class="ml-1 mt-2">
    <div v-if="allowAddAnother === true && !disabled" class="my-2">
      <div>Add another after saving?</div>
      <input v-model="addAnother" type="radio" value="One" class="mr-2 mt-1" />
      <span class="mr-5">Yes</span>
      <input v-model="addAnother" type="radio" value="Two" class="mr-2" />
      <span>No</span>
    </div>
    <div class="flex flex-wrap gap-4">
      <ActionButton v-if="!disabled" :spinner="saving" @click="onSave">Save</ActionButton>
      <ActionButton @click="router.push({ name: list })">Back to list</ActionButton>
    </div>
  </div>
</template>

<style scoped></style>
