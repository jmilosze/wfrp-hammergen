<script setup lang="ts">
import { useModal } from "../composables/modal.ts";

defineProps<{
  id: string;
}>();

const modal = useModal();
</script>

<template>
  <Teleport v-if="id === modal.modalId.value" to="#modal">
    <div class="flex justify-center">
      <div class="bg-white rounded-lg shadow p-3 m-5 w-fit border border-neutral-800" @click.stop>
        <div class="flex justify-between">
          <button
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            @click="modal.hideModal()"
          >
            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
