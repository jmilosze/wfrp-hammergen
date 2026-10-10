<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import router from "../router.ts";
import { Edition } from "../services/wh/core/edition.ts";

defineProps<{
  edition: Edition;
  canEdit: boolean;
  propertyName: string;
}>();

const emit = defineEmits<{
  (e: "add"): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-2 my-2">
    <p class="my-4">This {{ propertyName.toLowerCase() }} has no {{ edition }} version.</p>
    <!-- Back works like the one next to Save; the page's leave guard warns about unsaved changes. -->
    <div class="flex gap-2">
      <ActionButton v-if="canEdit" class="btn" @click="emit('add')">Add {{ edition }} version</ActionButton>
      <ActionButton class="btn" @click="router.go(-1)">Back</ActionButton>
    </div>
  </div>
</template>

<style scoped></style>
