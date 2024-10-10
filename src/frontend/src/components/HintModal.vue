<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";

const props = defineProps<{
  buttonText: string;
  modalHeader?: string;
  modalId?: string;
}>();

const modal = useModal();

const modalId = props.modalId ? props.modalId : "hintModal";
</script>

<template>
  <ActionButton class="btn btn-sm" @click="modal.showModal(modalId)">
    {{ buttonText }}
  </ActionButton>

  <ModalWindow :id="modalId">
    <template v-if="modalHeader" #header> {{ modalHeader }} </template>
    <template #buttons>
      <ActionButton class="btn" @click="modal.hideModal()">Close</ActionButton>
    </template>
    <div>
      <slot />
    </div>
  </ModalWindow>
</template>

<style scoped></style>
