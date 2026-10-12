<script setup lang="ts">
import { Icon } from "@iconify/vue";

// A checkbox drawn like an editable sheet cell: faint yellow inside, dark when ticked, white when disabled. Attributes
// and listeners (checked, disabled, @change, @click, …) go to the checkbox itself.
defineOptions({ inheritAttrs: false });
</script>

<template>
  <span class="relative inline-flex shrink-0">
    <input
      v-bind="$attrs"
      type="checkbox"
      class="peer appearance-none size-5 rounded-sm border border-neutral-500 bg-primary-50 cursor-pointer checked:bg-neutral-600 checked:border-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 outline-neutral-700 disabled:cursor-default disabled:bg-white disabled:border-neutral-300 disabled:checked:bg-neutral-300"
    />
    <Icon
      icon="lucide:check"
      class="pointer-events-none absolute inset-0 m-auto size-4 text-white hidden peer-checked:block"
    />
  </span>
</template>

<style scoped></style>
