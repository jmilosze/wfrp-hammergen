<script setup lang="ts">
const attributeNames = ["WS", "BS", "S", "T", "I", "Ag", "Dex", "Int", "WP", "Fel"];
</script>

<template>
  <div class="@container">
    <div class="grid grid-cols-2 @2xl:grid-cols-5 @5xl:grid-cols-10 gap-2">
      <div
        v-for="attr in attributeNames"
        :key="attr"
        class="bg-neutral-50 rounded-xl border border-neutral-300 overflow-hidden flex flex-col min-w-fit"
      >
        <div class="px-2 py-2 border-b border-neutral-300 font-bold text-left text-sm">
          {{ attr }}
        </div>
        <div class="p-2 bg-white flex-1 border-b border-neutral-300">
          <slot :name="attr" />
        </div>
        <div class="bg-neutral-50 h-5" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
