<script setup lang="ts">
import { ref, useId } from "vue";
import { Icon } from "@iconify/vue";
import { BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS } from "./buttonStyle.ts";
import { ActionMenuItem } from "./actionMenu.ts";

// A "⋯" button that opens a small menu of actions, e.g. a row's actions where there is no room for their buttons. It is a
// browser popover opened and closed by its button (popovertarget, so a tap on the button closes it instead of reopening
// it); choosing an action, a tap or click elsewhere or Escape closes it. It is placed under the button, aligned to its
// right edge (above it near the bottom of the screen) and kept on screen; scrolling or resizing closes it. label names
// the button for screen readers and as its tooltip.
defineProps<{ label: string; items: ActionMenuItem[] }>();

const GAP = 4;
const MARGIN = 8;

const button = ref<HTMLButtonElement | null>(null);
const menu = ref<HTMLDivElement | null>(null);
const menuId = useId();
const open = ref(false);

// Before it shows: under the button, its right edge at the button's (the menu's width isn't known yet).
function placeBelow() {
  if (!button.value || !menu.value) {
    return;
  }
  const anchor = button.value.getBoundingClientRect();
  menu.value.style.right = `${Math.max(window.innerWidth - anchor.right, MARGIN)}px`;
  menu.value.style.top = `${anchor.bottom + GAP}px`;
}

// Once it shows: above the button instead when it would run off the bottom of the screen.
function flipIfNeeded() {
  if (!button.value || !menu.value) {
    return;
  }
  const anchor = button.value.getBoundingClientRect();
  const { height } = menu.value.getBoundingClientRect();
  if (anchor.bottom + GAP + height > window.innerHeight - MARGIN) {
    menu.value.style.top = `${Math.max(anchor.top - height - GAP, MARGIN)}px`;
  }
}

function close() {
  menu.value?.hidePopover();
}

function choose(item: ActionMenuItem) {
  close();
  item.action();
}

function onBeforeToggle(event: Event) {
  if (event instanceof ToggleEvent && event.newState === "open") {
    placeBelow();
  }
}

function onToggle(event: Event) {
  if (!(event instanceof ToggleEvent)) {
    return;
  }
  open.value = event.newState === "open";
  if (open.value) {
    flipIfNeeded();
    window.addEventListener("scroll", close, { capture: true, once: true });
    window.addEventListener("resize", close, { once: true });
  } else {
    window.removeEventListener("scroll", close, { capture: true });
    window.removeEventListener("resize", close);
  }
}
</script>

<template>
  <button
    ref="button"
    type="button"
    :aria-label="label"
    :title="label"
    aria-haspopup="menu"
    :aria-expanded="open"
    :aria-controls="menuId"
    :popovertarget="menuId"
    :class="[BUTTON_BASE_CLASS, BUTTON_VARIANT_CLASS.neutral, 'p-1.5']"
  >
    <Icon icon="lucide:ellipsis" class="size-5" />
  </button>
  <div
    :id="menuId"
    ref="menu"
    popover="auto"
    role="menu"
    :aria-label="label"
    class="fixed inset-auto m-0 min-w-40 rounded border border-neutral-400 bg-white py-1 shadow"
    @beforetoggle="onBeforeToggle"
    @toggle="onToggle"
  >
    <button
      v-for="item in items"
      :key="item.label"
      type="button"
      role="menuitem"
      :disabled="item.disabled"
      :title="item.title"
      class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm cursor-pointer hover:bg-neutral-100 disabled:cursor-default disabled:text-neutral-400 disabled:hover:bg-transparent"
      @click="choose(item)"
    >
      <Icon :icon="item.icon" class="size-4 shrink-0" />
      {{ item.label }}
    </button>
  </div>
</template>
