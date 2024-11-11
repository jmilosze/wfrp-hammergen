<script setup lang="ts">
defineProps<{
  viewNames: { value: string; text: string }[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();
</script>

<template>
  <div class="max-w-2xl mx-auto mb-4">
    <div class="flex justify-center gap-4" role="group">
      <button
        v-for="view in viewNames"
        :key="view.value"
        class="text-xl font-medium"
        :class="[modelValue === view.value ? 'text-black underline' : 'hover:underline text-red-700']"
        @click="emit('update:modelValue', view.value)"
      >
        {{ view.text }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
