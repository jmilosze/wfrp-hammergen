<script setup lang="ts" generic="T extends TableRow">
import { TableField, TableRow } from "../utils/table.ts";
import { computed, nextTick, ref, Ref, watch } from "vue";
import TablePagination from "./TablePagination.vue";
import { refDebounced } from "@vueuse/core";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { RouterLink } from "vue-router";

export type StackBreakpoint = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

const DEFAULT_PER_PAGE = 50;
const SEARCH_DEBOUNCE_MS = 250;

const props = defineProps<{
  fields: TableField[];
  items: T[];
  perPage?: number;
  stackBreakpoint?: StackBreakpoint;
  modelValue: string;
  elementId?: string;
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

async function scrollToTop(): Promise<void> {
  await nextTick();
  if (props.elementId) {
    const element = document.getElementById(props.elementId);
    if (element) {
      element.scroll(0, 0);
    }
  } else {
    window.scroll(0, 0);
  }
}

</script>

<template>
  <div class="@container">
    <div class="flex flex-wrap">
      <slot />
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Type to Search"
        class="border border-neutral-300 rounded h-10 px-2 grow focus:border-transparent focus:outline-neutral-700 focus:outline-2 w-32"
      />
    </div>

    <div v-if="props.loading" class="flex justify-center">
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
      <div class="mt-3 bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
        <table class="w-full" :class="desktopTableClass">
          <thead>
            <tr class="text-left">
              <th v-for="field in fields" :key="field.name" class="border-b border-neutral-300 py-2 px-5">
                {{ field.displayName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in itemsOnPage"
              :key="item.id"
              class="bg-white hover:bg-neutral-200"
              :class="[props.rowRouteName ? 'cursor-pointer table-row-clickable' : '']"
            >
              <td
                v-for="(field, fieldIndex) in fields"
                :key="field.name"
                class="border-b border-neutral-300"
                :class="[
                  field.name === 'name' ? 'wrap-break-word' : '',
                  field.name === 'description' ? 'wrap-anywhere' : '',
                  props.rowRouteName && field.name !== 'actions' ? 'table-cell-link-container' : 'py-2 px-5',
                ]"
              >
                <RouterLink
                  v-if="props.rowRouteName && field.name !== 'actions'"
                  :to="{ name: props.rowRouteName, params: { id: item.id } }"
                  :tabindex="fieldIndex === 0 ? undefined : -1"
                  class="py-2 px-5 block w-full h-full text-inherit no-underline hover:text-inherit"
                >
                  <slot :name="field.name" v-bind="item">{{ String(item[field.name]) }}</slot>
                </RouterLink>
                <slot v-else :name="field.name" v-bind="item">{{ String(item[field.name]) }}</slot>
              </td>
            </tr>
          </tbody>
        </table>
        <table class="w-full" :class="mobileTableClass">
          <thead>
            <tr class="text-left">
              <th class="border-b border-neutral-300 py-2 px-5" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in itemsOnPage"
              :key="item.id"
              class="bg-white hover:bg-neutral-200"
              :class="[props.rowRouteName ? 'cursor-pointer' : '']"
            >
              <td class="text-sm">
                <template v-for="(field, fieldIndex) in fields" :key="field.name">
                  <RouterLink
                    v-if="props.rowRouteName && field.name !== 'actions'"
                    :to="{ name: props.rowRouteName, params: { id: item.id } }"
                    :tabindex="fieldIndex === 0 ? undefined : -1"
                    class="py-2 px-5 border-b border-neutral-300 flex items-center gap-2 text-inherit no-underline hover:text-inherit"
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
                    class="py-2 px-5 border-b border-neutral-300 flex items-center gap-2"
                    :class="[
                      field.name === 'name' ? 'wrap-break-word' : '',
                      field.name === 'description' ? 'wrap-anywhere' : '',
                    ]"
                  >
                    <div v-if="!field.skipStackedTitle" class="font-bold">{{ field.displayName }}</div>
                    <slot :name="field.name" v-bind="item">{{ String(item[field.name]) }}</slot>
                  </div>
                </template>
                <div class="border-b-4 border-neutral-400" />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
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
.table-cell-link-container {
  padding: 0;
  height: inherit;
}

.table-row-clickable {
  height: 1px;
}
</style>
