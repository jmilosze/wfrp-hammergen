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

// A link that looks like a SectionButton, e.g. Create new.
withDefaults(
  defineProps<{
    icon: string;
    routeName: string;
    params?: Record<string, string>;
    newWindow?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
  }>(),
  { params: () => ({}), variant: "primary", size: "md" },
);
</script>

<template>
  <RouterLink
    :to="{ name: routeName, params: params }"
    :target="newWindow ? '_blank' : undefined"
    :class="[BUTTON_BASE_CLASS, BUTTON_SIZE_CLASS[size], BUTTON_VARIANT_CLASS[variant]]"
  >
    <Icon :icon="icon" :class="BUTTON_ICON_SIZE_CLASS[size]" />
    <slot />
  </RouterLink>
</template>

<style scoped></style>
