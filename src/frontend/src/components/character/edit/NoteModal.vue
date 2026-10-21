<script setup lang="ts">
import { ref, watch } from "vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import FormInput from "@/components/form/FormInput.vue";
import AppButton from "@/components/ui/AppButton.vue";

// A small popup to edit the note of one of the character's trappings. It opens with the row's note; Save or Enter emits
// the typed note, trimmed, and closes; Cancel or closing leaves the note as it was. The note is shown under the
// trapping's name in the table.
const props = defineProps<{ name: string; value: string; maxlength: number; hint: string }>();

const open = defineModel<boolean>("open", { required: true });

const emit = defineEmits<{ (e: "save", value: string): void }>();

const draft = ref("");

watch(open, (isOpen) => {
  if (isOpen) {
    draft.value = props.value;
  }
});

function save() {
  emit("save", draft.value.trim());
  open.value = false;
}
</script>

<template>
  <ModalWindow v-model:open="open" size="xs">
    <template #header>Note for {{ name }}</template>
    <form @submit.prevent="save">
      <FormInput v-model="draft" title="Note" :maxlength="maxlength" />
      <p class="mt-1 font-sans text-xs text-neutral-600">{{ hint }}</p>
    </form>
    <template #buttons>
      <div class="flex justify-end gap-2">
        <AppButton icon="lucide:x" variant="neutral" @click="open = false">Cancel</AppButton>
        <AppButton icon="lucide:check" @click="save">Save</AppButton>
      </div>
    </template>
  </ModalWindow>
</template>
