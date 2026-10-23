<script setup lang="ts">
// One dated entry on the Updates timeline. The date sits left of the line on wider screens and above the card on
// narrow ones. An optional title heads the card.
defineProps<{ date: string; title?: string }>();
</script>

<template>
  <div class="grid grid-cols-[1rem_minmax(0,1fr)] md:grid-cols-[6.5rem_1rem_minmax(0,1fr)] gap-x-3">
    <div class="hidden md:block pt-3 text-right text-sm font-semibold text-neutral-600 whitespace-nowrap">
      {{ date }}
    </div>
    <div class="relative flex justify-center">
      <div class="absolute inset-y-0 w-0.5 bg-neutral-300" />
      <div class="relative mt-4 size-3 rounded-full bg-brand ring-4 ring-white" />
    </div>
    <div class="pb-5">
      <div class="md:hidden pt-3 pb-1 text-sm font-semibold text-neutral-600">{{ date }}</div>
      <div class="rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-3 space-y-2">
        <h3 v-if="title" class="text-lg font-semibold text-neutral-900">{{ title }}</h3>
        <slot />
      </div>
    </div>
  </div>
</template>
