<script setup lang="ts">
import { useModal } from "../composables/modal.ts";

defineProps<{
  id: string;
}>();

const modal = useModal();
</script>

<template>
  <Teleport v-if="id === modal.modalId.value" to="#modal">
    <div class="bg-white rounded-lg shadow p-3 m-3">
      <slot></slot>
    </div>
  </Teleport>
</template>

<style scoped></style>
