<script setup lang="ts">
import AlertBlock from "./AlertBlock.vue";
import { LoadState } from "../composables/whList.ts";

// The load errors of a page's lists (or other loaded data), one closable alert each, centred above the page.
defineProps<{ states: LoadState[] }>();

function hide(state: LoadState) {
  state.showApiError.value = false;
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <template v-for="(state, i) in states" :key="i">
      <AlertBlock v-if="state.apiError.value && state.showApiError.value" alertType="red" @close="hide(state)">
        {{ state.apiError.value }}
      </AlertBlock>
    </template>
  </div>
</template>
