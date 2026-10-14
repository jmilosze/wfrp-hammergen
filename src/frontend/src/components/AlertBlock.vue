<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
const props = defineProps<{
  alertType?: "green" | "red";
  centered?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const blockClass = ref(["p-2", "rounded", "border", "flex", "justify-between", "gap-2"]);
const btnClass = ref(["p-2", "hover:text-neutral-900", "rounded", "h-fit"]);

if (props.alertType === "red") {
  blockClass.value.push(...["bg-alert-error-bg", "text-alert-error-text", "border-alert-error-border"]);
  btnClass.value.push(...["text-alert-error-text", "hover:bg-alert-error-hover"]);
} else {
  blockClass.value.push(...["bg-alert-success-bg", "text-alert-success-text", "border-alert-success-border"]);
  btnClass.value.push(...["text-alert-success-text", "hover:bg-alert-success-hover"]);
}

const centerClass = ref([] as string[]);
if (props.centered) {
  centerClass.value.push(...["flex", "justify-center"]);
}
</script>

<template>
  <div :class="centerClass">
    <div :class="blockClass">
      <div class="my-1 pt-1">
        <slot />
      </div>
      <button :class="btnClass" @click="emit('close')">
        <Icon icon="lucide:x" class="size-6" />
      </button>
    </div>
  </div>
</template>
