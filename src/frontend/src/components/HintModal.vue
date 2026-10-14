<script setup lang="ts">
import SectionButton from "./SectionButton.vue";
import { Icon } from "@iconify/vue";
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
  <SectionButton v-if="buttonText" icon="lucide:circle-help" variant="neutral" @click="modal.showModal(modalId)">
    {{ buttonText }}
  </SectionButton>
  <button
    v-else
    type="button"
    :aria-label="modalHeader ? `Help: ${modalHeader}` : 'Help'"
    class="text-neutral-900 bg-primary-200 hover:bg-primary-300 rounded-full cursor-pointer"
    @click="modal.showModal(modalId)"
  >
    <Icon icon="lucide:circle-help" class="size-6" />
  </button>

  <ModalWindow :id="modalId">
    <template v-if="modalHeader" #header> {{ modalHeader }} </template>
    <template #buttons>
      <div class="flex justify-end">
        <SectionButton icon="lucide:x" variant="neutral" @click="modal.hideModal()">Close</SectionButton>
      </div>
    </template>
    <div>
      <slot />
    </div>
  </ModalWindow>
</template>

<style scoped></style>
