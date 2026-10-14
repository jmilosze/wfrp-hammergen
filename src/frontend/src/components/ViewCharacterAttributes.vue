<script setup lang="ts">
import SectionCard from "./SectionCard.vue";
import { Attributes } from "../services/wh/core/attributes.ts";

// The character view's attributes, read-only, with the rows of the editor's attribute table. One row of ten columns
// when wide; two tables of five when narrow.
const props = defineProps<{ base: Attributes; other: Attributes; advances: Attributes; total: Attributes }>();

const FIRST_HALF: (keyof Attributes)[] = ["WS", "BS", "S", "T", "I"];
const SECOND_HALF: (keyof Attributes)[] = ["Ag", "Dex", "Int", "WP", "Fel"];
const TABLES = [
  { names: [...FIRST_HALF, ...SECOND_HALF], class: "hidden @xl:table" },
  { names: FIRST_HALF, class: "@xl:hidden" },
  { names: SECOND_HALF, class: "@xl:hidden border-t border-neutral-300" },
];

const rows = [
  { name: "Base", values: props.base },
  { name: "Other", values: props.other },
  { name: "Adv", values: props.advances },
  { name: "Sum", values: props.total },
];

const thClass = "px-2 py-2 border-b border-neutral-300 text-left";
const tdClass = "px-2 py-2 border-b border-neutral-300";
</script>

<template>
  <SectionCard title="Attributes">
    <div class="@container">
      <table v-for="(table, i) in TABLES" :key="i" class="w-full" :class="table.class">
        <thead>
          <tr>
            <th :class="thClass" class="border-r">Source</th>
            <th v-for="name in table.names" :key="name" :class="thClass">{{ name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.name" :class="{ 'font-semibold': row.name === 'Sum' }">
            <td :class="tdClass" class="border-r font-semibold">{{ row.name }}</td>
            <td v-for="name in table.names" :key="name" :class="tdClass">{{ row.values[name] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </SectionCard>
</template>

<style scoped></style>
