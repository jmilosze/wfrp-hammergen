<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import ActionButton from "./ActionButton.vue";
import DeleteModal from "./DeleteModal.vue";
import router from "../router.ts";

const props = withDefaults(
  defineProps<{
    propertyName: string;
    name: string;
    list: string;
    deleteItem: () => Promise<boolean>;
    title?: string;
    disclaimer?: string;
    buttonText?: string;
  }>(),
  {
    title: "",
    disclaimer: "",
    buttonText: "",
  },
);

const deleting = ref(false);
const elementToDelete = ref({ id: "", name: "" });

const titleText = computed(() => (props.title ? props.title : `Delete ${props.propertyName.toLowerCase()}`));
const disclaimerText = computed(() =>
  props.disclaimer
    ? props.disclaimer
    : `The ${props.propertyName.toLowerCase()} and all its data will be deleted. It will be impossible to recover.`,
);
const actionButtonText = computed(() =>
  props.buttonText ? props.buttonText : `Delete ${props.propertyName.toLowerCase()}`,
);

function onDeleteClick() {
  elementToDelete.value = { id: "", name: "" };
  nextTick(() => {
    elementToDelete.value = { id: "delete", name: props.name };
  });
}

async function navigateToList() {
  const previousState = router.options.history.state.back;
  const queryString = typeof previousState === "string" ? previousState.split("?")[1] : "";
  const queryParams = new URLSearchParams(queryString || "");
  const allParams = Object.fromEntries(queryParams.entries());
  await router.push({ name: props.list, query: allParams });
}

async function onConfirmDelete() {
  if (deleting.value) {
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
  <div class="mt-4 p-2 border-4 border-red-600 rounded-lg text-left">
    <div class="text-xl">{{ titleText }}</div>
    <p>{{ disclaimerText }}</p>
    <ActionButton class="mt-3 btn btn-danger" :spinner="deleting" @click="onDeleteClick">
      {{ actionButtonText }}
    </ActionButton>
    <DeleteModal :elementToDelete="elementToDelete" @deleteConfirmed="onConfirmDelete" />
  </div>
</template>

<style scoped></style>
