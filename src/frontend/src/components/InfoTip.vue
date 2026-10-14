<script setup lang="ts">
import { ref, useId } from "vue";

// A small explanation bubble for an icon (the slot). Tapping or clicking the icon toggles it, and on devices that can
// hover it also shows on hover. It is a browser popover: a tap or click elsewhere or Escape closes it, and it is placed
// under the icon (above it near the bottom of the screen), kept on screen. Scrolling or resizing closes it.
defineProps<{ text: string; label: string }>();

const GAP = 6;
const MARGIN = 8;

const button = ref<HTMLButtonElement | null>(null);
const bubble = ref<HTMLDivElement | null>(null);
const bubbleId = useId();
let openedByHover = false;

function isOpen(): boolean {
  return bubble.value?.matches(":popover-open") ?? false;
}

function place() {
  if (!button.value || !bubble.value) {
    return;
  }
  const anchor = button.value.getBoundingClientRect();
  const { width, height } = bubble.value.getBoundingClientRect();
  const left = Math.min(
    Math.max(anchor.left + anchor.width / 2 - width / 2, MARGIN),
    window.innerWidth - width - MARGIN,
  );
  const below = anchor.bottom + GAP;
  const top = below + height > window.innerHeight - MARGIN ? anchor.top - height - GAP : below;
  bubble.value.style.left = `${left}px`;
  bubble.value.style.top = `${top}px`;
}

function show() {
  if (!isOpen()) {
    bubble.value?.showPopover();
    place();
  }
}

function onClick() {
  if (isOpen() && !openedByHover) {
    bubble.value?.hidePopover();
    return;
  }
  openedByHover = false;
  show();
}

function onMouseEnter() {
  if (window.matchMedia("(hover: hover)").matches && !isOpen()) {
    openedByHover = true;
    show();
  }
}

function onMouseLeave() {
  if (openedByHover) {
    openedByHover = false;
    bubble.value?.hidePopover();
  }
}

function close() {
  bubble.value?.hidePopover();
}

function onToggle(event: Event) {
  if (!(event instanceof ToggleEvent)) {
    return;
  }
  if (event.newState === "open") {
    window.addEventListener("scroll", close, { capture: true, once: true });
    window.addEventListener("resize", close, { once: true });
  } else {
    openedByHover = false;
    window.removeEventListener("scroll", close, { capture: true });
    window.removeEventListener("resize", close);
  }
}
</script>

<template>
  <!-- Above a row's covering link (z-10), so tapping the icon doesn't open the entry. -->
  <button
    ref="button"
    type="button"
    :aria-label="label"
    :aria-describedby="bubbleId"
    class="relative z-10 inline-flex align-[-0.15em] cursor-help rounded focus-visible:outline-2 outline-neutral-700"
    @click.stop.prevent="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </button>
  <div
    :id="bubbleId"
    ref="bubble"
    popover="auto"
    role="tooltip"
    class="fixed inset-auto m-0 max-w-64 rounded border border-neutral-900 bg-neutral-800 px-2 py-1 text-xs text-white shadow"
    @toggle="onToggle"
  >
    {{ text }}
  </div>
</template>

<style scoped></style>
