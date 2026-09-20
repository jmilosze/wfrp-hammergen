<script setup lang="ts">
import router from "../router.ts";
import ActionButton from "./ActionButton.vue";
import { onBeforeRouteLeave } from "vue-router";
import { nextTick, ref } from "vue";
import DoubleRadioButton from "./DoubleRadioButton.vue";
import DeleteModal from "./DeleteModal.vue";

const props = defineProps<{
  readOnly: boolean;
  confirmExit: boolean;
  allowAddAnother?: boolean;
  saving: boolean;
  list: string;
  submitForm: () => Promise<boolean>;
  resetForm: () => void;
  deleteItem?: () => Promise<boolean>;
  name?: string;
}>();

const leaveWithoutConfirmation = ref(false);

onBeforeRouteLeave((_, __, next) => {
  if (props.readOnly || !props.confirmExit || leaveWithoutConfirmation.value) {
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
const deleting = ref(false);
const elementToDelete = ref({ id: "", name: "" });

function onDeleteClick() {
  elementToDelete.value = { id: "", name: "" };
  nextTick(() => {
    elementToDelete.value = { id: "delete", name: props.name ?? "" };
  });
}

async function navigateToList() {
  leaveWithoutConfirmation.value = true;
  const previousState = router.options.history.state.back;
  const queryString = typeof previousState === "string" ? previousState.split("?")[1] : "";
  const queryParams = new URLSearchParams(queryString || "");
  const allParams = Object.fromEntries(queryParams.entries());
  await router.push({ name: props.list, query: allParams });
}

async function onSave() {
  if (props.saving || deleting.value) {
    return;
  }
  if (!(await props.submitForm())) {
    return;
  }
  if (addAnother.value) {
    props.resetForm();
  } else {
    await navigateToList();
  }
}

async function onConfirmDelete() {
  if (!props.deleteItem || props.saving || deleting.value) {
    return;
  }
  deleting.value = true;
  const success = await props.deleteItem();
  deleting.value = false;
  elementToDelete.value = { id: "", name: "" };
  if (success) {
    await navigateToList();
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
    <div class="flex flex-wrap items-center gap-8">
      <div class="flex flex-wrap gap-4">
        <ActionButton v-if="!readOnly" :spinner="saving" class="btn" @click="onSave">Save</ActionButton>
        <ActionButton class="btn" @click="router.go(-1)">Back</ActionButton>
      </div>
      <ActionButton
        v-if="!readOnly && deleteItem !== undefined"
        :spinner="deleting"
        class="btn btn-danger"
        @click="onDeleteClick"
      >
        Delete
      </ActionButton>
    </div>

    <DeleteModal
      v-if="!readOnly && deleteItem !== undefined"
      :elementToDelete="elementToDelete"
      @deleteConfirmed="onConfirmDelete"
    />
  </div>
</template>

<style scoped></style>
