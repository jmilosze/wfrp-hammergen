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
</script>

<template>
  <div v-for="(row, index) in attributeNames" :key="index">
    <div class="rounded-xl border border-neutral-300 bg-neutral-50">
      <table class="w-full">
        <tbody>
          <tr>
            <th v-for="attributeName in row" :key="attributeName" class="p-2 font-semibold text-left">
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
