<script setup lang="ts">
import { TableField, TableRow } from "../utils/tableUtils.ts";
import { computed, onUpdated, ref, Ref } from "vue";
import TablePagination from "./TablePagination.vue";

const DEFAULT_PER_PAGE = 100;

const props = defineProps<{
  fields: TableField[];
  items: TableRow[];
  perPage?: number;
}>();

const rowsPerPage: number = props.perPage ? props.perPage : DEFAULT_PER_PAGE;
const startRow: Ref<number> = ref(0);

const filteredItems = computed(() => {
  return props.items.slice(startRow.value, startRow.value + rowsPerPage);
});

const needToScroll: Ref<"top" | "bottom" | "no"> = ref("no");

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
  <TablePagination
    v-model="startRow"
    :totalRows="items.length"
    :rowsPerPage="rowsPerPage"
    class="mt-3"
    @update:modelValue="needToScroll = 'top'"
  />
  <div class="overflow-x-auto">
    <div class="mt-3 bg-neutral-50 rounded-xl border border-neutral-200 min-w-fit">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th v-for="field in fields" :key="field.name" class="border-b border-neutral-200 py-2 px-5">
              {{ field.displayName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredItems" :key="item.id" class="bg-white hover:bg-neutral-200">
            <td v-for="field in fields" :key="field.name" class="py-2 px-5 border-b border-neutral-200">
              {{ item[field.name] }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
  <TablePagination
    v-model="startRow"
    :totalRows="items.length"
    :rowsPerPage="rowsPerPage"
    class="mt-3"
    @update:modelValue="needToScroll = 'bottom'"
  />
</template>

<style scoped></style>
