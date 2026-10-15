<script setup lang="ts">
import IconButton from "@/components/ui/IconButton.vue";
import { useAuth } from "@/composables/auth.ts";

// A character list row's View (the character sheet) and, for logged in users, Copy.
defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  (e: "copy"): void;
}>();

const auth = useAuth();
</script>

<template>
  <div class="flex gap-2 my-1 shrink-0">
    <IconButton
      :to="{ name: 'viewCharacter', params: { id } }"
      icon="lucide:eye"
      label="View"
      variant="light"
      size="sm"
    />
    <IconButton
      v-if="auth.loggedIn.value"
      icon="lucide:copy"
      label="Copy"
      variant="light"
      size="sm"
      @click="emit('copy')"
    />
  </div>
</template>
