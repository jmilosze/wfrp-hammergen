<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useAuth } from "../composables/auth.ts";
import LinkButton from "./LinkButton.vue";

defineProps<{
  canEdit: boolean;
  id: string;
  routeName: string;
}>();

const emit = defineEmits<{
  (e: "copy", id: string): void;
  (e: "delete", id: string): void;
}>();

const auth = useAuth();
</script>

<template>
  <div class="flex gap-2 my-1">
    <LinkButton size="sm" :routeName="routeName" :params="{ id: id }">{{ canEdit ? "View/Edit" : "View" }}</LinkButton>
    <ActionButton v-if="auth.loggedIn.value" size="sm" variant="amber" @click="emit('copy', id)">Copy</ActionButton>
    <ActionButton v-if="canEdit" size="sm" variant="red" @click="emit('delete', id)">Delete</ActionButton>
  </div>
</template>

<style scoped></style>
