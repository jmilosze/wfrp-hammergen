<script setup lang="ts">
import SectionButton from "./SectionButton.vue";
import { Icon } from "@iconify/vue";
import ModalWindow from "./ModalWindow.vue";

// Asks to confirm deleting name; Delete emits deleteConfirmed and closes.
defineProps<{
  name: string;
}>();

const open = defineModel<boolean>("open", { required: true });

const emit = defineEmits<{
  (e: "deleteConfirmed"): void;
}>();

function deleteElement() {
  emit("deleteConfirmed");
  open.value = false;
}
</script>

<template>
  <ModalWindow v-model:open="open" size="xs">
    <template #header>Delete {{ name }}?</template>
    <div class="flex items-start gap-3">
      <Icon icon="lucide:triangle-alert" class="size-6 shrink-0 text-error" />
      <p>
        <span class="font-semibold">{{ name }}</span> and all its data will be deleted. This can't be undone.
      </p>
    </div>
    <template #buttons>
      <div class="flex justify-end gap-2">
        <SectionButton icon="lucide:x" variant="neutral" @click="open = false">Cancel</SectionButton>
        <SectionButton icon="lucide:trash-2" variant="danger" @click="deleteElement()">Delete</SectionButton>
      </div>
    </template>
  </ModalWindow>
</template>
