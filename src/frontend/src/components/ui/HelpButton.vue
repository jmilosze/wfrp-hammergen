<script setup lang="ts">
import { ref } from "vue";
import AppButton from "./AppButton.vue";
import { Icon } from "@iconify/vue";
import ModalWindow from "./ModalWindow.vue";

defineProps<{
  // Without a text, the modal opens from a question mark icon.
  buttonText?: string;
  modalHeader?: string;
}>();

const open = ref(false);
</script>

<template>
  <AppButton v-if="buttonText" icon="lucide:circle-help" variant="neutral" @click="open = true">
    {{ buttonText }}
  </AppButton>
  <button
    v-else
    type="button"
    :aria-label="modalHeader ? `Help: ${modalHeader}` : 'Help'"
    class="text-brand bg-parchment transition-colors duration-100 hover:bg-parchment-dark rounded-full cursor-pointer"
    @click="open = true"
  >
    <Icon icon="lucide:circle-help" class="size-6" />
  </button>

  <ModalWindow v-model:open="open">
    <template v-if="modalHeader" #header> {{ modalHeader }} </template>
    <template #buttons>
      <div class="flex justify-end">
        <AppButton icon="lucide:x" variant="neutral" @click="open = false">Close</AppButton>
      </div>
    </template>
    <div>
      <slot />
    </div>
  </ModalWindow>
</template>
