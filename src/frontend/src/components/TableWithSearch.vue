<script setup lang="ts" generic="T extends TableRow">
import { TableField, TableRow } from "../utils/table.ts";
import { computed, onUpdated, ref, Ref, watch } from "vue";
import TablePagination from "./TablePagination.vue";
import { refDebounced } from "@vueuse/core";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";
import SpinnerAnimation from "./SpinnerAnimation.vue";
import { addSpaces } from "../utils/string.ts";

const DEFAULT_PER_PAGE = 50;
const SEARCH_DEBOUNCE_MS = 250;

const props = defineProps<{
  fields: TableField[];
  items: T[];
  perPage?: number;
  stackedViewSize: ViewSize;
  modelValue: string;
  elementId?: string;
  loading?: boolean;
  resetPagination?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
  (e: "createNew"): void;
  (e: "reload"): void;
}>();

const contentContainerRef = ref<HTMLDivElement | null>(null);
const { isEqualOrGreater } = useElSize(props.stackedViewSize, contentContainerRef);

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
    return props.items.filter((row) => searchInRow(row));
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
const needToScroll: Ref<"top" | "bottom" | "no"> = ref("no");
const itemsOnPage = computed(() => {
  return searchedItems.value.slice(startRow.value, startRow.value + rowsPerPage);
});

function searchInRow(row: TableRow): boolean {
  for (const column of props.fields) {
    if (String(row[column.name]).toLowerCase().includes(searchTermDebounced.value.toLowerCase())) {
      return true;
    }
  }
  return false;
}

onUpdated(() => {
  if (needToScroll.value === "top") {
    needToScroll.value = "no";
    if (props.elementId) {
      const element = document.getElementById(props.elementId);
      if (element) {
        element.scroll(0, 0);
      }
    } else {
      window.scroll(0, 0);
    }

    return;
  }

  if (needToScroll.value === "bottom") {
    needToScroll.value = "no";
    if (props.elementId) {
      const element = document.getElementById(props.elementId);
      if (element) {
        element.scroll(0, element.scrollHeight);
      }
    } else {
      window.scroll(0, document.body.scrollHeight);
    }

    return;
  }
});
</script>

<template>
  <div ref="contentContainerRef">
    <div class="flex flex-wrap">
      <!--      <LinkButton-->
      <!--        v-if="addCreateNewBtn && routeName"-->
      <!--        class="mr-2 mb-2 shrink-0"-->
      <!--        :routeName="routeName"-->
      <!--        :params="{ id: 'create' }"-->
      <!--      >-->
      <!--        Create new-->
      <!--      </LinkButton>-->
      <slot />
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Type to Search"
        class="border border-neutral-300 rounded h-10 px-2 grow w-36 focus:border-transparent focus:outline-neutral-700 focus:outline focus:outline-2"
      />
    </div>
    <div v-if="props.loading" class="flex justify-center">
      <SpinnerAnimation class="w-14 m-2" />
    </div>
    <div v-else>
      <div v-if="searchedItems.length > 0">
        <TablePagination
          v-if="searchedItems.length > rowsPerPage"
          v-model="startRow"
          :totalRows="searchedItems.length"
          :rowsPerPage="rowsPerPage"
          class="mt-3"
          @update:modelValue="needToScroll = 'top'"
        />
        <div class="overflow-x-auto">
          <div class="mt-3 bg-neutral-50 rounded-xl border border-neutral-300 min-w-fit">
            <table v-if="isEqualOrGreater" class="w-full">
              <thead>
                <tr class="text-left">
                  <th v-for="field in fields" :key="field.name" class="border-b border-neutral-300 py-2 px-5">
                    {{ field.displayName }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsOnPage" :key="item.id" class="bg-white hover:bg-neutral-200">
                  <td v-for="field in fields" :key="field.name" class="py-2 px-5 border-b border-neutral-300">
                    <slot :name="field.name" v-bind="item">{{ addSpaces(String(item[field.name])) }}</slot>
                  </td>
                </tr>
              </tbody>
            </table>
            <table v-else class="w-full">
              <thead>
                <tr class="text-left">
                  <th class="border-b border-neutral-300 py-2 px-5" />
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in itemsOnPage" :key="item.id" class="bg-white hover:bg-neutral-200">
                  <td class="text-sm">
                    <div
                      v-for="field in fields"
                      :key="field.name"
                      class="py-2 px-5 border-b border-neutral-300 flex items-center gap-2"
                    >
                      <div v-if="!field.skipStackedTitle" class="font-bold">{{ field.displayName }}</div>
                      <slot :name="field.name" v-bind="item">{{ addSpaces(String(item[field.name])) }}</slot>
                    </div>
                    <div class="border-b-4 border-neutral-400" />
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="bg-neutral-50 rounded-b-xl h-5 w-full" />
          </div>
        </div>
        <TablePagination
          v-if="searchedItems.length > rowsPerPage"
          v-model="startRow"
          :totalRows="searchedItems.length"
          :rowsPerPage="rowsPerPage"
          class="mt-3"
          @update:modelValue="needToScroll = 'bottom'"
        />
      </div>
      <div v-else class="mt-2">No results found.</div>
    </div>
  </div>
</template>

<style scoped></style>
