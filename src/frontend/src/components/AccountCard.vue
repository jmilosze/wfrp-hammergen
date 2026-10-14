<script setup lang="ts">
import { Icon } from "@iconify/vue";

// A card of the account pages (log in, register, manage account…), in the style of the front page's feature boxes:
// an icon, a heading, an optional description, the form, and an optional footer (e.g. links) under a divider.
// danger: a red accent, for deleting the account.
defineProps<{ title: string; icon: string; danger?: boolean; headingLevel?: 1 | 2 }>();
</script>

<template>
  <section
    class="flex flex-col p-4 sm:p-6 rounded-lg border bg-neutral-50"
    :class="danger ? 'border-danger-300' : 'border-neutral-200'"
  >
    <Icon :icon="icon" class="size-9" :class="danger ? 'text-danger-600' : 'text-primary-600'" />
    <component :is="headingLevel === 1 ? 'h1' : 'h2'" class="mt-3 font-semibold text-2xl">{{ title }}</component>
    <div v-if="$slots.description" class="mt-2 text-neutral-700">
      <slot name="description" />
    </div>
    <div class="flex flex-col gap-3 mt-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="flex flex-col gap-2 mt-5 pt-4 border-t border-neutral-200">
      <slot name="footer" />
    </div>
  </section>
</template>

<style scoped></style>
