<script setup lang="ts">
import ActionButton from "./ActionButton.vue";
import router from "../router.ts";
import { Edition } from "../services/wh/common.ts";
import EditionSwitch from "./EditionSwitch.vue";

defineProps<{
  hasVariant: boolean;
  canEdit: boolean;
  propertyName: string;
}>();

const edition = defineModel<Edition>({ required: true });

const emit = defineEmits<{
  (e: "add"): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-2 my-2">
    <EditionSwitch v-model="edition" longNames />
    <div v-if="!hasVariant" class="flex flex-col items-center gap-2">
      <p class="my-4">This {{ propertyName.toLowerCase() }} has no {{ edition }} version.</p>
      <!-- Back works like the one next to Save; the page's leave guard warns about unsaved changes. -->
      <div class="flex gap-2">
        <ActionButton v-if="canEdit" class="btn" @click="emit('add')">Add {{ edition }} version</ActionButton>
        <ActionButton class="btn" @click="router.go(-1)">Back</ActionButton>
      </div>
    </div>
  </div>
</template>
