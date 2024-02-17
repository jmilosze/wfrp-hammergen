<script setup lang="ts">
import { useAuthStore } from "../stores/auth.ts";

defineProps<{
  canEdit: boolean;
  id: string;
}>();

const emit = defineEmits<{
  (e: "edit", id: string): void;
  (e: "copy", id: string): void;
  (e: "delete", id: string): void;
}>();

const authStore = useAuthStore();
</script>

<template>
  <div class="flex">
    <button
      class="mr-2 bg-neutral-600 hover:bg-neutral-800 rounded text-neutral-50 px-2 py-1 active:outline outline-2 outline-neutral-400 select-none text-sm"
      @click="emit('edit', id)"
    >
      {{ canEdit ? "View/Edit" : "View" }}
    </button>

    <button
      v-if="authStore.loggedIn"
      class="mr-2 bg-amber-300 hover:bg-amber-400 rounded text-neutral-600 px-2 py-1 active:outline outline-2 outline-neutral-400 select-none text-sm"
      @click="emit('copy', id)"
    >
      Copy
    </button>

    <button
      v-if="canEdit"
      class="bg-red-600 hover:bg-red-800 rounded text-neutral-50 px-2 py-1 active:outline outline-2 outline-neutral-400 select-none text-sm"
      @click="emit('delete', id)"
    >
      Delete
    </button>
  </div>
</template>

<style scoped></style>
