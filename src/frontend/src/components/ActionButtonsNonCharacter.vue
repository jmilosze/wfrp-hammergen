<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import { useAuth } from "../composables/auth.ts";
import { Icon } from "@iconify/vue";

defineProps<{
  id: string;
}>();

const emit = defineEmits<{
  (e: "copy", id: string): void;
}>();

const auth = useAuth();
</script>

<template>
  <div class="flex gap-2 my-1 shrink-0">
    <!-- An icon-only button; its name comes from the label and tooltip. -->
    <ActionButton
      v-if="auth.loggedIn.value"
      class="rounded border border-neutral-400 bg-white p-1.5 text-neutral-800 hover:bg-neutral-200 cursor-pointer"
      title="Copy"
      aria-label="Copy"
      @click="emit('copy', id)"
    >
      <Icon icon="lucide:copy" class="size-4" />
    </ActionButton>
  </div>
</template>

<style scoped></style>
