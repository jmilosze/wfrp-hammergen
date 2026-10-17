<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import AppButton from "@/components/ui/AppButton.vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";

// The ways to start a new character, as a slim strip above the character sheet: Generate opens a popup with the
// generator (its fields and explanation come from the editor), Guided is not there yet, and filling in the sheet needs
// nothing. After generating, the strip shows what was generated, with Generate again (same options) and a way back to
// the options. The strip can be dismissed.
const props = defineProps<{ generateDisabled?: boolean; generationSummary: string }>();

const emit = defineEmits<{
  (e: "generate"): void;
}>();

const modalOpen = ref(false);
const dismissed = ref(false);
// What was last generated; empty before the first generation. Options changed later in the popup don't change it.
const generatedSummary = ref("");

function onGenerate() {
  emit("generate");
  modalOpen.value = false;
  generatedSummary.value = props.generationSummary;
}
</script>

<template>
  <div
    v-if="!dismissed"
    class="relative flex flex-wrap items-center gap-3 my-4 pl-3 pr-11 py-2 bg-parchment-light border border-dashed border-brand-rule rounded-lg print:hidden"
  >
    <Icon icon="lucide:sparkles" class="size-5 text-brand" />
    <template v-if="generatedSummary">
      <div class="flex-1 min-w-48">
        <div class="font-semibold">Character generated</div>
        <div class="text-sm text-neutral-700">{{ generatedSummary }}</div>
      </div>
      <!-- The buttons stay together, wrapping as one group. -->
      <div class="flex flex-wrap gap-2">
        <AppButton icon="lucide:dices" :disabled="generateDisabled" @click="onGenerate"> Generate again </AppButton>
        <AppButton icon="lucide:sliders-horizontal" variant="neutral" @click="modalOpen = true">
          Change options…
        </AppButton>
      </div>
    </template>
    <template v-else>
      <div class="flex-1 min-w-48">
        <div class="font-semibold">Quick start</div>
        <!-- Left out on small screens, where the strip should stay short. -->
        <div class="hidden @md:block text-sm text-neutral-700">
          Generate new character randomly or fill in the sheet below yourself.
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <AppButton icon="lucide:dices" @click="modalOpen = true">Generate…</AppButton>
        <AppButton icon="lucide:route" variant="neutral" disabled title="Guided creation isn't available yet">
          Guided (soon)
        </AppButton>
      </div>
    </template>
    <!-- Always in the top right corner, however the rest wraps. -->
    <button
      type="button"
      class="absolute top-1.5 right-1.5 text-neutral-500 transition-colors duration-100 hover:bg-parchment hover:text-neutral-900 rounded p-1"
      aria-label="Dismiss"
      @click="dismissed = true"
    >
      <Icon icon="lucide:x" class="size-5" />
    </button>
  </div>
  <ModalWindow v-model:open="modalOpen" size="md">
    <template #header>Generate character</template>
    <div class="@container flex flex-col gap-3">
      <p>Roll a complete character of level 1 to 4. Generating replaces everything on the sheet.</p>
      <slot name="fields" />
      <details class="text-sm">
        <summary class="cursor-pointer font-semibold">How it works</summary>
        <slot name="hint" />
      </details>
    </div>
    <template #buttons>
      <div class="flex justify-end">
        <AppButton icon="lucide:dices" variant="light" :disabled="generateDisabled" @click="onGenerate">
          Generate
        </AppButton>
      </div>
    </template>
  </ModalWindow>
</template>
