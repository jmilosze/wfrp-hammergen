<script setup lang="ts">
import SectionButton from "./SectionButton.vue";
import { Icon } from "@iconify/vue";
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
  <ModalWindow id="deleteModal" size="xs">
    <template #header>Delete {{ elementToDelete.name }}?</template>
    <div class="flex items-start gap-3">
      <Icon icon="lucide:triangle-alert" class="size-6 shrink-0 text-error" />
      <p>
        <span class="font-semibold">{{ elementToDelete.name }}</span> and all its data will be deleted. This can't be
        undone.
      </p>
    </div>
    <template #buttons>
      <div class="flex justify-end gap-2">
        <SectionButton icon="lucide:x" variant="neutral" @click="modal.hideModal()">Cancel</SectionButton>
        <SectionButton icon="lucide:trash-2" variant="danger" @click="deleteElement()">Delete</SectionButton>
      </div>
    </template>
  </ModalWindow>
</template>

<style scoped></style>
