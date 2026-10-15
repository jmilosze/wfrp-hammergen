<script setup lang="ts">
import { Icon } from "@iconify/vue";

// The close button keeps its own look (not an IconButton): its colours follow the alert's.
defineProps<{
  alertType?: "green" | "red";
  centered?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div :class="{ 'flex justify-center': centered }">
    <div
      class="p-2 rounded border flex justify-between gap-2"
      :class="
        alertType === 'red'
          ? 'bg-alert-error-bg text-alert-error-text border-alert-error-border'
          : 'bg-alert-success-bg text-alert-success-text border-alert-success-border'
      "
    >
      <div class="my-1 pt-1">
        <slot />
      </div>
      <button
        type="button"
        aria-label="Close"
        class="p-2 hover:text-neutral-900 rounded h-fit cursor-pointer"
        :class="
          alertType === 'red'
            ? 'text-alert-error-text hover:bg-alert-error-hover'
            : 'text-alert-success-text hover:bg-alert-success-hover'
        "
        @click="emit('close')"
      >
        <Icon icon="lucide:x" class="size-6" />
      </button>
    </div>
  </div>
</template>
