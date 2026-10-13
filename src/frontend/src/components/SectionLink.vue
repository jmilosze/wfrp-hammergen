<script setup lang="ts">
import { Icon } from "@iconify/vue";

type Variant = "primary" | "neutral";

// A link that looks like a SectionButton, e.g. Create new.
withDefaults(
  defineProps<{
    icon: string;
    routeName: string;
    params?: Record<string, string>;
    newWindow?: boolean;
    variant?: Variant;
  }>(),
  { params: () => ({}), variant: "primary" },
);

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "bg-primary-200 border-primary-400 text-neutral-900 hover:bg-primary-300",
  neutral: "bg-white border-neutral-400 text-neutral-800 hover:bg-neutral-200",
};
</script>

<template>
  <RouterLink
    :to="{ name: routeName, params: params }"
    :target="newWindow ? '_blank' : undefined"
    :class="VARIANT_CLASS[variant]"
    class="inline-flex items-center justify-center gap-1 rounded border px-2 py-1 text-sm font-medium whitespace-nowrap select-none"
  >
    <Icon :icon="icon" class="size-4" />
    <slot />
  </RouterLink>
</template>

<style scoped></style>
