<script setup lang="ts">
const props = defineProps<{
  fields: { name: string; displayName: string }[];
  items: { name: string; value: string | number }[];
}>();

const rows: Array<Array<string | number>> = [];

for (const item of props.items) {
  // const row: Array<string | number> = [];
  // for (const field of props.fields) {
  // }
}
</script>

<template>
  <div class="pt-2 overflow-x-auto select-none">
    <div class="mt-3 bg-neutral-50 rounded-xl border border-neutral-200">
      <table class="w-full">
        <thead>
          <tr>
            <th v-for="field in fields" :key="field.name" class="border-b border-neutral-200 p-2">
              {{ field.displayName }}
            </th>
          </tr>
        </thead>
        <!--    <tbody>-->
        <!--      <tr v-for="row in rows" :key="row.id">-->
        <!--        <td v-for="(value, columnName) in row" :key="columnName">{{ value }}</td>-->
        <!--      </tr>-->
        <!--    </tbody>-->
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
