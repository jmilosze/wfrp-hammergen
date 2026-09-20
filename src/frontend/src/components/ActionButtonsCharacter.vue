<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import LinkButton from "./LinkButton.vue";
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
    <LinkButton routeName="viewCharacter" :params="{ id: id }" class="btn btn-sm">
      View
    </LinkButton>
    <ActionButton
      v-if="auth.loggedIn.value"
      class="btn btn-secondary btn-sm"
      title="Copy"
      aria-label="Copy"
      @click="emit('copy', id)"
    >
      <span class="flex items-center gap-1.5">
        <Icon icon="lucide:copy" class="size-4" />
        <span>Copy</span>
      </span>
    </ActionButton>
  </div>
</template>

<style scoped></style>
