<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import AppButton from "@/components/ui/AppButton.vue";
import ModalWindow from "@/components/ui/ModalWindow.vue";
import HelpButton from "@/components/ui/HelpButton.vue";

// The ways to start a new character, as a slim strip above the character sheet: Generate opens a popup with the
// generator (its fields and explanation come from the editor), Guided opens guided creation where the editor has it
// (guidedAvailable), and filling in the sheet needs nothing. After generating, the strip shows what was generated, with
// Generate again (same options) and a way back to the options. After guided creation (guidedSummary, set by the editor
// and cleared when it generates), it shows what was created and a way back into it. generateDisabled: what Generate and
// Guided need is not loaded yet. The strip can be dismissed.
const props = defineProps<{
  generateDisabled?: boolean;
  generationSummary: string;
  guidedAvailable?: boolean;
  guidedSummary?: string;
}>();

const emit = defineEmits<{
  (e: "generate"): void;
  (e: "guided"): void;
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
    <template v-if="guidedSummary">
      <div class="flex-1 min-w-48">
        <div class="font-semibold">Character created with guided creation</div>
        <div class="text-sm text-neutral-700">{{ guidedSummary }}</div>
      </div>
      <div class="flex flex-wrap gap-2">
        <AppButton icon="lucide:route" @click="emit('guided')">Back to guided creation</AppButton>
        <AppButton icon="lucide:dices" variant="neutral" @click="modalOpen = true">Generate…</AppButton>
      </div>
    </template>
    <template v-else-if="generatedSummary">
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
          {{
            guidedAvailable
              ? "Generate a character, create one step by step, or fill in the sheet below yourself."
              : "Generate new character randomly or fill in the sheet below yourself."
          }}
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <AppButton icon="lucide:dices" @click="modalOpen = true">Generate…</AppButton>
        <AppButton
          v-if="guidedAvailable"
          icon="lucide:route"
          variant="neutral"
          :disabled="generateDisabled"
          @click="emit('guided')"
        >
          Guided…
        </AppButton>
        <AppButton v-else icon="lucide:route" variant="neutral" disabled title="Guided creation isn't available yet">
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
    <template #header>
      <span class="flex items-center gap-2">
        Generate character
        <HelpButton modalHeader="How generation works">
          <slot name="hint" />
        </HelpButton>
      </span>
    </template>
    <div class="@container flex flex-col gap-3">
      <p>Roll a complete character of level 1 to 4. Generating replaces everything on the sheet.</p>
      <slot name="fields" />
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
