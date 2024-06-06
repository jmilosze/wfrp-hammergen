<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useAuth } from "../composables/auth.ts";
import LinkButton from "./LinkButton.vue";

defineProps<{
  canEdit: boolean;
  id: string;
}>();

const emit = defineEmits<{
  (e: "copy", id: string): void;
  (e: "delete", id: string): void;
}>();

const auth = useAuth();
</script>

<template>
  <div class="flex gap-2 my-1">
    <LinkButton size="sm" routeName="viewCharacter" :params="{ id: id }">View</LinkButton>
    <LinkButton v-if="canEdit" size="sm" routeName="character" :params="{ id: id }">Edit</LinkButton>
    <ActionButton v-if="auth.loggedIn.value" size="sm" variant="amber" @click="emit('copy', id)">Copy</ActionButton>
    <ActionButton v-if="canEdit" size="sm" variant="red" class="mx-1" @click="emit('delete', id)">Delete</ActionButton>
  </div>
</template>

<style scoped></style>
