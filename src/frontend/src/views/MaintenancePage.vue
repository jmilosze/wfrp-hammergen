<script setup lang="ts">
import { Icon } from "@iconify/vue";

function reload() {
  window.location.reload();
}
</script>

<template>
  <div class="fixed inset-0 z-[100] overflow-auto flex items-center justify-center bg-neutral-100 p-8">
    <div class="max-w-lg w-full text-center">
      <div class="flex items-center justify-center gap-2 text-4xl font-hammergen text-neutral-900 mb-8">
        <Icon icon="game-icons:warhammer" />
        <div>Hammergen</div>
      </div>
      <h1 class="text-2xl mb-4">Maintenance in progress</h1>
      <p class="mb-2">Hammergen is being updated and is temporarily unavailable.</p>
      <p class="mb-8">Your characters and content are safe. Please try again in a few minutes.</p>
      <button class="bg-neutral-700 text-amber-300 hover:bg-neutral-600 rounded px-4 py-2" @click="reload">
        Try again
      </button>
    </div>
  </div>
</template>
