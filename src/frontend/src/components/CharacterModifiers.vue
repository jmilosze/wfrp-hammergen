<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useModal } from "../composables/modal.ts";
import ModalWindow from "./ModalWindow.vue";
const modal = useModal();
</script>

<template>
  <div>
    <div class="flex items-center">
      <div class="mb-1 mr-2">Character modifiers</div>
      <ActionButton size="sm" @click="modal.showModal('modifiersHelpModal')">What are modifiers?</ActionButton>
    </div>

    <ModalWindow id="modifiersHelpModal">
      <template #header> Character modifiers </template>
      <template #buttons>
        <ActionButton variant="normal" @click="modal.hideModal()">Close</ActionButton>
      </template>
      <div>
        Talent modifiers are automatically added to character sheet in both edit and view modes. For example, if you add
        a talent that modifies the Size, it will automatically affect the number of Wounds. Sum of all Attribute
        modifiers is displayed in "other" row in character sheet.
      </div>
      <div>
        All characters have default size Average, by using size modifier you can change is to Small (-1), Large (+1)
        etc.
      </div>
    </ModalWindow>
  </div>
</template>

<style scoped></style>
