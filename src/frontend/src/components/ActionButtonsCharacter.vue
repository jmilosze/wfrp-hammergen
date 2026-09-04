<script setup lang="ts">
import { computed } from "vue";
import ActionButton from "./ActionButton.vue";
import { useAuth } from "../composables/auth.ts";
import LinkButton from "./LinkButton.vue";

const props = defineProps<{
  id: string;
  ownerId?: string;
  canEdit?: boolean;
}>();

const emit = defineEmits<{
  (e: "copy", id: string): void;
  (e: "delete", id: string): void;
}>();

const auth = useAuth();
const canEdit = computed(() => {
  if (props.canEdit !== undefined) {
    return props.canEdit;
  }
  return auth.canEdit(props.ownerId);
});
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
