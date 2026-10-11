<script setup lang="ts">
import { Icon } from "@iconify/vue";

type Variant = "primary" | "neutral" | "danger" | "ghost";

// iconOnlyWhenNarrow: inside a narrow @container, show only the icon; the label stays for screen readers.
withDefaults(defineProps<{ icon: string; variant?: Variant; iconOnlyWhenNarrow?: boolean }>(), { variant: "primary" });

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-primary-200 border-primary-400 text-neutral-900 hover:bg-primary-300",
  neutral: "bg-white border-neutral-400 text-neutral-800 hover:bg-neutral-200",
  danger: "bg-white border-danger-400 text-danger-700 hover:bg-danger-50",
  ghost: "bg-transparent border-transparent text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900",
};
</script>

<template>
  <button
    type="button"
    :class="VARIANT_CLASS[variant]"
    class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm font-medium whitespace-nowrap select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Icon :icon="icon" :class="iconOnlyWhenNarrow ? 'size-6 @lg:size-4' : 'size-4'" />
    <span :class="{ 'sr-only @lg:not-sr-only': iconOnlyWhenNarrow }"><slot /></span>
  </button>
</template>

<style scoped></style>
