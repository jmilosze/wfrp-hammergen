<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    type: "text" | "password";
    title: string;
    isValid: boolean;
    invalidMsg: string;
    modelValue: string;
  }>(),
  {
    type: "text",
    title: "",
    isValid: true,
    invalidMsg: "",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div class="w-full">
    <p>{{ title }}</p>
    <input
      :type="type"
      class="border-2 border-neutral-200 rounded w-full h-10 px-2 mt-1 focus:border-neutral-700 transition-colors duration-200"
      v-model="value"
    />
    <p class="text-sm text-red-600" :class="[isValid ? 'hidden' : '']">{{ invalidMsg }}</p>
  </div>
</template>
