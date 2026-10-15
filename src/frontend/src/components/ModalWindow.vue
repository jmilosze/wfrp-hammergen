<script setup lang="ts">
import { useTemplateRef, watch } from "vue";
import IconButton from "./IconButton.vue";

// A popup window on the browser's modal <dialog>: open (v-model:open) shows it over a shade, with the rest of the page
// out of reach; Escape, the close button or a click on the shade close it. Its content is rendered only while it is
// open: a closed window would otherwise be redrawn on every change of what it shows, and each opening starts afresh
// (e.g. an empty search). It sits at the end of the body, so the page's styles around it don't apply.
// fullHeight: the window keeps its full height whatever its content, so it doesn't move when the content shrinks,
// e.g. while searching a list.
type ModalSize = "xs" | "sm" | "md" | "lg";

withDefaults(defineProps<{ size?: ModalSize; fullHeight?: boolean }>(), { size: "sm" });

const open = defineModel<boolean>("open", { required: true });

const SIZE_CLASS: Record<ModalSize, string> = {
  xs: "max-w-xl",
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
};

const dialog = useTemplateRef("dialog");

watch(
  open,
  (isOpen) => {
    if (isOpen) {
      dialog.value?.showModal();
    } else {
      dialog.value?.close();
    }
  },
  { flush: "post" },
);

// The window fills the dialog, so a click on the dialog element itself is a click on the shade.
function onClick(event: MouseEvent) {
  if (event.target === dialog.value) {
    open.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      :class="SIZE_CLASS[size]"
      class="modal-window m-auto w-[calc(100%-2.5rem)] max-h-[95svh] p-0 bg-transparent overflow-visible backdrop:bg-neutral-500/70"
      @close="open = false"
      @click="onClick"
    >
      <div
        v-if="open"
        class="flex flex-col max-h-[95svh] bg-white rounded-lg shadow border border-neutral-500"
        :class="{ 'h-[95svh]': fullHeight }"
      >
        <div class="p-3 flex justify-between">
          <div class="text-xl font-semibold text-neutral-900"><slot name="header" /></div>
          <IconButton icon="lucide:x" size="lg" label="Close" @click="open = false" />
        </div>
        <div class="border-b border-neutral-200 w-full" />
        <div class="p-3 overflow-auto grow">
          <slot />
        </div>
        <div class="border-b border-neutral-200 w-full" />
        <div class="p-3">
          <slot name="buttons"></slot>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
/* The window and its shade fade in. */
.modal-window[open],
.modal-window[open]::backdrop {
  transition: opacity 150ms ease-in-out;
}

@starting-style {
  .modal-window[open],
  .modal-window[open]::backdrop {
    opacity: 0;
  }
}
</style>
