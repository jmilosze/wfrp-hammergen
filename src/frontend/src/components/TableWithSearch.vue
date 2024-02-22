<script setup lang="ts">
import { TableField, TableRow } from "../utils/table.ts";
import { computed, onUpdated, ref, Ref, watch } from "vue";
import TablePagination from "./TablePagination.vue";
import { refDebounced } from "@vueuse/core";
import ActionButton from "./ActionButton.vue";
import { useElSize } from "../composables/viewSize.ts";
import { ViewSize } from "../utils/viewSize.ts";

const DEFAULT_PER_PAGE = 100;
const SEARCH_DEBOUNCE_MS = 250;

const props = defineProps<{
  fields: TableField[];
  items: TableRow[];
  perPage?: number;
  stackedViewSize: ViewSize;
  modelValue: string;
  addCreateNewBtn: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
  (e: "createNew"): void;
}>();

const contentContainerRef = ref(null);
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

const rowsPerPage: number = props.perPage ? props.perPage : DEFAULT_PER_PAGE;
const startRow: Ref<number> = ref(0);
const needToScroll: Ref<"top" | "bottom" | "no"> = ref("no");
const itemsOnPage = computed(() => {
  return searchedItems.value.slice(startRow.value, startRow.value + rowsPerPage);
});

function searchInRow(row: TableRow): boolean {
  for (const column of props.fields) {
    if (String(row[column.name]).includes(searchTermDebounced.value)) {
      return true;
    }
  }
  return false;
}

onUpdated(() => {
  if (needToScroll.value === "top") {
    needToScroll.value = "no";
    window.scroll(0, 0);
    return;
  }

  if (needToScroll.value === "bottom") {
    needToScroll.value = "no";
    window.scroll(0, document.body.scrollHeight);
    return;
  }
});
</script>

<template>
  <div ref="contentContainerRef">
    <div class="flex justify-stretch flex-wrap items-stretch">
      <ActionButton v-if="addCreateNewBtn" class="mr-2 mb-2 shrink-0" @click="emit('createNew')"
        >Create New</ActionButton
      >
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Type to Search"
        class="border-2 border-neutral-200 rounded h-10 px-2 focus:border-neutral-700 transition-colors duration-200 grow"
      />
    </div>
    <TablePagination
      v-model="startRow"
      :totalRows="searchedItems.length"
      :rowsPerPage="rowsPerPage"
      class="mt-3"
      @update:modelValue="needToScroll = 'top'"
    />
    <div class="overflow-x-auto">
      <div class="mt-3 bg-neutral-50 rounded-xl border border-neutral-200 min-w-fit">
        <table v-if="isEqualOrGreater" class="w-full">
          <thead>
            <tr class="text-left">
              <th v-for="field in fields" :key="field.name" class="border-b border-neutral-200 py-2 px-5">
                {{ field.displayName }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itemsOnPage" :key="item.id" class="bg-white hover:bg-neutral-200">
              <td v-for="field in fields" :key="field.name" class="py-2 px-5 border-b border-neutral-200">
                <slot :name="field.name" v-bind="item">{{ item[field.name] }}</slot>
              </td>
            </tr>
          </tbody>
        </table>
        <table v-else class="w-full">
          <thead>
            <tr class="text-left">
              <th class="border-b border-neutral-200 py-2 px-5"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itemsOnPage" :key="item.id" class="bg-white hover:bg-neutral-200">
              <td class="text-sm">
                <div v-for="field in fields" :key="field.name" class="py-2 px-5 border-b border-neutral-200">
                  <span class="font-bold">{{ field.displayName }}: </span>
                  <slot :name="field.name" v-bind="item">{{ item[field.name] }}</slot>
                </div>
                <div class="border-b-4 border-neutral-400"></div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
      </div>
    </div>
    <TablePagination
      v-model="startRow"
      :totalRows="searchedItems.length"
      :rowsPerPage="rowsPerPage"
      class="mt-3"
      @update:modelValue="needToScroll = 'bottom'"
    />
  </div>
</template>

<style scoped></style>
