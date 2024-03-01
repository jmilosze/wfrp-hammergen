<script setup lang="ts">
import { TableField, TableRow } from "../utils/table.ts";

defineProps<{
  title: string;
  fields: TableField[];
  items: TableRow[];
  stack?: boolean;
}>();
</script>

<template>
  <div v-if="items.length" class="text-left">
    <div class="m-1 my-3">
      <div class="mb-1">{{ title }}</div>
      <table v-if="!stack" class="border-collapse w-full">
        <tbody>
          <tr>
            <th
              v-for="field in fields.filter((x) => x.colspan !== 0)"
              :key="field.name"
              class="border border-neutral-400 p-2 font-semibold"
              :colspan="field.colspan ? field.colspan : 1"
            >
              {{ field.displayName }}
            </th>
          </tr>
          <tr v-for="item in items" :key="item.id">
            <td v-for="field in fields" :key="field.name" class="border border-neutral-400 p-2">
              <slot :name="field.name" v-bind="item">{{ item[field.name] }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
      <table v-else class="border-collapse w-full">
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td class="border border-neutral-400 p-2">
              <div v-for="field in fields" :key="field.name">
                <span class="font-semibold">{{ field.displayName }}: </span>
                <slot :name="field.name" v-bind="item">{{ item[field.name] }}</slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
