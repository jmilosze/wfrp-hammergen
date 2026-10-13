<script setup lang="ts" generic="T extends TableRow">
import { TableField, TableRow } from "../utils/table.ts";
import { computed, nextTick, ref, Ref, watch } from "vue";
import TablePagination from "./TablePagination.vue";
import { refDebounced } from "@vueuse/core";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";

export type StackBreakpoint = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

const DEFAULT_PER_PAGE = 50;
const SEARCH_DEBOUNCE_MS = 250;

const props = defineProps<{
  fields: TableField[];
  items: T[];
  perPage?: number;
  stackBreakpoint?: StackBreakpoint;
  modelValue: string;
  loading?: boolean;
  resetPagination?: number;
  rowRouteName?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();

const desktopClasses: Record<StackBreakpoint, string> = {
  none: "w-full table",
  xs: "w-full hidden @xs:table",
  sm: "w-full hidden @sm:table",
  md: "w-full hidden @md:table",
  lg: "w-full hidden @lg:table",
  xl: "w-full hidden @xl:table",
  "2xl": "w-full hidden @2xl:table",
  "3xl": "w-full hidden @3xl:table",
  "4xl": "w-full hidden @4xl:table",
  "5xl": "w-full hidden @5xl:table",
};

const mobileClasses: Record<StackBreakpoint, string> = {
  none: "hidden",
  xs: "w-full @xs:hidden",
  sm: "w-full @sm:hidden",
  md: "w-full @md:hidden",
  lg: "w-full @lg:hidden",
  xl: "w-full @xl:hidden",
  "2xl": "w-full @2xl:hidden",
  "3xl": "w-full @3xl:hidden",
  "4xl": "w-full @4xl:hidden",
  "5xl": "w-full @5xl:hidden",
};

const desktopTableClass = desktopClasses[props.stackBreakpoint ?? "none"];
const mobileTableClass = mobileClasses[props.stackBreakpoint ?? "none"];

const searchTerm: Ref<string> = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
const searchTermDebounced = refDebounced(searchTerm, SEARCH_DEBOUNCE_MS);
const searchedItems = computed(() => {
  if (!searchTerm.value) {
    return props.items;
  } else {
    const query = searchTermDebounced.value.toLowerCase();
    return props.items.filter((row) => searchInRow(row, query));
  }
});

watch(searchTermDebounced, () => {
  startRow.value = 0;
});

watch(
  () => props.resetPagination,
  () => {
    startRow.value = 0;
  },
);

const rowsPerPage: number = props.perPage ? props.perPage : DEFAULT_PER_PAGE;
const startRow: Ref<number> = ref(0);
const itemsOnPage = computed(() => {
  return searchedItems.value.slice(startRow.value, startRow.value + rowsPerPage);
});

function searchInRow(row: TableRow, query: string): boolean {
  for (const column of props.fields) {
    if (String(row[column.name]).toLowerCase().includes(query)) {
      return true;
    }
  }
  return false;
}

const tableRoot = ref<HTMLDivElement | null>(null);

async function scrollToTop(): Promise<void> {
  await nextTick();
  let parent = tableRoot.value?.parentElement ?? null;
  let hasScrolledParent = false;

  while (parent && parent !== document.body) {
    const { overflowY } = window.getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") {
      parent.scroll(0, 0);
      hasScrolledParent = true;
    }
    parent = parent.parentElement;
  }

  if (!hasScrolledParent) {
    window.scroll(0, 0);
  }
}
</script>

