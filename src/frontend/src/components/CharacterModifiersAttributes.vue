<script setup lang="ts">
import { ref, Ref, watch } from "vue";

const props = defineProps<{ rows: 1 | 3 | 5 }>();

const attributeNames: Ref<string[][]> = ref([]);

watch(
  () => props.rows,
  (newVal) => {
    if (newVal === 1) {
      attributeNames.value = [["WS", "BS", "S", "T", "I", "Ag", "Dex", "Int", "WP", "Fel"]];
    } else if (newVal === 3) {
      attributeNames.value = [
        ["WS", "BS", "S", "T"],
        ["I", "Ag", "Dex", "Int"],
        ["WP", "Fel"],
      ];
    } else {
      attributeNames.value = [
        ["WS", "BS"],
        ["S", "T"],
        ["I", "Ag"],
        ["Dex", "Int"],
        ["WP", "Fel"],
      ];
    }
  },
  { immediate: true },
);

const thClass = ["px-2", "py-2", "border-b", "border-neutral-300"];
const tdClass = ["px-2", "py-2", "border-b", "border-neutral-300"];
</script>

<template>
  <div class="bg-neutral-50 rounded-xl border border-neutral-300 w-full">
    <table v-for="(row, index) in attributeNames" :key="index" class="w-full">
      <thead>
        <tr class="text-left">
          <th v-for="attributeName in row" :key="attributeName" :class="thClass">
            {{ attributeName }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white">
          <td v-for="attributeName in row" :key="attributeName" :class="tdClass">
            <slot :name="attributeName"></slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="bg-neutral-50 rounded-b-xl h-5 w-full"></div>
  </div>
</template>

<style scoped></style>
