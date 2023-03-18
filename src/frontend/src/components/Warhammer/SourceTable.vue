<template>
  <div>
    <b-table :items="tableData" :fields="tableFields"></b-table>
  </div>
</template>

<script setup>
import { ref } from "vue";
const tableData = ref([
  { name: "John", age: 30, city: "New York" },
  { name: "Jane", age: 25, city: "San Francisco" },
  { name: "Bob", age: 40, city: "Chicago" },
]);

const tableFields = ref([
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "city", label: "City" },
]);
</script>

<style scoped></style>
