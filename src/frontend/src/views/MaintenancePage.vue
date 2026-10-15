<script setup lang="ts">
import { Icon } from "@iconify/vue";
import AppButton from "@/components/ui/AppButton.vue";

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
      <AppButton icon="lucide:refresh-cw" size="lg" @click="reload">Try again</AppButton>
    </div>
  </div>
</template>
