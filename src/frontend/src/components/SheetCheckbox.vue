<script setup lang="ts">
import { Icon } from "@iconify/vue";

// A checkbox drawn like an editable sheet cell: faint yellow inside, dark when ticked, greyed out when disabled.
// Attributes and listeners (checked, disabled, @change, @click, …) go to the checkbox itself.
// plain: white inside, for checkboxes that don't edit anything (e.g. list filters).
defineOptions({ inheritAttrs: false });

defineProps<{ plain?: boolean }>();
</script>

<template>
  <span class="relative inline-flex shrink-0">
    <input
      v-bind="$attrs"
      type="checkbox"
      :class="plain ? 'bg-white' : 'bg-primary-50'"
      class="peer appearance-none size-5 rounded-sm border border-neutral-500 cursor-pointer checked:bg-neutral-600 checked:border-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 outline-neutral-700 disabled:cursor-default disabled:bg-neutral-200 disabled:border-neutral-300 disabled:checked:bg-neutral-400 disabled:checked:border-neutral-400"
    />
    <Icon
      icon="lucide:check"
      class="pointer-events-none absolute inset-0 m-auto size-4 text-white hidden peer-checked:block"
    />
  </span>
</template>

<style scoped></style>
