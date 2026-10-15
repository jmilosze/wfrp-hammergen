<script setup lang="ts">
import SpinnerAnimation from "../ui/SpinnerAnimation.vue";

// A list table in the style of the paper character sheet: one grey header row whose first cell holds the title and
// the actions, followed by the other column headers (headers slot, as th elements) and the rows (default slot).
// titleColspan lets the title cell span the following columns that have no header of their own.
withDefaults(
  defineProps<{
    title: string;
    loading?: boolean;
    titleColspan?: number;
    // editable: the list can be changed (e.g. with an Edit button), so the header row gets the faint yellow.
    editable?: boolean;
  }>(),
  { titleColspan: 1 },
);
</script>

<template>
  <div
    class="@container bg-white border border-neutral-400 min-w-fit print:break-inside-avoid font-sheet lining-nums [&_button]:font-sans [&_tbody>tr:last-child>td]:border-b-0"
  >
    <table class="w-full">
      <thead>
        <tr class="text-left" :class="{ 'bg-editable': editable }">
          <th :colspan="titleColspan" class="py-1 px-2 border-b border-neutral-300">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span>{{ title }}</span>
              <div v-if="$slots.actions" class="flex flex-wrap gap-2 font-normal">
                <slot name="actions" />
              </div>
            </div>
          </th>
          <slot name="headers" />
        </tr>
      </thead>
      <tbody v-if="!loading">
        <slot />
      </tbody>
    </table>
    <div v-if="loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
  </div>
</template>

<style scoped></style>
