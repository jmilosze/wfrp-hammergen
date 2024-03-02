<script setup lang="ts">
import ActionButton from "../ActionButton.vue";
import { useAuth } from "../../composables/auth.ts";

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
  <div class="flex">
    <ActionButton size="sm" class="mx-1" @click="emit('edit', id)">{{ canEdit ? "View/Edit" : "View" }}</ActionButton>
    <ActionButton v-if="auth.loggedIn" size="sm" variant="amber" class="mx-1" @click="emit('copy', id)"
      >Copy</ActionButton
    >
    <ActionButton v-if="canEdit" size="sm" variant="red" class="mx-1" @click="emit('delete', id)">Delete</ActionButton>
  </div>
</template>

<style scoped></style>
