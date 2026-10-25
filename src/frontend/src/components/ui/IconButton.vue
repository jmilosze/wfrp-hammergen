<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";
import { computed } from "vue";
import { RouteLocationRaw } from "vue-router";
import { Icon } from "@iconify/vue";
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS } from "./buttonStyle.ts";

// A button that shows only an icon; label names it for screen readers and as its tooltip. With to, it is a link.
// ghost: a grey icon without a border, e.g. removing a row or closing a popup. light: bordered like a light
// AppButton, e.g. a list row's Copy and View. circle: a ghost button in a round border, e.g. a +/- stepper.
type IconButtonVariant = "ghost" | "light" | "circle";
type IconButtonSize = "sm" | "md" | "lg";

// Other attributes and listeners (@click…) go to the <button> (or the link).
const props = withDefaults(
  defineProps<
    {
      icon: string;
      label: string;
      to?: RouteLocationRaw;
      variant?: IconButtonVariant;
      size?: IconButtonSize;
    } & /* @vue-ignore */ ButtonHTMLAttributes
  >(),
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
        "cursor-pointer transition-colors duration-100 hover:bg-neutral-200 hover:text-neutral-900",
        props.variant === "circle"
          ? "rounded-full border border-neutral-400 text-neutral-700 disabled:text-neutral-400 disabled:opacity-50 disabled:pointer-events-none"
          : "rounded text-neutral-400",
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
