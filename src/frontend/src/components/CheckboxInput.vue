<script setup lang="ts">
const checked = defineModel<boolean>({ required: true });

defineProps<{
  title: string;
  disabled?: boolean;
}>();
</script>

<template>
  <label class="flex items-center gap-2 w-fit">
    <input v-model="checked" type="checkbox" class="w-5 h-5 accent-neutral-600 shrink-0" :disabled="disabled" />
    {{ title }}
  </label>
</template>

<style scoped></style>
