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
  resetForm: () => void;
}>();

const saveClicked = ref(false);

onBeforeRouteLeave((_, __, next) => {
  if (props.disabled || !props.confirmExit || saveClicked.value) {
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

const addAnother = ref(false);

async function onSave() {
  await props.submitForm();
  if (addAnother.value) {
    props.resetForm();
  } else {
    saveClicked.value = true;
    await router.push({ name: props.list });
  }
}
</script>

<template>
  <div class="ml-1">
    <div v-if="allowAddAnother === true && !disabled" class="my-2">
      <div>Add another after saving?</div>
      <div class="flex my-3">
        <div class="flex items-center">
          <input v-model="addAnother" type="radio" :value="true" class="mr-2 w-5 h-5 accent-neutral-600" />
          <div class="mr-5">Yes</div>
        </div>
        <div class="flex items-center">
          <input v-model="addAnother" type="radio" :value="false" class="mr-2 w-5 h-5 accent-neutral-600" />
          <div>No</div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-4">
      <ActionButton v-if="!disabled" :spinner="saving" @click="onSave">Save</ActionButton>
      <ActionButton @click="router.push({ name: list })">Back to list</ActionButton>
    </div>
  </div>
</template>

<style scoped></style>