<template>
  <div ref="tableRoot" class="@container">
    <!-- The search field in the style of a sheet cell, with the page's buttons (the slot) beside it. -->
    <div class="flex flex-wrap items-stretch gap-2">
      <label
        class="flex flex-[999_1_0%] min-w-60 border border-neutral-400 bg-white focus-within:outline-2 focus-within:-outline-offset-2 outline-neutral-700"
      >
        <span class="flex items-center gap-1 px-2 border-r border-neutral-300 font-semibold">
          <Icon icon="lucide:search" class="size-4" />
          <!-- Only the magnifying glass on small screens; the word stays for screen readers. -->
          <span class="sr-only @md:not-sr-only">Search</span>
        </span>
        <input v-model="searchTerm" type="text" class="flex-1 min-w-0 min-h-9 px-2 outline-none bg-primary-50" />
      </label>
      <div v-if="$slots.default" class="contents">
        <slot />
      </div>
    </div>

    <!-- Only before there are rows: on a reload the rows stay in place and the reload button shows the progress. -->
    <div v-if="props.loading && searchedItems.length === 0" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-if="searchedItems.length > 0">
      <TablePagination
        v-if="searchedItems.length > rowsPerPage"
        v-model="startRow"
        :totalRows="searchedItems.length"
        :rowsPerPage="rowsPerPage"
        class="mt-3"
        @update:modelValue="scrollToTop"
      />
      <div
        class="mt-3 bg-white rounded-lg border border-neutral-300 overflow-hidden min-w-fit [&_tbody>tr:last-child>td]:border-b-0"
      >
        <table class="w-full" :class="[desktopTableClass, props.rowRouteName ? 'table-clickable' : '']">
          <thead>
            <tr class="text-left bg-neutral-100">
              <th
                v-for="field in fields"
                :key="field.name"
                class="border-b border-neutral-300 py-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-600"
              >
                {{ field.displayName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in itemsOnPage"
              :key="item.id"
              class="bg-white hover:bg-neutral-100"
              :class="[props.rowRouteName ? 'cursor-pointer table-row-clickable' : '']"
            >
              <td
                v-for="(field, fieldIndex) in fields"
                :key="field.name"
                class="border-b border-neutral-300"
                :class="[
                  field.name === 'name' ? 'wrap-break-word' : '',
                  field.name === 'description' ? 'wrap-anywhere' : '',
                  props.rowRouteName && field.name !== 'actions' ? 'table-cell-link-container' : 'py-2 px-3',
                ]"
              >
                <RouterLink
                  v-if="props.rowRouteName && field.name !== 'actions'"
                  :to="{ name: props.rowRouteName, params: { id: item.id } }"
                  :tabindex="fieldIndex === 0 ? undefined : -1"
                  class="py-2 px-3 flex items-center w-full h-full text-inherit no-underline hover:text-inherit"
                >
                  <slot :name="field.name" v-bind="item">{{ String(item[field.name]) }}</slot>
                </RouterLink>
                <div v-else-if="props.rowRouteName" class="relative py-2 px-5 h-full">
                  <RouterLink
                    :to="{ name: props.rowRouteName, params: { id: item.id } }"
                    tabindex="-1"
                    aria-hidden="true"
                    class="absolute inset-0"
                  />
                  <div class="relative w-fit">
                    <slot :name="field.name" v-bind="item">{{ String(item[field.name]) }}</slot>
                  </div>
                </div>
                <slot v-else :name="field.name" v-bind="item">{{ String(item[field.name]) }}</slot>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="w-full" :class="mobileTableClass">
          <thead>
            <tr class="text-left">
              <th class="border-b border-neutral-300 py-1" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in itemsOnPage"
              :key="item.id"
              class="bg-white hover:bg-neutral-100"
              :class="[props.rowRouteName ? 'cursor-pointer' : '']"
            >
              <td class="text-sm">
                <template v-for="(field, fieldIndex) in fields" :key="field.name">
                  <RouterLink
                    v-if="props.rowRouteName && field.name !== 'actions'"
                    :to="{ name: props.rowRouteName, params: { id: item.id } }"
                    :tabindex="fieldIndex === 0 ? undefined : -1"
                    class="py-2 px-3 border-b border-neutral-300 flex items-center gap-2 text-inherit no-underline hover:text-inherit"
                    :class="[
                      field.name === 'name' ? 'wrap-break-word' : '',
                      field.name === 'description' ? 'wrap-anywhere' : '',
                    ]"
                  >
                    <div v-if="!field.skipStackedTitle" class="font-bold">{{ field.displayName }}</div>
                    <slot :name="field.name" v-bind="item">{{ String(item[field.name]) }}</slot>
                  </RouterLink>
                  <div
                    v-else
                    class="py-2 px-3 border-b border-neutral-300 flex items-center gap-2"
                    :class="[
                      field.name === 'name' ? 'wrap-break-word' : '',
                      field.name === 'description' ? 'wrap-anywhere' : '',
                      props.rowRouteName ? 'relative' : '',
                    ]"
                  >
                    <RouterLink
                      v-if="props.rowRouteName"
                      :to="{ name: props.rowRouteName, params: { id: item.id } }"
                      tabindex="-1"
                      aria-hidden="true"
                      class="absolute inset-0"
                    />
                    <div v-if="!field.skipStackedTitle" class="font-bold">{{ field.displayName }}</div>
                    <div :class="props.rowRouteName ? 'relative' : ''">
                      <slot :name="field.name" v-bind="item">{{ String(item[field.name]) }}</slot>
                    </div>
                  </div>
                </template>
                <div class="border-b-2 border-neutral-300" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <TablePagination
        v-if="searchedItems.length > rowsPerPage"
        v-model="startRow"
        :totalRows="searchedItems.length"
        :rowsPerPage="rowsPerPage"
        class="mt-3"
        @update:modelValue="scrollToTop"
      />
    </div>
    <div v-else class="mt-2">No results found.</div>
  </div>
</template>

<style scoped>
.table-clickable {
  height: 1px;
}

.table-cell-link-container {
  padding: 0;
  height: inherit;
}

.table-row-clickable {
  height: 100%;
}
</style>
