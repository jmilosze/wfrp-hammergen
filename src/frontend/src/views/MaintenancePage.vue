<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useIntervalFn } from "@vueuse/core";
import AppButton from "@/components/ui/AppButton.vue";
import { checkMaintenance, useMaintenance } from "@/composables/maintenance.ts";
import { anonRequest } from "@/services/auth.ts";

const STATUS_POLL_MS = 15000;

const { maintenance } = useMaintenance();

function reload() {
  window.location.reload();
}

// Reload when maintenance ends, so the tab picks up the frontend that was deployed meanwhile.
useIntervalFn(async () => {
  try {
    await checkMaintenance(anonRequest);
  } catch {
    // the server can be unreachable while it restarts; keep waiting
    return;
  }
  if (!maintenance.value) {
    reload();
  }
}, STATUS_POLL_MS);
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
