<script setup lang="ts">
import { Icon } from "@iconify/vue";
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";

const props = defineProps<{
  // Without a text, the modal opens from a question mark icon.
  buttonText?: string;
  modalHeader?: string;
  modalId?: string;
}>();

const modal = useModal();

const modalId = props.modalId ? props.modalId : "hintModal";
</script>

<template>
  <ActionButton v-if="buttonText" class="btn btn-secondary btn-sm" @click="modal.showModal(modalId)">
    {{ buttonText }}
  </ActionButton>
  <button
    v-else
    type="button"
    :aria-label="modalHeader ? `Help: ${modalHeader}` : 'Help'"
    class="text-neutral-500 bg-neutral-200 hover:text-neutral-950 hover:bg-neutral-400 rounded-full cursor-pointer"
    @click="modal.showModal(modalId)"
  >
    <Icon icon="lucide:circle-help" class="size-6" />
  </button>

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
