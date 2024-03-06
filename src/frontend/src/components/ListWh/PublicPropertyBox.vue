<script setup lang="ts">
import { defineModel } from "vue";
import ActionButton from "../ActionButton.vue";
import ModalWindow from "../ModalWindow.vue";
import { useModal } from "../../composables/modal.ts";
import TextLink from "../TextLink.vue";

const model = defineModel<boolean>();

defineProps<{
  propertyName: string;
  disabled?: boolean;
}>();

const modal = useModal();
</script>

<template>
  <div>
    <div class="flex items-center">
      <div class="mb-1 mr-2">Public {{ propertyName }}?</div>
      <ActionButton size="sm" @click="modal.showModal('publicHelpModal')">What does it mean?</ActionButton>
    </div>
    <div class="flex items-center">
      <input
        v-model="model"
        type="checkbox"
        :disabled="disabled ? disabled : false"
        class="w-5 h-5 accent-neutral-600"
      />
      <div class="ml-2">Public</div>
    </div>
  </div>

  <ModalWindow id="publicHelpModal">
    <template #header> Public property </template>
    <template #buttons>
      <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
    </template>
    <div class="max-w-2xl">
      When an element (character, skill, item, etc.) is marked as Public anyone you give your username to, can see that
      element in read-only mode. Element sharing is explained in the
      <TextLink routeName="linkedusers">Linked Users</TextLink>
      section.
    </div>
  </ModalWindow>
</template>

<style scoped></style>
