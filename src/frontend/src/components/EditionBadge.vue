<script setup lang="ts">
import { Edition, printEditionName } from "../services/wh/core/edition.ts";

// large: for a page header rather than inline next to an item name.
defineProps<{ edition: Edition; large?: boolean }>();
</script>

<template>
  <span
    :title="printEditionName(edition)"
    :class="large ? 'px-2 py-0.5 text-sm' : 'px-1.5 text-xs'"
    class="inline-block whitespace-nowrap rounded border bg-primary-200 border-primary-400 font-semibold text-neutral-900 align-middle select-none"
  >
    {{ edition }}
  </span>
</template>

<style scoped></style>
