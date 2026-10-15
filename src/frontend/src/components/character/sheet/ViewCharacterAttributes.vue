<script setup lang="ts">
import SheetCard from "../../sheet/SheetCard.vue";
import { Attributes } from "../../../services/wh/core/attributes.ts";

// The character view's attributes, read-only: a column per attribute and the given rows (e.g. Initial, Advances,
// Current); the last row is the total, in bold. One row of ten columns when wide; two tables of five when narrow.
defineProps<{ title: string; rows: { name: string; values: Attributes }[] }>();

const FIRST_HALF: (keyof Attributes)[] = ["WS", "BS", "S", "T", "I"];
const SECOND_HALF: (keyof Attributes)[] = ["Ag", "Dex", "Int", "WP", "Fel"];
const TABLES = [
  { names: [...FIRST_HALF, ...SECOND_HALF], class: "hidden @md:table" },
  { names: FIRST_HALF, class: "@md:hidden" },
  { names: SECOND_HALF, class: "@md:hidden border-t border-neutral-300" },
];

const thClass = "px-2 py-2 border-b border-neutral-300 text-left";
const tdClass = "px-2 py-2 border-b border-neutral-300";
</script>

<template>
  <SheetCard :title="title">
    <div class="@container">
      <table v-for="(table, i) in TABLES" :key="i" class="w-full" :class="table.class">
        <thead>
          <tr>
            <th :class="thClass" class="border-r">Source</th>
            <th v-for="name in table.names" :key="name" :class="thClass">{{ name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, r) in rows" :key="row.name" :class="{ 'font-semibold': r === rows.length - 1 }">
            <td :class="tdClass" class="border-r font-semibold">{{ row.name }}</td>
            <td v-for="name in table.names" :key="name" :class="tdClass">{{ row.values[name] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </SheetCard>
</template>

<style scoped></style>
