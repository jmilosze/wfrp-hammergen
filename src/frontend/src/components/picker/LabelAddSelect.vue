<script setup lang="ts" generic="T">
// A dropdown styled as an "Add" button: picking an option emits it and the dropdown goes back to "+ Add". Disabled when
// there is nothing left to add.
const props = defineProps<{ options: { text: string; value: T }[]; ariaLabel: string }>();

const emit = defineEmits<{
  (e: "add", value: T): void;
}>();

// Options are told apart by index, so values of any type work.
function onChange(event: Event) {
  if (!(event.target instanceof HTMLSelectElement)) {
    return;
  }
  const option = props.options[Number(event.target.value)];
  event.target.value = "";
  emit("add", option.value);
}
</script>

<template>
  <select
    value=""
    :aria-label="ariaLabel"
    :disabled="options.length === 0"
    class="w-22 rounded border px-2 py-1 font-sans text-sm font-medium bg-white border-neutral-400 text-neutral-800 hover:bg-neutral-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    @change="onChange"
  >
    <option value="" disabled hidden>+ Add</option>
    <option v-for="(option, i) in options" :key="option.text" :value="i">{{ option.text }}</option>
  </select>
</template>
