<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";

const props = defineProps<{
  buttonText: string;
  buttonVariant?: "normal" | "red" | "amber";
  buttonSize?: "md" | "sm";
  modalHeader?: string;
  modalId?: string;
}>();

const modal = useModal();

const modalId = props.modalId ? props.modalId : "hintModal";
</script>

<template>
  <ActionButton :size="buttonSize" :variant="buttonVariant" @click="modal.showModal(modalId)">
    {{
      buttonText
    }}
  </ActionButton>

  <ModalWindow :id="modalId">
    <template v-if="modalHeader" #header> {{ modalHeader }} </template>
    <template #buttons>
      <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
    </template>
    <div>
      <slot />
    </div>
  </ModalWindow>
</template>

<style scoped></style>
