<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";

const props = defineProps<{
  buttonText: string;
  // Makes the button as wide as it is high, for a one-character text such as "?".
  square?: boolean;
  modalHeader?: string;
  modalId?: string;
}>();

const modal = useModal();

const modalId = props.modalId ? props.modalId : "hintModal";
</script>

<template>
  <ActionButton class="btn btn-secondary btn-sm" :class="{ 'w-9 px-0': square }" @click="modal.showModal(modalId)">
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
