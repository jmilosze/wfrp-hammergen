<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useAuth } from "../composables/auth.ts";

defineProps<{
  canEdit: boolean;
  id: string;
}>();

const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "copy", id: string): void;
  (e: "delete", id: string): void;
}>();

const auth = useAuth();
</script>

<template>
  <div class="flex gap-2">
    <ActionButton size="sm" @click="emit('edit', id)">{{ canEdit ? "View/Edit" : "View" }}</ActionButton>
    <ActionButton v-if="auth.loggedIn.value" size="sm" variant="amber" @click="emit('copy', id)">Copy</ActionButton>
    <ActionButton v-if="canEdit" size="sm" variant="red" @click="emit('delete', id)">Delete</ActionButton>
  </div>
</template>

<style scoped></style>
