<script setup lang="ts">
import router from "../router.ts";
import ActionButton from "./ActionButton.vue";
import { onBeforeRouteLeave } from "vue-router";
import { ref } from "vue";
import DoubleRadioButton from "./DoubleRadioButton.vue";

const props = defineProps<{
  readOnly: boolean;
  confirmExit: boolean;
  allowAddAnother?: boolean;
  saving: boolean;
  list: string;
  submitForm: () => Promise<boolean>;
  resetForm: () => void;
}>();

const saveClicked = ref(false);

onBeforeRouteLeave((_, __, next) => {
  if (props.readOnly || !props.confirmExit || saveClicked.value) {
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
  if (!(await props.submitForm())) {
    return;
  }
  if (addAnother.value) {
    props.resetForm();
  } else {
    saveClicked.value = true;
    await router.push({ name: props.list });
  }
}
</script>

<template>
  <div>
    <div v-if="allowAddAnother === true && !readOnly" class="my-2">
      <DoubleRadioButton
        v-model="addAnother"
        title="Add another after saving?"
        trueText="Yes"
        falseText="No"
        class="my-3"
      />
    </div>
    <div class="flex flex-wrap gap-4">
      <ActionButton v-if="!readOnly" :spinner="saving" @click="onSave">Save</ActionButton>
      <ActionButton @click="router.go(-1)">Back</ActionButton>
    </div>
  </div>
</template>

<style scoped></style>
