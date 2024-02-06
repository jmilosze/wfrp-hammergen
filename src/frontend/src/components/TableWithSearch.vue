<script setup lang="ts">
type ArrayWithId<T> = Array<{ id: string; value: T }>;
type StringOrNumber = string | number;

const props = defineProps<{
  fields: { name: string; displayName: string }[];
  items: Record<string, StringOrNumber>[];
}>();

const fieldDict: Record<string, number> = {};
let numberOfFields: number = 0;
for (const [fieldNumber, field] of props.fields.entries()) {
  fieldDict[field.name] = fieldNumber;
  numberOfFields++;
}

const rows: ArrayWithId<ArrayWithId<StringOrNumber>> = [];

let rowId = 0;
for (const item of props.items) {
  const newRow = {
    id: `${rowId}`,
    value: Array(numberOfFields) as ArrayWithId<StringOrNumber>,
  };

  let colId = 0;
  for (let i = 0; i < numberOfFields; i++) {
    newRow.value[i] = { id: `${rowId}${colId}`, value: "" };
    colId++;
  }

  for (const [name, value] of Object.entries(item)) {
    if (name in fieldDict) {
      newRow.value[fieldDict[name]].value = value;
    }
  }

  rows.push(newRow);
  rowId++;
}
</script>

<template>
  <div class="pt-2 overflow-x-auto select-none">
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
          <tr v-for="row in rows" :key="row.id" class="bg-white hover:bg-neutral-200">
            <td v-for="col in row.value" :key="col.id" class="py-2 px-5 border-b border-neutral-200">
              {{ col.value }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
