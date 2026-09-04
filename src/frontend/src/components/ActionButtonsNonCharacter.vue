<script setup lang="ts">
import { computed } from "vue";
import ActionButton from "./ActionButton.vue";
import { useAuth } from "../composables/auth.ts";
import LinkButton from "./LinkButton.vue";

const props = defineProps<{
  id: string;
  routeName: string;
  ownerId?: string;
}>();

const emit = defineEmits<{
  (e: "copy", id: string): void;
  (e: "delete", id: string): void;
}>();

const auth = useAuth();
const canEdit = computed(() => auth.canEdit(props.ownerId));
</script>

<template>
  <div class="flex gap-2 my-1">
    <LinkButton :routeName="routeName" :params="{ id: id }" class="btn btn-sm">
      {{ canEdit ? "View/Edit" : "View" }}
    </LinkButton>
    <ActionButton v-if="auth.loggedIn.value" class="btn btn-secondary btn-sm" @click="emit('copy', id)">
      Copy
    </ActionButton>
    <ActionButton v-if="canEdit" class="btn btn-danger btn-sm" @click="emit('delete', id)">Delete</ActionButton>
  </div>
</template>

<style scoped></style>
