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
    <LinkButton routeName="viewCharacter" :params="{ id: id }" class="btn btn-sm">View</LinkButton>
    <LinkButton v-if="canEdit" routeName="character" :params="{ id: id }" class="btn btn-sm">Edit</LinkButton>
    <ActionButton v-if="auth.loggedIn.value" class="btn btn-secondary btn-sm" @click="emit('copy', id)">
      Copy
    </ActionButton>
    <ActionButton v-if="canEdit" class="mx-1 btn btn-danger btn-sm" @click="emit('delete', id)">Delete</ActionButton>
  </div>
</template>

<style scoped></style>
