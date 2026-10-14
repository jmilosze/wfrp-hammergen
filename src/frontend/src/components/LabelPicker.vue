<script setup lang="ts" generic="T">
import { computed } from "vue";
import SectionCard from "./SectionCard.vue";
import LabelChips from "./LabelChips.vue";
import LabelAddSelect from "./LabelAddSelect.vue";

// A titled box picking several of a few options (e.g. species or characteristics): the picked ones are labels with a
// cross, Add in the title band offers the rest. Labels follow the options' order, or with inAddedOrder the order they
// were added in (kept in the model). With sheetRow it is a labelled row of a SheetTable instead, Add at the row's end.
const selected = defineModel<T[]>({ required: true });

const props = defineProps<{
  title: string;
  options: { text: string; value: T }[];
  disabled?: boolean;
  inAddedOrder?: boolean;
  sheetRow?: boolean;
}>();

const labels = computed(() =>
  props.inAddedOrder
    ? selected.value.flatMap((x) => props.options.filter((option) => option.value === x))
    : props.options.filter((x) => selected.value.includes(x.value)),
);
const unused = computed(() => props.options.filter((x) => !selected.value.includes(x.value)));
</script>

<template>
  <!-- Laid out like SheetCell, with Add in a cell of its own on the right, filling the row's height. -->
  <div v-if="sheetRow" class="flex items-stretch min-w-0 bg-white">
    <div
      data-sheet-label
      class="flex items-center shrink-0 min-w-32 px-2 border-r border-neutral-300 font-semibold whitespace-nowrap"
    >
      {{ title }}
    </div>
    <div class="flex items-center flex-1 min-w-0 min-h-9 px-2 py-1">
      <LabelChips
        :labels="labels"
        :removable="!disabled"
        class="flex-1"
        @remove="(x) => (selected = selected.filter((y) => y !== x))"
      />
    </div>
    <div v-if="!disabled" class="flex p-1 border-l border-neutral-300">
      <LabelAddSelect :options="unused" :ariaLabel="`Add to ${title}`" @add="(x) => (selected = [...selected, x])" />
    </div>
  </div>
  <SectionCard v-else :title="title">
    <template v-if="!disabled" #actions>
      <LabelAddSelect :options="unused" :ariaLabel="`Add to ${title}`" @add="(x) => (selected = [...selected, x])" />
    </template>
    <LabelChips
      :labels="labels"
      :removable="!disabled"
      class="p-2 min-h-11"
      @remove="(x) => (selected = selected.filter((y) => y !== x))"
    />
  </SectionCard>
</template>

<style scoped></style>
