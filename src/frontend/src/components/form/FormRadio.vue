<script setup lang="ts">
import type { InputHTMLAttributes } from "vue";

// A radio button drawn like FormCheckbox: faint yellow inside, a dark dot when selected, greyed out when disabled.
// Attributes and listeners (name, checked, disabled, @change, …) go to the radio button itself.
defineOptions({ inheritAttrs: false });

// The input's attributes and listeners are declared for type checking only.
defineProps</* @vue-ignore */ InputHTMLAttributes>();
</script>

<template>
  <input
    v-bind="$attrs"
    type="radio"
    class="appearance-none shrink-0 size-5 rounded-full border border-neutral-500 bg-editable cursor-pointer checked:bg-neutral-600 checked:border-neutral-600 checked:shadow-[inset_0_0_0_3px_var(--color-editable)] focus-visible:outline-2 focus-visible:outline-offset-2 outline-neutral-700 disabled:cursor-default disabled:bg-neutral-200 disabled:border-neutral-300 disabled:checked:bg-neutral-400 disabled:checked:border-neutral-400 disabled:checked:shadow-[inset_0_0_0_3px_var(--color-neutral-200)]"
  />
</template>
