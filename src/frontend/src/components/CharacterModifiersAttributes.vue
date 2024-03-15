<script setup lang="ts">
const props = defineProps<{ rows: 1 | 3 | 5 }>();

let attributeNames: string[][];

if (props.rows === 1) {
  attributeNames = [["WS", "BS", "S", "T", "I", "Ag", "Dex", "Int", "WP", "Fel"]];
} else if (props.rows === 3) {
  attributeNames = [
    ["WS", "BS", "S", "T"],
    ["I", "Ag", "Dex", "Int"],
    ["WP", "Fel"],
  ];
} else {
  attributeNames = [
    ["WS", "BS"],
    ["S", "T"],
    ["I", "Ag"],
    ["Dex", "Int"],
    ["WP", "Fel"],
  ];
}
</script>

<template>
  <div v-for="(row, index) in attributeNames" :key="index">
    <div class="rounded-xl border border-neutral-300 bg-neutral-50 mt-2">
      <table class="w-full">
        <tbody>
          <tr>
            <th v-for="attributeName in row" :key="attributeName" class="p-2 font-semibold">
              {{ attributeName }}
            </th>
          </tr>
          <tr>
            <td v-for="attributeName in row" :key="attributeName" class="p-2">
              <slot :name="attributeName"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
