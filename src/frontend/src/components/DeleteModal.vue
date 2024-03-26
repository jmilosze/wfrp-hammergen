<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import ModalWindow from "./ModalWindow.vue";
import { useModal } from "../composables/modal.ts";
import { watch } from "vue";

const props = defineProps<{
  elementToDelete: { id: string; name: string };
}>();

const emit = defineEmits<{
  (e: "deleteConfirmed"): void;
}>();

const modal = useModal();
function deleteElement() {
  emit("deleteConfirmed");
  modal.hideModal();
}

watch(
  () => props.elementToDelete,
  (newValue) => {
    if (newValue.id !== "") {
      modal.showModal("deleteModal");
    }
  },
  { deep: true },
);
</script>

<template>
  <ModalWindow id="deleteModal">
    <template #header> Delete Prayer </template>
    <template #buttons>
      <ActionButton variant="red" @click="deleteElement()">Delete</ActionButton>
      <ActionButton variant="normal" class="ml-3" @click="modal.hideModal()">Cancel</ActionButton>
    </template>
    <div>
      Are you sure you want to delete <span class="font-semibold">{{ elementToDelete.name }}?</span>
    </div>
  </ModalWindow>
</template>

<style scoped></style>
