<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  alertType?: "green" | "red" | "amber" | "blue";
  centered?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const blockClass = ref(["p-2", "rounded", "border", "flex", "justify-between", "gap-2"]);
const btnClass = ref(["p-2", "hover:text-gray-900", "rounded", "h-8"]);

if (props.alertType === "red") {
  blockClass.value.push(...["bg-red-200", "text-red-800", "border-red-500"]);
  btnClass.value.push(...["text-red-800", "hover:bg-red-300"]);
} else if (props.alertType === "amber") {
  blockClass.value.push(...["bg-amber-300", "text-amber-900", "border-amber-800"]);
  btnClass.value.push(...["text-amber-800", "hover:bg-amber-400"]);
} else if (props.alertType === "blue") {
  blockClass.value.push(...["bg-blue-100", "text-blue-900", "border-blue-800"]);
  btnClass.value.push(...["text-blue-800", "hover:bg-blue-400"]);
} else {
  blockClass.value.push(...["bg-green-200", "text-green-800", "border-green-500"]);
  btnClass.value.push(...["text-green-800", "hover:bg-green-300"]);
}

const centerClass = ref([] as string[]);
if (props.centered) {
  centerClass.value.push(...["flex", "justify-center"]);
}
</script>

<template>
  <div :class="centerClass">
    <div :class="blockClass">
      <div class="my-1">
        <slot></slot>
      </div>
      <button :class="btnClass" @click="emit('close')">
        <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
