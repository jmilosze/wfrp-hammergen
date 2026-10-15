<script setup lang="ts">
import IconButton from "./IconButton.vue";
import { useAuth } from "../composables/auth.ts";

// A list row's Copy, for logged in users: copies the entry into the user's own content.
const emit = defineEmits<{
  (e: "copy"): void;
}>();

const auth = useAuth();
</script>

<template>
  <IconButton
    v-if="auth.loggedIn.value"
    icon="lucide:copy"
    label="Copy"
    variant="light"
    size="sm"
    @click="emit('copy')"
  />
</template>
