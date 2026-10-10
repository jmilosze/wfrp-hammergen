<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
const props = defineProps<{
  alertType?: "green" | "red" | "amber" | "blue";
  centered?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const blockClass = ref(["p-2", "rounded", "border", "flex", "justify-between", "gap-2"]);
const btnClass = ref(["p-2", "hover:text-neutral-900", "rounded", "h-fit"]);

if (props.alertType === "red") {
  blockClass.value.push(...["bg-danger-200", "text-danger-800", "border-danger-500"]);
  btnClass.value.push(...["text-danger-800", "hover:bg-danger-300"]);
} else if (props.alertType === "amber") {
  blockClass.value.push(...["bg-primary-300", "text-primary-900", "border-primary-800"]);
  btnClass.value.push(...["text-primary-800", "hover:bg-primary-400"]);
} else if (props.alertType === "blue") {
  blockClass.value.push(...["bg-info-100", "text-info-900", "border-info-800"]);
  btnClass.value.push(...["text-info-800", "hover:bg-info-400"]);
} else {
  blockClass.value.push(...["bg-success-200", "text-success-800", "border-success-500"]);
  btnClass.value.push(...["text-success-800", "hover:bg-success-300"]);
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
