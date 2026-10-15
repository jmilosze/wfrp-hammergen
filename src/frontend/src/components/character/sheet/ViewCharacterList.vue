<script setup lang="ts">
import type { RouteName } from "@/router.ts";
import TextLink from "@/components/ui/TextLink.vue";

// A compact read-only list of names for the character view (e.g. talents or mutations), in as many columns as fit.
// An entry taken more than once shows the count, e.g. "Sturdy x2".
defineProps<{ items: { id: string; name: string; rank?: number }[]; routeName: RouteName }>();
</script>

<template>
  <div class="@container">
    <ul class="columns-1 @md:columns-2 @2xl:columns-3 @5xl:columns-4 gap-6 px-2 py-2">
      <li v-for="(item, i) in items" :key="i" class="py-0.5 break-inside-avoid">
        <TextLink :routeName="routeName" :params="{ id: item.id }">{{ item.name }}</TextLink>
        <template v-if="item.rank && item.rank > 1"> x{{ item.rank }}</template>
      </li>
    </ul>
  </div>
</template>
