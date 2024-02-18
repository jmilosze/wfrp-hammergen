<script setup lang="ts">
import { useModal } from "../composables/modal.ts";

defineProps<{
  id: string;
}>();

const modal = useModal();
</script>

<template>
  <Teleport v-if="id === modal.modalId.value" to="#modal">
    <div class="bg-neutral-200">Hello world!</div>
  </Teleport>
</template>

<style scoped></style>
