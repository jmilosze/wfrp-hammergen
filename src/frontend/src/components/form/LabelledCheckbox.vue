<script setup lang="ts">
import FormCheckbox from "./FormCheckbox.vue";

const checked = defineModel<boolean>({ required: true });

function onChange(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    checked.value = event.target.checked;
  }
}

defineProps<{
  title: string;
  disabled?: boolean;
}>();
</script>

<template>
  <label class="flex items-center gap-2 w-fit">
    <FormCheckbox :checked="checked" :disabled="disabled" @change="onChange" />
    {{ title }}
  </label>
</template>

<style scoped></style>
