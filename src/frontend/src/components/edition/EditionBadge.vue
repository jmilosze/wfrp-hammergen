<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Edition, printEditionName } from "@/services/wh/core/edition.ts";

// large: for a page header rather than inline next to an item name.
// Other attributes (e.g. a title replacing the edition name) go to the badge.
defineProps<{ edition: Edition; large?: boolean } & /* @vue-ignore */ HTMLAttributes>();
</script>

<template>
  <span
    :title="printEditionName(edition)"
    :class="large ? 'px-2 py-0.5 text-sm' : 'px-1.5 text-xs'"
    class="inline-block whitespace-nowrap rounded border bg-parchment border-brand-rule font-semibold text-brand align-middle select-none"
  >
    {{ edition }}
  </span>
</template>
