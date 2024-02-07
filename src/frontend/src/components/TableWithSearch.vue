<script setup lang="ts">
import { TableField, TableItem } from "../utils/tableUtils.ts";

const DEFAULT_PER_PAGE = 100;

const props = defineProps<{
  fields: TableField[];
  items: TableItem[];
  perPage?: number;
}>();

// const rows = getRows(props.fields, props.items);

const numberOfitems = props.items.length;
</script>

<template>
  <div class="pt-2 overflow-x-auto select-none">
    <p>Results {{ numberOfitems }}</p>
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
          <tr v-for="item in items" :key="item.id" class="bg-white hover:bg-neutral-200">
            <td v-for="field in fields" :key="field.name" class="py-2 px-5 border-b border-neutral-200">
              {{ item[field.name] }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
