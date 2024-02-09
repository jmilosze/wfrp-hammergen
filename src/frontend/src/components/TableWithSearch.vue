<script setup lang="ts">
import { TableField, TableItem } from "../utils/tableUtils.ts";
import { computed, ref, Ref } from "vue";

const DEFAULT_PER_PAGE = 100;

const props = defineProps<{
  fields: TableField[];
  items: TableItem[];
  perPage?: number;
}>();

const rowsPerPage: number = props.perPage ? props.perPage : DEFAULT_PER_PAGE;
const startRow: Ref<number> = ref(0);

const filteredItems = computed(() => {
  return props.items.slice(startRow.value, startRow.value + rowsPerPage);
});

function movePage(direction: -1 | 1): void {
  let newStartRow = startRow.value + direction * rowsPerPage;
  if (newStartRow >= 0 && newStartRow < props.items.length) {
    startRow.value = newStartRow;
  }
}
</script>

<template>
  <div class="pt-2 overflow-x-auto select-none">
    <p>Results {{ filteredItems.length }}</p>
    <div class="mt-3 bg-neutral-50 rounded-xl border border-neutral-200">
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
    <button @click="movePage(-1)">Back</button>
    <p>{{ startRow / rowsPerPage + 1 }} out of {{ Math.ceil(items.length / rowsPerPage) }}</p>
    <button @click="movePage(1)">Next</button>
  </div>
</template>

<style scoped></style>
