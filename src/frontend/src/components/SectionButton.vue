<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  BUTTON_BASE_CLASS,
  BUTTON_ICON_SIZE_CLASS,
  BUTTON_SIZE_CLASS,
  BUTTON_VARIANT_CLASS,
  ButtonSize,
  ButtonVariant,
} from "./buttonStyle.ts";

// The app's button: bordered, with an icon (see buttonStyle.ts).
// iconOnlyWhenNarrow: inside a narrow @container, show only the icon; the label stays for screen readers.
// busy: the icon becomes a spinner and the button is disabled, e.g. while saving.
withDefaults(
  defineProps<{
    icon: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    iconOnlyWhenNarrow?: boolean;
    busy?: boolean;
  }>(),
  { variant: "neutral", size: "md" },
);
</script>

<template>
  <button
    type="button"
    :class="[BUTTON_BASE_CLASS, BUTTON_SIZE_CLASS[size], BUTTON_VARIANT_CLASS[variant]]"
    class="disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="busy || undefined"
    :aria-busy="busy || undefined"
  >
    <Icon
      :icon="busy ? 'lucide:loader-circle' : icon"
      :class="[iconOnlyWhenNarrow ? 'size-6 @lg:size-4' : BUTTON_ICON_SIZE_CLASS[size], { 'animate-spin': busy }]"
    />
    <span :class="{ 'sr-only @lg:not-sr-only @lg:whitespace-nowrap': iconOnlyWhenNarrow }"><slot /></span>
  </button>
</template>

<style scoped></style>
