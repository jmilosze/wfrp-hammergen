<script setup lang="ts">
import { useAuthStore } from "../../stores/auth.ts";
import ActionButton from "./ActionButton.vue";

defineProps<{
  canEdit: boolean;
  id: string;
}>();

const emit = defineEmits<{
  (e: "view", id: string): void;
  (e: "edit", id: string): void;
  (e: "copy", id: string): void;
  (e: "delete", id: string): void;
}>();

const authStore = useAuthStore();
</script>

<template>
  <div class="flex">
    <ActionButton @click="emit('view', id)">View</ActionButton>
    <ActionButton v-if="canEdit" @click="emit('edit', id)">Edit</ActionButton>
    <ActionButton v-if="authStore.loggedIn" :variant="'amber'" @click="emit('copy', id)">Copy</ActionButton>
    <ActionButton v-if="canEdit" :variant="'danger'" @click="emit('delete', id)">Delete</ActionButton>
  </div>
</template>

<style scoped></style>
