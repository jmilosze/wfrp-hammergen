<script setup lang="ts">
import { useModal } from "../composables/modal.ts";
import { Icon } from "@iconify/vue";
const props = defineProps<{
  id: string;
  size?: "lg" | "md" | "sm" | "xs";
  // fullHeight: the window keeps its full height whatever its content, so it doesn't move when the content shrinks,
  // e.g. while searching a list.
  fullHeight?: boolean;
}>();

const modal = useModal();

let modalSize = "max-w-2xl";
if (props.size === "md") {
  modalSize = "max-w-3xl";
} else if (props.size === "lg") {
  modalSize = "max-w-5xl";
} else if (props.size === "xs") {
  modalSize = "max-w-xl";
}
</script>

<template>
  <Teleport v-if="id === modal.modalId.value" to="#modal">
    <div class="w-full flex justify-center">
      <div
        class="bg-white rounded-lg shadow border mx-5 my-5 border-neutral-500 flex flex-col max-h-[95svh] w-full"
        :class="[modalSize, { 'h-[95svh]': fullHeight }]"
        @click.stop
      >
        <div class="p-3 flex justify-between">
          <div class="text-xl font-semibold text-neutral-900"><slot name="header" /></div>
          <button
            class="text-neutral-400 hover:bg-neutral-200 hover:text-neutral-900 rounded text-sm p-1"
            @click="modal.hideModal()"
          >
            <Icon icon="lucide:x" class="size-6" />
          </button>
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
    </div>
  </Teleport>
</template>

<style scoped></style>
