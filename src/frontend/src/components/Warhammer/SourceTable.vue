<template>
  <div>
    <div class="mb-2">Source</div>
    <b-table :items="sourcesTable" :fields="tableFields"></b-table>
    <b-button size="sm" class="mb-2" variant="primary"> Modify </b-button>
  </div>
</template>

<script setup>
import { watch, ref } from "vue";
import { displaySource } from "../../services/wh/utils";

const props = defineProps({
  initialSources: {
    type: Object,
    default() {
      return {};
    },
  },
});

const emits = defineEmits(["update"]);

const sourcesTable = ref([]);

watch(
  () => props.initialSources,
  (newSources) => {
    for (let [k, v] of Object.entries(newSources)) {
      sourcesTable.value.push({ name: k, display: displaySource(k), notes: v });
    }
  }
);

const tableFields = ref([
  { key: "display", label: "Name" },
  { key: "notes", label: "Notes" },
]);
</script>

<style scoped></style>
