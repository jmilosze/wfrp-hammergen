<script setup lang="ts">
import { computed } from "vue";
import { RouteLocationRaw } from "vue-router";
import { Icon } from "@iconify/vue";
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS } from "./buttonStyle.ts";

// A button that shows only an icon; label names it for screen readers and as its tooltip. With to, it is a link.
// ghost: a grey icon without a border, e.g. removing a row or closing a popup. light: bordered like a light
// SectionButton, e.g. a list row's Copy and View.
type IconButtonVariant = "ghost" | "light";
type IconButtonSize = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    icon: string;
    label: string;
    to?: RouteLocationRaw;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
  }>(),
  { to: undefined, variant: "ghost", size: "md" },
);

const ICON_SIZE_CLASS: Record<IconButtonSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const buttonClass = computed(() =>
  props.variant === "light"
    ? [BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS.light, "p-1.5"]
    : [
        "rounded cursor-pointer text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900",
        props.size === "sm" ? "p-0.5" : "p-1",
      ],
);
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="buttonClass" :title="label" :aria-label="label">
    <Icon :icon="icon" :class="ICON_SIZE_CLASS[size]" />
  </RouterLink>
  <button v-else type="button" :class="buttonClass" :title="label" :aria-label="label">
    <Icon :icon="icon" :class="ICON_SIZE_CLASS[size]" />
  </button>
</template>
